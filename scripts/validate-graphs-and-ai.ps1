[CmdletBinding()]
param(
    [string]$CatalogPath,
    [string]$CachePath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

trap {
    Write-Error -ErrorRecord $_
    exit 1
}

$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
if ([string]::IsNullOrWhiteSpace($CatalogPath)) {
    $CatalogPath = Join-Path $repositoryRoot 'knowledge\public\graphs-and-ai\catalog.json'
}
if ([string]::IsNullOrWhiteSpace($CachePath)) {
    $CachePath = Join-Path $repositoryRoot '.know\paper-cache\arxiv'
}

function Assert-Condition {
    param(
        [Parameter(Mandatory)]
        [bool]$Condition,

        [Parameter(Mandatory)]
        [string]$Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

function Normalize-PaperTitle {
    param([Parameter(Mandatory)][string]$Title)

    $normalized = [regex]::Replace($Title.Trim(), '\s+', ' ')
    return [regex]::Replace($normalized, '\s+([?!,.;:])', '$1')
}

function Get-Sha256Hex {
    param([Parameter(Mandatory)][string]$Path)

    $stream = [System.IO.File]::OpenRead($Path)
    $algorithm = [System.Security.Cryptography.SHA256]::Create()
    try {
        $bytes = $algorithm.ComputeHash($stream)
        return [System.BitConverter]::ToString($bytes).Replace('-', '').ToLowerInvariant()
    }
    finally {
        $algorithm.Dispose()
        $stream.Dispose()
    }
}

$resolvedCatalogPath = (Resolve-Path -LiteralPath $CatalogPath).Path
$resolvedCachePath = (Resolve-Path -LiteralPath $CachePath).Path
$catalog = Get-Content -LiteralPath $resolvedCatalogPath -Raw -Encoding utf8 | ConvertFrom-Json
$catalogPapers = @($catalog.papers)
$catalogIds = @($catalogPapers.id)
$trustedSourceIds = @($catalog.trustedSources.id)

Assert-Condition ($catalogIds.Count -eq @($catalogIds | Sort-Object -Unique).Count) 'Catalog contains duplicate paper IDs.'
Assert-Condition ($trustedSourceIds.Count -eq @($trustedSourceIds | Sort-Object -Unique).Count) 'Catalog contains duplicate trusted-source IDs.'

$sourceJson = & know list sources --key $catalog.domain
if ($LASTEXITCODE -ne 0) {
    throw "know list sources failed for $($catalog.domain) with exit code $LASTEXITCODE"
}
$sourceDocument = ($sourceJson -join "`n") | ConvertFrom-Json
$sources = @($sourceDocument.sources)
$arxivSources = @($sources | Where-Object type -eq 'arxiv')
$siteSources = @($sources | Where-Object type -eq 'site')
$arxivIds = @($arxivSources.paper_id)
$siteIds = @($siteSources.id)

$missingArxivSources = @($catalogIds | Where-Object { $_ -notin $arxivIds })
$extraArxivSources = @($arxivIds | Where-Object { $_ -notin $catalogIds })
$missingSiteSources = @($trustedSourceIds | Where-Object { $_ -notin $siteIds })
$extraSiteSources = @($siteIds | Where-Object { $_ -notin $trustedSourceIds })

Assert-Condition ($sources.Count -eq [int]$catalog.selection.totalSources) "Expected $($catalog.selection.totalSources) know sources; found $($sources.Count)."
Assert-Condition ($arxivSources.Count -eq [int]$catalog.selection.papers) "Expected $($catalog.selection.papers) arXiv sources; found $($arxivSources.Count)."
Assert-Condition ($siteSources.Count -eq [int]$catalog.selection.trustedWebSources) "Expected $($catalog.selection.trustedWebSources) site sources; found $($siteSources.Count)."
Assert-Condition ($missingArxivSources.Count -eq 0) "Missing arXiv sources: $($missingArxivSources -join ', ')"
Assert-Condition ($extraArxivSources.Count -eq 0) "Unexpected arXiv sources: $($extraArxivSources -join ', ')"
Assert-Condition ($missingSiteSources.Count -eq 0) "Missing site sources: $($missingSiteSources -join ', ')"
Assert-Condition ($extraSiteSources.Count -eq 0) "Unexpected site sources: $($extraSiteSources -join ', ')"

$arxivById = @{}
foreach ($source in $arxivSources) {
    $arxivById[[string]$source.paper_id] = $source
}
foreach ($paper in $catalogPapers) {
    $sourceTitle = [string]$arxivById[[string]$paper.id].title
    $catalogTitle = Normalize-PaperTitle ([string]$paper.title)
    $normalizedSourceTitle = Normalize-PaperTitle $sourceTitle
    Assert-Condition ($catalogTitle -ceq $normalizedSourceTitle) "Title mismatch for $($paper.id): '$($paper.title)' versus '$sourceTitle'."
}

$pdfManifestPath = Join-Path $resolvedCachePath 'manifest.json'
$textManifestPath = Join-Path $resolvedCachePath 'full-text-manifest.json'
$pdfManifest = Get-Content -LiteralPath $pdfManifestPath -Raw -Encoding utf8 | ConvertFrom-Json
$textManifest = Get-Content -LiteralPath $textManifestPath -Raw -Encoding utf8 | ConvertFrom-Json
$pdfRecords = @($pdfManifest.papers | Where-Object id -in $catalogIds)
$textRecords = @($textManifest.papers | Where-Object id -in $catalogIds)
$domainFailures = @($textManifest.failures | Where-Object id -in $catalogIds)

$cutoff = if ($catalog.cutoff -is [datetime]) {
    $catalog.cutoff.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
}
else {
    [string]$catalog.cutoff
}

Assert-Condition ($pdfRecords.Count -eq $catalogIds.Count) "Expected $($catalogIds.Count) PDF records; found $($pdfRecords.Count)."
Assert-Condition ($textRecords.Count -eq $catalogIds.Count) "Expected $($catalogIds.Count) text records; found $($textRecords.Count)."
$domainFailureIds = @($domainFailures | ForEach-Object { [string]$_.id })
Assert-Condition ($domainFailures.Count -eq 0) "Text extraction failures: $($domainFailureIds -join ', ')"

$pdfById = @{}
foreach ($record in $pdfRecords) {
    $pdfById[[string]$record.id] = $record
}
$textById = @{}
foreach ($record in $textRecords) {
    $textById[[string]$record.id] = $record
}

$totalPdfBytes = [int64]0
foreach ($id in $catalogIds) {
    Assert-Condition ($pdfById.ContainsKey([string]$id)) "Missing PDF manifest record for $id."
    Assert-Condition ($textById.ContainsKey([string]$id)) "Missing text manifest record for $id."

    $paperDirectory = Join-Path $resolvedCachePath "arxiv-$id"
    $pdfPath = Join-Path $paperDirectory 'paper.pdf'
    $textPath = Join-Path $paperDirectory 'paper.txt'
    Assert-Condition (Test-Path -LiteralPath $pdfPath -PathType Leaf) "Missing PDF for $id."
    Assert-Condition (Test-Path -LiteralPath $textPath -PathType Leaf) "Missing extracted text for $id."

    $pdfFile = Get-Item -LiteralPath $pdfPath
    $totalPdfBytes += $pdfFile.Length
    Assert-Condition ($pdfFile.Length -eq [int64]$pdfById[[string]$id].bytes) "PDF byte count differs from the manifest for $id."

    $pdfStream = [System.IO.File]::OpenRead($pdfPath)
    try {
        $headerBytes = [byte[]]::new(5)
        $bytesRead = $pdfStream.Read($headerBytes, 0, $headerBytes.Length)
    }
    finally {
        $pdfStream.Dispose()
    }
    $pdfHeader = [System.Text.Encoding]::ASCII.GetString($headerBytes, 0, $bytesRead)
    Assert-Condition ($pdfHeader -eq '%PDF-') "Invalid PDF header for $id."

    $actualHash = Get-Sha256Hex $pdfPath
    Assert-Condition ($actualHash -ceq [string]$pdfById[[string]$id].sha256) "PDF hash differs from the download manifest for $id."
    Assert-Condition ($actualHash -ceq [string]$textById[[string]$id].pdf_sha256) "PDF hash differs from the extraction manifest for $id."

    $strictUtf8 = [System.Text.UTF8Encoding]::new($false, $true)
    $text = [System.IO.File]::ReadAllText($textPath, $strictUtf8)
    Assert-Condition ($text.Trim().Length -ge 500) "Extracted text is unexpectedly short for $id."
    $pageMarkers = [regex]::Matches($text, '--- Page ').Count
    Assert-Condition ($pageMarkers -eq [int]$textById[[string]$id].pages) "Page-marker count differs from the extraction manifest for $id."
}

$result = [ordered]@{
    domain = [string]$catalog.domain
    cutoff = $cutoff
    sources = $sources.Count
    arxiv_sources = $arxivSources.Count
    site_sources = $siteSources.Count
    pdfs = $pdfRecords.Count
    pdf_bytes = $totalPdfBytes
    extracted_texts = $textRecords.Count
    extracted_pages = [int64](($textRecords | Measure-Object pages -Sum).Sum)
    extracted_characters = [int64](($textRecords | Measure-Object characters -Sum).Sum)
    hash_failures = 0
    extraction_failures = 0
    shared_cache_pdf_records = @($pdfManifest.papers).Count
    shared_cache_text_records = @($textManifest.papers).Count
}

$result | ConvertTo-Json
