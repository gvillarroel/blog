[CmdletBinding()]
param(
    [ValidateSet('agent-harnesses', 'agent-skills', 'agent-context')]
    [string[]]$Domain = @('agent-harnesses', 'agent-skills', 'agent-context'),

    [switch]$RegisterOnly,

    [switch]$SkipExport,

    [switch]$DownloadPdfs,

    [switch]$ExtractPdfText,

    [ValidateRange(0, 30)]
    [int]$RequestDelaySeconds = 3,

    [ValidateRange(1, 200)]
    [int]$BatchSize = 50,

    [ValidateRange(0, 30)]
    [int]$PdfRequestDelaySeconds = 1
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# This is the executable source manifest for the public agent-systems research
# corpus. Keep it aligned with knowledge/public/agent-systems/*.md.
$catalog = [ordered]@{
    'agent-harnesses' = @(
        # 2026: harness architecture, optimization, evaluation, tools, and
        # long-horizon execution. Snapshot cutoff: 2026-08-13.
        '2601.10402', '2601.11868', '2601.12294', '2602.00933',
        '2602.14337', '2602.16069', '2602.22480', '2603.03329',
        '2603.14465', '2603.21972', '2603.28052', '2604.00835',
        '2604.10352', '2604.15715', '2604.16706', '2604.20938',
        '2604.25850', '2605.15846', '2605.18747', '2605.22794',
        '2605.27922', '2605.29682', '2605.30621', '2606.01770',
        '2606.01779', '2606.05922', '2606.06324', '2606.09498',
        '2606.10209', '2606.19613', '2606.22388', '2607.03691',
        '2607.05458', '2607.07946', '2607.08124', '2607.12227',
        '2607.22585', '2608.00267', '2608.00355', '2608.01347',
        '2608.01918', '2608.01964', '2608.02276', '2608.05446',
        '2608.06301', '2608.08654', '2608.09096', '2608.10178',
        '2608.11323', '2608.11727',

        # Seminal and connective work from prior years.
        '2210.03629', '2302.04761', '2305.17126', '2307.13854',
        '2308.03688', '2309.03409', '2309.16797', '2310.03714',
        '2310.06770', '2311.12983', '2401.13178', '2402.01030',
        '2404.07972', '2405.15793', '2406.07496', '2406.12045',
        '2407.16741', '2407.18901', '2408.04682', '2408.08435',
        '2409.11363', '2410.06153', '2410.07095', '2410.10762',
        '2411.15114', '2503.14499', '2504.01848', '2505.22954',
        '2507.19457'
    )

    'agent-skills' = @(
        # 2026: skill architecture, use, generation, evaluation, evolution,
        # lifecycle governance, and empirical security.
        '2601.10338', '2601.21557', '2602.06547', '2602.08004',
        '2602.12430', '2602.12670', '2603.02176', '2603.15401',
        '2604.01687', '2604.03070', '2604.04323', '2605.18693',
        '2605.19576', '2605.23657', '2605.23904', '2605.24117',
        '2606.08755', '2606.11435', '2606.15390', '2607.05297',
        '2607.10113', '2607.16345', '2608.02287', '2608.02636',
        '2608.04828',

        # Earlier systems that established experiential learning, reusable
        # procedures, action creation, and skill libraries.
        '2303.11366', '2305.16291', '2308.10144', '2403.08978',
        '2411.01747', '2504.07079', '2512.17102'
    )

    'agent-context' = @(
        # 2026: context assembly, memory, compaction, standing instructions,
        # checkpoints, and trajectory-driven context evolution.
        '2601.10402', '2601.21557', '2602.16069', '2602.22769',
        '2604.01664', '2604.10352', '2605.20833', '2606.05684',
        '2606.10209', '2606.15903', '2606.29178', '2607.05378',
        '2607.09175', '2607.09691', '2607.23809', '2607.25398',
        '2607.27250', '2608.06503', '2608.09153',

        # Foundations and immediate predecessors.
        '2005.11401', '2307.03172', '2310.08560', '2402.17753',
        '2404.13208', '2406.13352', '2410.10813', '2507.05257',
        '2510.00615', '2510.04618', '2510.24699', '2512.22087'
    )
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

    $header = [System.Text.Encoding]::ASCII.GetString($headerBytes)
    return $header -eq '%PDF-'
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

    for ($attempt = 1; $attempt -le 3; $attempt++) {
        try {
            if (Test-Path -LiteralPath $partial) {
                Remove-Item -LiteralPath $partial -Force
            }

            $requestParameters = @{
                UseBasicParsing = $true
                Uri = $url
                OutFile = $partial
                MaximumRedirection = 5
                TimeoutSec = 120
                UserAgent = 'gvillarroel-technical-blog research corpus/1.0'
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
            if ($attempt -lt 3) {
                Start-Sleep -Seconds ([Math]::Pow(2, $attempt))
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
$selectedIds = @()

foreach ($name in $Domain) {
    $ids = @($catalog[$name])
    $selectedIds += $ids
    $duplicates = @($ids | Group-Object | Where-Object Count -gt 1)
    if ($duplicates.Count -gt 0) {
        $duplicateIds = $duplicates.Name -join ', '
        throw "Duplicate arXiv IDs in ${name}: $duplicateIds"
    }

    if ($name -notin $registeredKeys) {
        Invoke-Know -Arguments @('add', 'key', $name)
        $registeredKeys += $name
    }

    $urls = @($ids | ForEach-Object { "https://arxiv.org/abs/$_" })
    $arguments = @('add', 'arxiv') + $urls + @(
        '--key', $name,
        '--if-missing',
        '--batch-size', $BatchSize.ToString()
    )

    if (-not $RegisterOnly) {
        $arguments += @('--sync', '--request-delay', $RequestDelaySeconds.ToString())
    }

    Write-Host "[$name] registering $($ids.Count) curated papers"
    Invoke-Know -Arguments $arguments

    if (-not $RegisterOnly -and -not $SkipExport) {
        Write-Host "[$name] exporting normalized Markdown"
        Invoke-Know -Arguments @('export', '--key', $name)
    }
}

if ($DownloadPdfs -or $ExtractPdfText) {
    $repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
    $cacheRoot = Join-Path $repositoryRoot '.know\paper-cache\arxiv'
    New-Item -ItemType Directory -Force -Path $cacheRoot | Out-Null

    $uniqueIds = @($selectedIds | Sort-Object -Unique)
    $pdfs = @()
    Write-Host "[paper-cache] validating or downloading $($uniqueIds.Count) unique PDFs"

    for ($index = 0; $index -lt $uniqueIds.Count; $index++) {
        $id = $uniqueIds[$index]
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
        if (($index + 1) % 10 -eq 0 -or $index + 1 -eq $uniqueIds.Count) {
            Write-Host "[paper-cache] $($index + 1)/$($uniqueIds.Count) PDFs ready"
        }
    }

    # The cache is shared by every public research domain. Merge records so
    # bootstrapping one domain never erases another domain's verified hashes.
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

Write-Host 'Agent research knowledge domains are ready.'
