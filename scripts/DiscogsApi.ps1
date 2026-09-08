<#
.SYNOPSIS
    Función compartida para buscar releases en la API real de Discogs.
    Sin bloque param() de nivel superior a propósito: este archivo se carga con
    dot-source desde otros scripts, y un param() aquí pisaría sus variables
    (el dot-sourcing comparte el mismo scope que el script que lo invoca).
#>

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
        # Discogs pide un User-Agent identificable, no el de un navegador: imitar a
        # Chrome dispara MAS deteccion anti-bot (el handshake TLS no coincide).
        "User-Agent"    = "CommunityMp3Tagger/1.0 +https://motacano.github.io/community/"
        "Authorization" = "Discogs token=$ApiKey"
        "Accept"        = "application/json"
    }

    $queryParams = @("type=release")
    if ($Artista) { $queryParams += "artist=$([Uri]::EscapeDataString($Artista))" }
    if ($Title)   { $queryParams += "release_title=$([Uri]::EscapeDataString($Title))" }
    $freeText = (@($Artista, $Title) -join ' ').Trim()
    if ($freeText) { $queryParams += "q=$([Uri]::EscapeDataString($freeText))" }

    # api.discogs.com es la API REST real; discogs.com es la web (Cloudflare
    # devuelve HTML "Just a moment..." si se le pide JSON). No cambiar el host.
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
