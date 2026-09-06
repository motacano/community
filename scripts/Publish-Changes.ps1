<#
.SYNOPSIS
    Publica los cambios pendientes del repo "community" en GitHub (origin/main),
    imprimiendo en cada paso qué comando de git se ejecuta y por qué.

.DESCRIPTION
    Pensado para este repo (pequeño): no trocea en chunks como Commit-Chunk.ps1
    (ese script es para repos enormes con carpetas "#N"). Aquí simplemente:
      1. Muestra el estado actual (git status --short).
      2. Si no hay cambios, avisa y termina sin hacer nada.
      3. Hace "git add -A" (todo lo modificado/nuevo/borrado).
      4. Hace commit con el mensaje indicado (o uno con fecha/hora por defecto).
      5. Hace push a origin/<Branch>.

.PARAMETER Message
    Mensaje de commit. Si se omite, se usa "chore: sync YYYY-MM-DD HH:mm".

.PARAMETER Branch
    Rama a la que se hace push. Por defecto 'main'.

.PARAMETER NoPush
    Si se indica, hace commit local pero no push.

.EXAMPLE
    .\scripts\Publish-Changes.ps1

.EXAMPLE
    .\scripts\Publish-Changes.ps1 -Message "feat: nueva seccion contacto"
#>
[CmdletBinding()]
param(
    [string]$Message,
    [string]$Branch = 'main',
    [switch]$NoPush
)

$ErrorActionPreference = 'Stop'

# Raiz del repo = carpeta padre de "scripts" (donde vive este script).
$RepoPath = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

Write-Host "== Publish-Changes ==" -ForegroundColor Cyan
Write-Host ("Repo   : {0}" -f $RepoPath) -ForegroundColor Cyan
Write-Host ("Rama   : {0}" -f $Branch) -ForegroundColor Cyan
Write-Host ""

Write-Host "1) Estado actual (git status --short):" -ForegroundColor Yellow
$statusLines = & git -C $RepoPath status --short
if ($statusLines) { $statusLines | ForEach-Object { Write-Host "   $_" } }

if (-not $statusLines) {
    Write-Host ""
    Write-Warning "No hay cambios sin confirmar. Nada que publicar."
    return
}

Write-Host ""
Write-Host "2) git add -A (preparando todos los cambios)..." -ForegroundColor Yellow
& git -C $RepoPath add -A
if ($LASTEXITCODE -ne 0) { throw "git add fallo con codigo $LASTEXITCODE" }

if (-not $Message) {
    $Message = "chore: sync {0}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm')
}

Write-Host ""
Write-Host ("3) git commit -m ""{0}""" -f $Message) -ForegroundColor Yellow
& git -C $RepoPath commit --quiet -m $Message
if ($LASTEXITCODE -ne 0) { throw "git commit fallo con codigo $LASTEXITCODE" }

$hash = (& git -C $RepoPath rev-parse --short HEAD).Trim()
Write-Host "   Commit creado: $hash" -ForegroundColor Green

if ($NoPush) {
    Write-Host ""
    Write-Host "Push omitido (-NoPush)." -ForegroundColor DarkYellow
    return
}

Write-Host ""
Write-Host ("4) git push origin {0}..." -f $Branch) -ForegroundColor Yellow
& git -C $RepoPath push origin $Branch
if ($LASTEXITCODE -ne 0) { throw "git push fallo con codigo $LASTEXITCODE" }

Write-Host ""
Write-Host "Publicado en GitHub correctamente." -ForegroundColor Green
