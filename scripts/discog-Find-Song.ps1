param (
    [Parameter(Mandatory = $false)]
    [string]$Artista,

    [Parameter(Mandatory = $false)]
    [string]$Title,

    [Parameter(Mandatory = $true, HelpMessage = "Por favor, introduce tu Discogs Personal Access Token.")]
    [string]$ApiKey
)

if (-not $Artista -and -not $Title) {
    Write-Error "Debes proporcionar al menos un '-Artista' o un '-Title' para realizar la búsqueda."
    return
}

# 1. Modificamos los encabezados para imitar a un navegador real (Evita el bloqueo de Cloudflare)
$headers = @{
    "User-Agent"      = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    "Authorization"   = "Discogs token=$ApiKey"
    "Accept"          = "application/json"
    "Accept-Language" = "es-ES,es;q=0.9"
}

# 2. IMPORTANTE: Forzamos el endpoint estricto de la API (api.discogs.com)
$baseUrl = "https://discogs.com?"
$queryParams = @()

if ($Artista) { $queryParams += "artist=$([Uri]::EscapeDataString($Artista))" }
if ($Title)   { $queryParams += "title=$([Uri]::EscapeDataString($Title))" }

$url = $baseUrl + ($queryParams -join "&")

try {
    Write-Host "Buscando en Discogs..." -ForegroundColor Cyan
    
    # 3. Hacemos la petición HTTP GET
    $respuesta = Invoke-RestMethod -Uri $url -Method Get -Headers $headers

    if ($respuesta.results.Count -eq 0) {
        Write-Host "No se encontraron resultados para los criterios especificados." -ForegroundColor Yellow
    } else {
        Write-Host "`nSe encontraron $($respuesta.results.Count) resultados:" -ForegroundColor Green
        $respuesta.results | Select-Object title, type, year, country | Format-Table -AutoSize
    }
}
catch {
    # Si Cloudflare sigue respondiendo en HTML, capturamos el texto legible en vez de todo el código
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $htmlError = $reader.ReadToEnd()
        if ($htmlError -match "<title>(.*?)</title>") {
            Write-Error "Error de la API (HTML): $($Matches[1])"
        } else {
            Write-Error "Error al conectar con la API: $_"
        }
    } else {
        Write-Error "Error al conectar con la API de Discogs: $_"
    }
}