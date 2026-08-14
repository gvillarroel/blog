[CmdletBinding()]
param(
    [datetime]$Cutoff = [datetime]'2026-08-13T23:59:59Z',

    [switch]$IncludeRecallExpansion,

    [ValidateRange(0, 30)]
    [int]$RequestDelaySeconds = 3,

    [ValidateRange(1, 200)]
    [int]$PageSize = 200
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$queries = [ordered]@{
    'agent-harness' = 'all:"agent harness"'
    'agent-skills' = 'all:"agent skills"'
    'skill-evolution' = 'all:"skill evolution" AND all:agent'
    'context-engineering' = 'all:"context engineering" AND all:agent'
    'long-horizon-agents' = 'all:"long-horizon agents"'
    'tool-using-agents' = 'all:"tool-using agents"'
}

if ($IncludeRecallExpansion) {
    $queries.Add('harness-title', '(ti:harness OR ti:harnesses OR ti:scaffold)')
    $queries.Add('skill-title', '(ti:skill OR ti:skills) AND all:agent')
    $queries.Add('context-title', '(ti:context OR ti:memory OR ti:compaction) AND all:agent')
}

function Get-ArxivFeed {
    param(
        [Parameter(Mandatory)]
        [string]$Uri
    )

    $lastFailure = $null
    for ($attempt = 1; $attempt -le 3; $attempt++) {
        try {
            $requestParameters = @{
                UseBasicParsing = $true
                Uri = $Uri
                TimeoutSec = 90
                UserAgent = 'gvillarroel-technical-blog research discovery/1.0'
            }
            return [xml](Invoke-WebRequest @requestParameters).Content
        }
        catch {
            $lastFailure = $_
            if ($attempt -lt 3) {
                Start-Sleep -Seconds ([Math]::Pow(2, $attempt))
            }
        }
    }

    throw "arXiv API request failed after three attempts: $($lastFailure.Exception.Message)"
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
$outputPath = Join-Path $outputDirectory "arxiv-candidates-$($Cutoff.ToUniversalTime().ToString('yyyyMMdd'))-$scope.json"

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
