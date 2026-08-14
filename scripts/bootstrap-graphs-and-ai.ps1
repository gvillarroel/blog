[CmdletBinding()]
param(
    [switch]$RegisterOnly,

    [switch]$SkipExport,

    [switch]$DownloadPdfs,

    [switch]$ExtractPdfText,

    [ValidateRange(0, 30)]
    [int]$RequestDelaySeconds = 5,

    [ValidateRange(1, 200)]
    [int]$BatchSize = 40,

    [ValidateRange(0, 30)]
    [int]$PdfRequestDelaySeconds = 1
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$domain = 'graphs-and-ai'
$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$catalogPath = Join-Path $repositoryRoot 'knowledge\public\graphs-and-ai\catalog.json'
$catalog = Get-Content -Raw -LiteralPath $catalogPath | ConvertFrom-Json

if ($catalog.domain -ne $domain) {
    throw "Unexpected catalog domain '$($catalog.domain)' in $catalogPath"
}

$ids = @($catalog.papers | ForEach-Object { $_.id })
$duplicates = @($ids | Group-Object | Where-Object Count -gt 1)
if ($duplicates.Count -gt 0) {
    throw "Duplicate arXiv IDs: $($duplicates.Name -join ', ')"
}

foreach ($paper in $catalog.papers) {
    if ($paper.id -notmatch '^\d{4}\.\d{4,5}$') {
        throw "Invalid arXiv ID in catalog: $($paper.id)"
    }

    $inferredYear = 2000 + [int]$paper.id.Substring(0, 2)
    if ([int]$paper.year -ne $inferredYear) {
        throw "Year mismatch for $($paper.id): catalog=$($paper.year), inferred=$inferredYear"
    }
}

if ([int]$catalog.selection.papers -ne $ids.Count) {
    throw "Catalog count mismatch: declared=$($catalog.selection.papers), actual=$($ids.Count)"
}

function Invoke-Know {
    param(
        [Parameter(Mandatory)]
        [string[]]$Arguments,

        [switch]$PassThru
    )

    if ($PassThru) {
        $output = & know @Arguments
    }
    else {
        & know @Arguments | Out-Null
    }

    if ($LASTEXITCODE -ne 0) {
        throw "know exited with code ${LASTEXITCODE}: know $($Arguments -join ' ')"
    }

    if ($PassThru) {
        $output
    }
}

function Test-PdfFile {
    param(
        [Parameter(Mandatory)]
        [string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        return $false
    }

    $file = Get-Item -LiteralPath $Path
    if ($file.Length -lt 1KB) {
        return $false
    }

    $headerBytes = New-Object byte[] 5
    $stream = [System.IO.File]::OpenRead($Path)
    try {
        $bytesRead = $stream.Read($headerBytes, 0, $headerBytes.Length)
    }
    finally {
        $stream.Dispose()
    }

    if ($bytesRead -ne $headerBytes.Length) {
        return $false
    }

    return [System.Text.Encoding]::ASCII.GetString($headerBytes) -eq '%PDF-'
}

function Save-ArxivPdf {
    param(
        [Parameter(Mandatory)]
        [string]$PaperId,

        [Parameter(Mandatory)]
        [string]$CacheRoot
    )

    $paperDirectory = Join-Path $CacheRoot "arxiv-$PaperId"
    New-Item -ItemType Directory -Force -Path $paperDirectory | Out-Null

    $destination = Join-Path $paperDirectory 'paper.pdf'
    if (Test-PdfFile -Path $destination) {
        return $destination
    }

    $partial = Join-Path $paperDirectory 'paper.pdf.partial'
    $url = "https://arxiv.org/pdf/$PaperId"
    $lastFailure = $null

    for ($attempt = 1; $attempt -le 4; $attempt++) {
        try {
            if (Test-Path -LiteralPath $partial) {
                Remove-Item -LiteralPath $partial -Force
            }

            $requestParameters = @{
                UseBasicParsing = $true
                Uri = $url
                OutFile = $partial
                MaximumRedirection = 5
                TimeoutSec = 180
                UserAgent = 'gvillarroel-technical-blog graphs-and-ai corpus/1.0'
            }
            Invoke-WebRequest @requestParameters

            if (-not (Test-PdfFile -Path $partial)) {
                throw "Downloaded response is not a valid PDF: $url"
            }

            Move-Item -LiteralPath $partial -Destination $destination -Force
            return $destination
        }
        catch {
            $lastFailure = $_
            if ($attempt -lt 4) {
                Start-Sleep -Seconds ([Math]::Min(30, [Math]::Pow(2, $attempt)))
            }
        }
    }

    if (Test-Path -LiteralPath $partial) {
        Remove-Item -LiteralPath $partial -Force
    }
    throw "Unable to download arXiv paper ${PaperId}: $($lastFailure.Exception.Message)"
}

$keyPayload = Invoke-Know -Arguments @('list', 'keys', '--format', 'json') -PassThru |
    ConvertFrom-Json
$registeredKeys = @($keyPayload.keys)

if ($domain -notin $registeredKeys) {
    Invoke-Know -Arguments @('add', 'key', $domain)
}

$urls = @($ids | ForEach-Object { "https://arxiv.org/abs/$_" })
$arguments = @('add', 'arxiv') + $urls + @(
    '--key', $domain,
    '--if-missing',
    '--batch-size', $BatchSize.ToString()
)

if (-not $RegisterOnly) {
    $arguments += @('--sync', '--request-delay', $RequestDelaySeconds.ToString())
}

Write-Host "[$domain] registering $($ids.Count) curated papers"
Invoke-Know -Arguments $arguments

$sourcePayload = Invoke-Know -Arguments @('list', 'sources', '--key', $domain, '--format', 'json') -PassThru |
    ConvertFrom-Json
$registeredSourceIds = @($sourcePayload.sources | ForEach-Object { $_.id })

foreach ($source in @($catalog.trustedSources)) {
    if ($source.id -notin $registeredSourceIds) {
        Write-Host "[$domain] registering trusted site $($source.id)"
        Invoke-Know -Arguments @(
            'add', 'site', $source.url,
            '--key', $domain,
            '--source-id', $source.id,
            '--max-depth', ([int]$source.maxDepth).ToString(),
            '--max-pages', ([int]$source.maxPages).ToString()
        )
        $registeredSourceIds += $source.id
    }

    if (-not $RegisterOnly) {
        Write-Host "[$domain] synchronizing trusted site $($source.id)"
        Invoke-Know -Arguments @('sync', 'site', $source.url, '--key', $domain)
    }
}

if (-not $RegisterOnly -and -not $SkipExport) {
    Write-Host "[$domain] exporting normalized Markdown"
    Invoke-Know -Arguments @('export', '--key', $domain)
}

if ($DownloadPdfs -or $ExtractPdfText) {
    $cacheRoot = Join-Path $repositoryRoot '.know\paper-cache\arxiv'
    New-Item -ItemType Directory -Force -Path $cacheRoot | Out-Null

    $pdfs = @()
    Write-Host "[paper-cache] validating or downloading $($ids.Count) graphs-and-ai PDFs"

    for ($index = 0; $index -lt $ids.Count; $index++) {
        $id = $ids[$index]
        $existingPath = Join-Path $cacheRoot "arxiv-$id\paper.pdf"
        $wasCached = Test-PdfFile -Path $existingPath
        $pdfPath = Save-ArxivPdf -PaperId $id -CacheRoot $cacheRoot
        $file = Get-Item -LiteralPath $pdfPath
        $hash = (Get-FileHash -LiteralPath $pdfPath -Algorithm SHA256).Hash.ToLowerInvariant()
        $pdfs += [ordered]@{
            id = $id
            url = "https://arxiv.org/pdf/$id"
            file = ".know/paper-cache/arxiv/arxiv-$id/paper.pdf"
            bytes = $file.Length
            sha256 = $hash
        }

        if (-not $wasCached -and $PdfRequestDelaySeconds -gt 0) {
            Start-Sleep -Seconds $PdfRequestDelaySeconds
        }
        if (($index + 1) % 10 -eq 0 -or $index + 1 -eq $ids.Count) {
            Write-Host "[paper-cache] $($index + 1)/$($ids.Count) graphs-and-ai PDFs ready"
        }
    }

    $manifestPath = Join-Path $cacheRoot 'manifest.json'
    $paperIndex = @{}
    if (Test-Path -LiteralPath $manifestPath -PathType Leaf) {
        $existingManifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
        foreach ($paper in @($existingManifest.papers)) {
            $paperIndex[$paper.id] = $paper
        }
    }
    foreach ($paper in $pdfs) {
        $paperIndex[$paper.id] = $paper
    }

    $cacheManifest = [ordered]@{
        schema_version = 1
        generated_at = (Get-Date).ToUniversalTime().ToString('o')
        papers = @($paperIndex.Values | Sort-Object id)
    }
    $cacheManifest |
        ConvertTo-Json -Depth 5 |
        Set-Content -LiteralPath $manifestPath -Encoding utf8

    if ($ExtractPdfText) {
        Write-Host '[paper-cache] extracting full text with pypdf'
        & python (Join-Path $PSScriptRoot 'extract-agent-research-pdfs.py') --cache $cacheRoot
        if ($LASTEXITCODE -ne 0) {
            throw "PDF text extraction exited with code $LASTEXITCODE"
        }
    }
}

Write-Host 'Graphs and AI knowledge domain is ready.'
