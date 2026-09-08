param (
    [Parameter(Mandatory = $false)]
    [string]$Artista,

    [Parameter(Mandatory = $false)]
    [string]$Title,

    [Parameter(Mandatory = $true, HelpMessage = "Por favor, introduce tu Discogs Personal Access Token.")]
    [string]$ApiKey
)

# La función Find-DiscogsRelease vive en DiscogsApi.ps1 (sin param() propio) para
# poder compartirla vía dot-source sin que pise las variables de otros scripts.
. (Join-Path $PSScriptRoot 'DiscogsApi.ps1')

if (-not $Artista -and -not $Title) {
    Write-Error "Debes proporcionar al menos un '-Artista' o un '-Title' para realizar la búsqueda."
    return
}

try {
    Write-Host "Buscando en Discogs..." -ForegroundColor Cyan
    $resultados = Find-DiscogsRelease -Artista $Artista -Title $Title -ApiKey $ApiKey

    if (-not $resultados -or $resultados.Count -eq 0) {
        Write-Host "No se encontraron resultados para los criterios especificados." -ForegroundColor Yellow
    }
    else {
        Write-Host "`nSe encontraron $($resultados.Count) resultados:" -ForegroundColor Green
        $resultados | Select-Object title, type, year, country | Format-Table -AutoSize
    }
}
catch {
    Write-Error $_
}