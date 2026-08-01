[CmdletBinding(DefaultParameterSetName = 'Search')]
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('software-engineering', 'data-science')]
    [string] $Domain,

    [Parameter(ParameterSetName = 'Search', Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string] $Query,

    [Parameter(ParameterSetName = 'Search')]
    [ValidateRange(1, 50)]
    [int] $TopK = 10,

    [Parameter(ParameterSetName = 'Inspect', Mandatory = $true)]
    [switch] $Inspect,

    [Parameter(ParameterSetName = 'Inspect')]
    [switch] $DeepValidation,

    [switch] $Compact
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$catalog = Get-Content -Raw -LiteralPath (Join-Path $projectRoot 'knowledge\catalog.json') |
    ConvertFrom-Json
$expert = $catalog.experts | Where-Object { $_.id -eq $Domain } | Select-Object -First 1
if (-not $expert) { throw "Unknown expert domain: $Domain" }

$bundle = Join-Path $projectRoot $expert.localBundle
if (-not (Test-Path -LiteralPath $bundle -PathType Container)) {
    throw "Expert bundle is missing. Run scripts/bootstrap-knowledge.ps1 first."
}

$sourceRepository = (Resolve-Path -LiteralPath (Join-Path $projectRoot $catalog.sourceRepository)).Path
$skillRoot = Join-Path $sourceRepository $expert.querySkill
$commandOutput = $null

if ($Domain -eq 'software-engineering') {
    $queryTool = Join-Path $skillRoot 'scripts\query_semantic_okf_classical.py'
    if ($Inspect) {
        $arguments = @('-B', $queryTool, $bundle, 'inspect')
        if ($DeepValidation) { $arguments += '--deep-validation' }
    }
    else {
        $arguments = @(
            '-B', $queryTool, $bundle, 'search',
            '--query', $Query,
            '--mode', [string]$expert.policy,
            '--top-k', [string]$TopK
        )
    }
    if ($Compact) { $commandOutput = & python @arguments }
    else { & python @arguments }
}
else {
    $queryTool = Join-Path $skillRoot 'scripts\run_query.ps1'
    if ($Inspect) {
        $arguments = @($bundle)
        if ($DeepValidation) { $arguments += '--deep-validation' }
        $arguments += 'inspect'
    }
    else {
        $arguments = @(
            $bundle, 'search',
            '--policy', [string]$expert.policy,
            '--query', $Query,
            '--top-k', [string]$TopK
        )
    }
    if ($Compact) { $commandOutput = & $queryTool @arguments }
    else { & $queryTool @arguments }
}

if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
if ($Compact) {
    $commandOutput | ConvertFrom-Json | ConvertTo-Json -Depth 100 -Compress
}
