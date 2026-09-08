param (
    [Parameter(Mandatory = $false)]
    [string]$Artista,

    [Parameter(Mandatory = $false)]
    [string]$Title,

    [Parameter(Mandatory = $true, HelpMessage = "Por favor, introduce tu Discogs Personal Access Token.")]
    [string]$ApiKey
)

# api.discogs.com es la API REST; discogs.com es la web (protegida por Cloudflare,
# devuelve HTML "Just a moment..." si se le pide JSON). Por eso el endpoint SIEMPRE
# debe ser api.discogs.com/database/search, nunca discogs.com.
#
# Discogs exige un User-Agent descriptivo propio (no el de un navegador): un UA que
# imita a Chrome dispara MAS deteccion anti-bot, porque el handshake TLS real de
# PowerShell no coincide con el de un navegador de verdad.
function Find-DiscogsRelease {
    [CmdletBinding()]
    param(
        [string]$Artista,
        [string]$Title,
        [Parameter(Mandatory = $true)]
        [string]$ApiKey
    )

    if (-not $Artista -and -not $Title) {
        throw "Debes proporcionar al menos un 'Artista' o un 'Title' para realizar la busqueda."
    }

    $headers = @{
        "User-Agent"    = "CommunityMp3Tagger/1.0 +https://motacano.github.io/community/"
        "Authorization" = "Discogs token=$ApiKey"
        "Accept"        = "application/json"
    }

    $queryParams = @("type=release")
    if ($Artista) { $queryParams += "artist=$([Uri]::EscapeDataString($Artista))" }
    if ($Title)   { $queryParams += "release_title=$([Uri]::EscapeDataString($Title))" }
    # Busqueda de texto libre adicional: cubre casos donde el titulo aparece
    # como parte del nombre del release (remixes, recopilatorios, etc.).
    $freeText = (@($Artista, $Title) -join ' ').Trim()
    if ($freeText) { $queryParams += "q=$([Uri]::EscapeDataString($freeText))" }

    $url = "https://api.discogs.com/database/search?" + ($queryParams -join "&")

    try {
        $respuesta = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
        return $respuesta.results
    }
    catch {
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $body = $reader.ReadToEnd()
            if ($body -match "<title>(.*?)</title>") {
                throw "Error de la API (HTML, probablemente bloqueado por Cloudflare): $($Matches[1])"
            }
            throw "Error al conectar con la API de Discogs: $body"
        }
        throw "Error al conectar con la API de Discogs: $_"
    }
}

if ($MyInvocation.InvocationName -ne '.') {
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
}