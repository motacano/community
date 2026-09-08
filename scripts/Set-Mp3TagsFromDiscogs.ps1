<#
.SYNOPSIS
    Busca en Discogs el artista de un mp3 a partir de su título (nombre de archivo)
    y escribe los tags ID3v2.3 (TIT2=título, TPE1=artista) en el propio fichero.

.DESCRIPTION
    1. Si no se indica -Title, lo deduce del nombre de archivo (sin extensión).
    2. Llama a la API real de Discogs (dot-sourcing discog-Find-Song.ps1) buscando
       por ese título.
    3. Muestra los resultados y te deja elegir cuál es el correcto (o usa -Auto
       para quedarse siempre con el primero, sin preguntar).
    4. El artista se extrae del campo "title" de Discogs, que viene con el
       formato "Artista - Título del release".
    5. Escribe un tag ID3v2.3 nuevo al principio del mp3 con TIT2/TPE1,
       reemplazando cualquier tag ID3v2 previo (no toca el resto del audio).
       Se hace una copia de seguridad "<archivo>.bak" antes de tocar nada.

.PARAMETER Mp3Path
    Ruta al archivo .mp3 a etiquetar.

.PARAMETER ApiKey
    Discogs Personal Access Token. Mejor pasarlo via $env:DISCOGS_TOKEN que en texto plano.

.PARAMETER Title
    Título a buscar en Discogs. Si se omite, se deduce del nombre de archivo.

.PARAMETER Auto
    Si se indica, coge automáticamente el primer resultado sin preguntar.

.EXAMPLE
    .\scripts\Set-Mp3TagsFromDiscogs.ps1 -Mp3Path "C:\musica\Your Own Reality (Tracid Mix).mp3" -ApiKey $env:DISCOGS_TOKEN
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$Mp3Path,

    [Parameter(Mandatory = $true)]
    [string]$ApiKey,

    [string]$Title,

    [switch]$Auto
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Mp3Path)) {
    throw "No se encuentra el archivo '$Mp3Path'."
}
$Mp3Path = (Resolve-Path -LiteralPath $Mp3Path).Path

# Reutilizamos Find-DiscogsRelease definido en discog-Find-Song.ps1.
. (Join-Path $PSScriptRoot 'discog-Find-Song.ps1') -ApiKey $ApiKey -Title 'placeholder' -Artista 'placeholder' *> $null

if (-not $Title) {
    $Title = [System.IO.Path]::GetFileNameWithoutExtension($Mp3Path)
}
Write-Host "Título de búsqueda: $Title" -ForegroundColor Cyan

$resultados = Find-DiscogsRelease -Title $Title -ApiKey $ApiKey
if (-not $resultados -or $resultados.Count -eq 0) {
    throw "Discogs no devolvió resultados para '$Title'."
}

Write-Host "`nResultados encontrados:" -ForegroundColor Green
for ($i = 0; $i -lt $resultados.Count; $i++) {
    Write-Host ("[{0}] {1} ({2}, {3})" -f $i, $resultados[$i].title, $resultados[$i].year, $resultados[$i].country)
}

$elegido = $resultados[0]
if (-not $Auto -and $resultados.Count -gt 1) {
    $idx = Read-Host "`nElige el número del resultado correcto (Enter = 0)"
    if ($idx -match '^\d+$' -and [int]$idx -lt $resultados.Count) {
        $elegido = $resultados[[int]$idx]
    }
}

# Discogs devuelve "title" como "Artista - Título del release".
$partes = $elegido.title -split ' - ', 2
$artista = if ($partes.Count -eq 2) { $partes[0].Trim() } else { 'Desconocido' }
$tituloFinal = if ($partes.Count -eq 2) { $partes[1].Trim() } else { $elegido.title }

Write-Host "`nArtista detectado : $artista" -ForegroundColor Yellow
Write-Host "Título detectado  : $tituloFinal" -ForegroundColor Yellow

function ConvertTo-Synchsafe([int]$Size) {
    $bytes = [byte[]]::new(4)
    $bytes[0] = ($Size -shr 21) -band 0x7F
    $bytes[1] = ($Size -shr 14) -band 0x7F
    $bytes[2] = ($Size -shr 7) -band 0x7F
    $bytes[3] = $Size -band 0x7F
    return $bytes
}

function New-Id3TextFrame([string]$FrameId, [string]$Text) {
    # Encoding 0x01 = UTF-16 con BOM: soporta acentos/ñ sin depender de ISO-8859-1.
    $bom = [byte[]](0xFF, 0xFE)
    $textBytes = [System.Text.Encoding]::Unicode.GetBytes($Text)
    $payload = [byte[]](0x01) + $bom + $textBytes

    $idBytes = [System.Text.Encoding]::ASCII.GetBytes($FrameId)
    # En ID3v2.3 el tamaño de frame es un entero de 32 bits normal (NO synchsafe).
    $sizeBytes = [BitConverter]::GetBytes([int]$payload.Length)
    if ([BitConverter]::IsLittleEndian) { [Array]::Reverse($sizeBytes) }
    $flags = [byte[]](0x00, 0x00)

    return $idBytes + $sizeBytes + $flags + $payload
}

$titleFrame = New-Id3TextFrame -FrameId 'TIT2' -Text $tituloFinal
$artistFrame = New-Id3TextFrame -FrameId 'TPE1' -Text $artista
$framesBytes = $titleFrame + $artistFrame

$header = [System.Text.Encoding]::ASCII.GetBytes('ID3') + [byte[]](0x03, 0x00, 0x00) + (ConvertTo-Synchsafe $framesBytes.Length)
$newTag = $header + $framesBytes

$original = [System.IO.File]::ReadAllBytes($Mp3Path)

$audioStart = 0
if ($original.Length -ge 10 -and [System.Text.Encoding]::ASCII.GetString($original, 0, 3) -eq 'ID3') {
    $oldSize = (($original[6] -band 0x7F) -shl 21) -bor (($original[7] -band 0x7F) -shl 14) -bor (($original[8] -band 0x7F) -shl 7) -bor ($original[9] -band 0x7F)
    $audioStart = 10 + $oldSize
}
$audioBytes = $original[$audioStart..($original.Length - 1)]

$backupPath = "$Mp3Path.bak"
if (-not (Test-Path -LiteralPath $backupPath)) {
    Copy-Item -LiteralPath $Mp3Path -Destination $backupPath
    Write-Host "Copia de seguridad creada: $backupPath" -ForegroundColor DarkYellow
}

[System.IO.File]::WriteAllBytes($Mp3Path, $newTag + $audioBytes)
Write-Host "`nTags escritos correctamente en '$Mp3Path'." -ForegroundColor Green
