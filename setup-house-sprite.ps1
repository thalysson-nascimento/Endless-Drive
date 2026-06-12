# Salva a casa 2.5D no projeto
# Execute na raiz do projeto: .\setup-house-sprite.ps1
# Requer: ter baixado house_transparent.png dos outputs do Claude

param(
    [string]$SourcePng = "$PSScriptRoot\house_transparent.png"
)

$dest = Join-Path $PSScriptRoot "public\models\assets\house-a.2-5d.png"
$dir  = Split-Path $dest

if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

if (-not (Test-Path $SourcePng)) {
    Write-Error "PNG nao encontrado em: $SourcePng"
    Write-Host "Baixe o arquivo 'house_transparent.png' dos outputs do Claude e coloque na raiz do projeto."
    exit 1
}

Copy-Item -Path $SourcePng -Destination $dest -Force
Write-Host "casa salva em: $dest"
