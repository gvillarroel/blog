[CmdletBinding()]
param(
    [datetime]$Cutoff = [datetime]'2026-08-14T23:59:59Z',

    [switch]$IncludeRecallExpansion,

    [ValidateRange(0, 30)]
    [int]$RequestDelaySeconds = 5,

    [ValidateRange(1, 200)]
    [int]$PageSize = 200
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# These lanes deliberately target general methods, evaluations, and reasoning
# work. A broad `all:GNN` query would return thousands of narrow applications
# and would not support a meaningful completeness or quality claim.
$queries = [ordered]@{
    'graph-foundation-models' = 'all:"graph foundation model"'
    'graph-rag' = '(all:GraphRAG OR all:"graph retrieval augmented generation" OR all:"graph-augmented RAG" OR all:"graph augmented RAG")'
    'graph-llm-reasoning' = '(ti:"graph reasoning" OR ti:"reasoning on graphs" OR ti:"reasoning over graphs") AND (all:"large language model" OR all:LLM)'
    'neural-algorithmic-reasoning' = 'all:"neural algorithmic reasoning"'
    'graph-algorithm-execution' = '(ti:"graph algorithm" OR ti:"graph algorithms") AND (all:neural OR all:"large language model" OR all:LLM)'
    'gnn-evaluation' = 'all:"graph neural network" AND (ti:benchmark OR ti:evaluation)'
    'graph-learning-diagnostics' = 'all:"graph learning" AND (ti:benchmark OR ti:evaluation OR ti:diagnostic)'
    'knowledge-graph-foundation-models' = '(all:"knowledge graph foundation model" OR all:"inductive knowledge graph reasoning")'
    'graph-generation-foundation-models' = 'all:"graph generation" AND (all:"foundation model" OR all:"large language model")'
    'graph-transformer-evaluation' = 'all:"graph transformer" AND (ti:benchmark OR ti:evaluation)'
    'graph-llm-systems' = '(all:"large language model" OR all:LLM) AND (all:"graph structured data" OR all:"text-attributed graph") AND (all:benchmark OR all:evaluation OR all:reasoning)'
    'llm-graph-evaluation' = '(all:"large language model" OR all:LLM) AND (ti:"graph property" OR ti:"graph properties" OR ti:"graph inference")'
}

if ($IncludeRecallExpansion) {
    $queries.Add('gfm-title', '(ti:"graph foundation" OR ti:"large graph model")')
    $queries.Add('graph-rag-title', '(ti:GraphRAG OR ti:"graph augmented retrieval")')
    $queries.Add('graph-reasoning-title', '(ti:"graph reasoning" OR ti:"graph algorithm")')
    $queries.Add('graph-evaluation-title', '(ti:benchmark OR ti:evaluation OR ti:diagnostic) AND (all:GNN OR all:"graph neural")')
}

function Get-ArxivFeed {
    param(
        [Parameter(Mandatory)]
        [string]$Uri
    )

    $lastFailure = $null
    for ($attempt = 1; $attempt -le 5; $attempt++) {
        try {
            $requestParameters = @{
                UseBasicParsing = $true
                Uri = $Uri
                TimeoutSec = 120
                UserAgent = 'gvillarroel-technical-blog graphs-and-ai discovery/1.0'
            }
            return [xml](Invoke-WebRequest @requestParameters).Content
        }
        catch {
            $lastFailure = $_
            if ($attempt -lt 5) {
                $backoff = [Math]::Min(45, [Math]::Pow(2, $attempt + 1))
                Write-Warning "arXiv request failed (attempt $attempt); retrying in $backoff seconds"
                Start-Sleep -Seconds $backoff
            }
        }
    }

    throw "arXiv API request failed after five attempts: $($lastFailure.Exception.Message)"
}

$startBoundary = '{0}01010000' -f $Cutoff.Year
$endBoundary = $Cutoff.ToUniversalTime().ToString('yyyyMMddHHmm')
$records = @{}
$querySummary = @()
$queryNames = @($queries.Keys)

foreach ($queryName in $queryNames) {
    $boundedQuery = "($($queries[$queryName])) AND submittedDate:[$startBoundary TO $endBoundary]"
    $start = 0
    $queryTotal = $null

    do {
        $encoded = [uri]::EscapeDataString($boundedQuery)
        $uri = "https://export.arxiv.org/api/query?search_query=$encoded&start=$start&max_results=$PageSize&sortBy=submittedDate&sortOrder=descending"
        $feed = Get-ArxivFeed -Uri $uri

        $namespaces = New-Object System.Xml.XmlNamespaceManager($feed.NameTable)
        $namespaces.AddNamespace('a', 'http://www.w3.org/2005/Atom')
        $namespaces.AddNamespace('o', 'http://a9.com/-/spec/opensearch/1.1/')

        if ($null -eq $queryTotal) {
            $queryTotal = [int]$feed.SelectSingleNode('//o:totalResults', $namespaces).InnerText
        }

        $entries = @($feed.SelectNodes('//a:entry', $namespaces))
        foreach ($entry in $entries) {
            $versionedId = $entry.id.Trim().Split('/')[-1]
            $paperId = $versionedId -replace 'v\d+$', ''

            if (-not $records.ContainsKey($paperId)) {
                $records[$paperId] = [ordered]@{
                    id = $paperId
                    versioned_id = $versionedId
                    title = ($entry.title -replace '\s+', ' ').Trim()
                    abstract = ($entry.summary -replace '\s+', ' ').Trim()
                    authors = @($entry.SelectNodes('a:author/a:name', $namespaces) | ForEach-Object { $_.InnerText })
                    published = $entry.published.Trim()
                    updated = $entry.updated.Trim()
                    categories = @($entry.SelectNodes('a:category', $namespaces) | ForEach-Object { $_.term })
                    query_families = @()
                    abs_url = "https://arxiv.org/abs/$paperId"
                    pdf_url = "https://arxiv.org/pdf/$paperId"
                }
            }

            if ($queryName -notin $records[$paperId].query_families) {
                $records[$paperId].query_families += $queryName
            }
        }

        $start += $entries.Count
        if ($start -lt $queryTotal -and $RequestDelaySeconds -gt 0) {
            Start-Sleep -Seconds $RequestDelaySeconds
        }
    } while ($start -lt $queryTotal -and $entries.Count -gt 0)

    $querySummary += [ordered]@{
        name = $queryName
        expression = $queries[$queryName]
        bounded_expression = $boundedQuery
        results = $queryTotal
    }
    Write-Host "[$queryName] $queryTotal candidates"

    if ($RequestDelaySeconds -gt 0 -and $queryName -ne $queryNames[-1]) {
        Start-Sleep -Seconds $RequestDelaySeconds
    }
}

$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$outputDirectory = Join-Path $repositoryRoot '.know\research-discovery'
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
$scope = if ($IncludeRecallExpansion) { 'expanded' } else { 'high-precision' }
$outputPath = Join-Path $outputDirectory "graphs-and-ai-candidates-$($Cutoff.ToUniversalTime().ToString('yyyyMMdd'))-$scope.json"

$payload = [ordered]@{
    schema_version = 1
    generated_at = (Get-Date).ToUniversalTime().ToString('o')
    cutoff = $Cutoff.ToUniversalTime().ToString('o')
    scope = $scope
    query_summary = $querySummary
    deduplicated_candidates = $records.Count
    candidates = @($records.Values | Sort-Object published -Descending)
}

$payload |
    ConvertTo-Json -Depth 8 |
    Set-Content -LiteralPath $outputPath -Encoding utf8

Write-Host "[union] $($records.Count) deduplicated candidates"
Write-Host "[output] $outputPath"
