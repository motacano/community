<#
.SYNOPSIS
    Publica el sitio compilado en GitHub Pages (rama gh-pages), mostrando cada paso.

.DESCRIPTION
    GitHub Pages sirve desde la rama "gh-pages", que NO se actualiza con un simple
    "git push origin main" -- ese solo sube el codigo fuente. Este script hace lo
    que hace "npm run deploy" en src/package.json, paso a paso y con avisos claros:
      1. npm install (por si faltan dependencias).
      2. ng build --base-href /community/ (build de produccion, salida en dist/).
      3. npx angular-cli-ghpages --dir=dist/community-app/browser
         (publica ese contenido en la rama gh-pages del remoto "origin").

.EXAMPLE
    .\scripts\Deploy-GitHubPages.ps1
#>
[CmdletBinding()]
param(
    [switch]$SkipInstall
)

$ErrorActionPreference = 'Stop'

# Raiz del repo = carpeta padre de "scripts"; el proyecto Angular vive en src/.
$RepoPath = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$SrcPath  = Join-Path $RepoPath 'src'

if (-not (Test-Path (Join-Path $SrcPath 'package.json'))) {
    throw "No se encuentra '$SrcPath\package.json'."
}

Write-Host "== Deploy-GitHubPages ==" -ForegroundColor Cyan
Write-Host ("Proyecto : {0}" -f $SrcPath) -ForegroundColor Cyan
Write-Host ""

Push-Location $SrcPath
try {
    if (-not $SkipInstall) {
        Write-Host "1) npm install (asegurando dependencias)..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) { throw "npm install fallo con codigo $LASTEXITCODE" }
    }
    else {
        Write-Host "1) npm install omitido (-SkipInstall)." -ForegroundColor DarkYellow
    }

    Write-Host ""
    Write-Host "2) ng build --base-href /community/ (build de produccion)..." -ForegroundColor Yellow
    npm run build:ghpages
    if ($LASTEXITCODE -ne 0) { throw "build fallo con codigo $LASTEXITCODE" }

    Write-Host ""
    Write-Host "3) angular-cli-ghpages --dir=dist/community-app/browser (push a rama gh-pages)..." -ForegroundColor Yellow
    npx angular-cli-ghpages --dir=dist/community-app/browser
    if ($LASTEXITCODE -ne 0) { throw "angular-cli-ghpages fallo con codigo $LASTEXITCODE" }
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "Desplegado en https://motacano.github.io/community/" -ForegroundColor Green
Write-Host "(GitHub Pages puede tardar 1-2 minutos en servir la version nueva)." -ForegroundColor Green
