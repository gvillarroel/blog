[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$catalogPath = Join-Path $projectRoot 'knowledge\catalog.json'
$catalog = Get-Content -Raw -LiteralPath $catalogPath | ConvertFrom-Json
$sourceRepository = (Resolve-Path -LiteralPath (Join-Path $projectRoot $catalog.sourceRepository)).Path
$localRoot = Join-Path $projectRoot 'knowledge\expert-sources'
$store = Join-Path $projectRoot '.know'
$know = Get-Command know -CommandType Application -ErrorAction Stop | Select-Object -First 1

New-Item -ItemType Directory -Path $localRoot -Force | Out-Null
New-Item -ItemType Directory -Path $store -Force | Out-Null

foreach ($expert in $catalog.experts) {
    $target = (Resolve-Path -LiteralPath (Join-Path $sourceRepository $expert.sourceBundle)).Path
    $link = Join-Path $projectRoot $expert.localBundle

    if (Test-Path -LiteralPath $link) {
        $item = Get-Item -Force -LiteralPath $link
        if (-not ($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint)) {
            throw "$link exists but is not a junction. Refusing to replace it."
        }
        $actualTarget = [System.IO.Path]::GetFullPath([string]$item.Target)
        if ($actualTarget -ne [System.IO.Path]::GetFullPath($target)) {
            throw "$link targets $actualTarget instead of $target. Refusing to replace it."
        }
    }
    else {
        New-Item -ItemType Junction -Path $link -Target $target | Out-Null
    }

    $keys = (& $know.Source --store $store --json list keys | ConvertFrom-Json).keys
    if ($keys -notcontains $expert.id) {
        & $know.Source --store $store add key $expert.id | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "Unable to create know key $($expert.id)." }
    }

    $listed = & $know.Source --store $store --json list sources --key $expert.id | ConvertFrom-Json
    $sourceName = "$($expert.id)-expert"
    $existingSources = @($listed.sources)
    if (-not ($existingSources | Where-Object { $_.title -eq $sourceName })) {
        $sourceCommand = if ($expert.id -eq 'software-engineering') {
            Join-Path $projectRoot 'scripts\query-software-expert.cmd'
        }
        else {
            Join-Path $projectRoot 'scripts\query-data-science-expert.cmd'
        }
        & $know.Source --store $store add television $sourceName `
            --key $expert.id `
            --description $expert.description `
            --source-command $sourceCommand | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "Unable to register know source $sourceName." }
        & $know.Source --store $store sync television $sourceName --key $expert.id | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "Unable to synchronize know source $sourceName." }
    }
}

& $know.Source --store $store list sources
if ($LASTEXITCODE -ne 0) { throw 'Unable to list registered expert sources.' }
