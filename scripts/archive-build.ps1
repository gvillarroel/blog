[CmdletBinding()]
param(
    [string] $DestinationRoot = 'C:\Users\villa\projects\blog',
    [switch] $SkipBuild
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$dist = Join-Path $projectRoot 'dist'

if (-not $SkipBuild) {
    & npm run build
    if ($LASTEXITCODE -ne 0) { throw 'Astro build failed; no archive was created.' }
}
if (-not (Test-Path -LiteralPath $dist -PathType Container)) {
    throw 'The dist directory does not exist. Build the site first.'
}

$timestamp = [DateTime]::UtcNow.ToString('yyyyMMddTHHmmssZ')
New-Item -ItemType Directory -Path $DestinationRoot -Force | Out-Null
$destination = Join-Path (Resolve-Path -LiteralPath $DestinationRoot).Path $timestamp
if (Test-Path -LiteralPath $destination) {
    throw "Archive destination already exists: $destination"
}

New-Item -ItemType Directory -Path $destination | Out-Null
Copy-Item -Path (Join-Path $dist '*') -Destination $destination -Recurse
Write-Output $destination
