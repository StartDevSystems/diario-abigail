# ============================================================
#  verificar.ps1 — Diario de Abigail
#  Corre este script desde la raiz de tu proyecto:
#  .\verificar.ps1
# ============================================================

$OK    = "[OK]"
$FAIL  = "[ERROR]"
$WARN  = "[AVISO]"
$errores = 0

Write-Host ""
Write-Host "============================================" -ForegroundColor Magenta
Write-Host "   Verificador — Diario de Abigail 🌸" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta
Write-Host ""

# ── 1. ARCHIVOS REQUERIDOS ───────────────────────────────────
Write-Host ">> Comprobando archivos..." -ForegroundColor Cyan

$archivos = @(
    "src/app/globals.css",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/components/Layout.tsx",
    "src/components/Scene3D.tsx",
    "src/components/FloralDecoration.tsx",
    "src/context/JournalContext.tsx",
    "src/pages/Hoy.tsx",
    "src/pages/Devocional.tsx",
    "src/pages/Habitos.tsx",
    "src/pages/Semana.tsx",
    "src/pages/Notas.tsx",
    "src/types/index.ts",
    "next.config.mjs",
    "postcss.config.mjs",
    "package.json"
)

foreach ($archivo in $archivos) {
    if (Test-Path $archivo) {
        Write-Host "  $OK  $archivo" -ForegroundColor Green
    } else {
        Write-Host "  $FAIL  $archivo  <-- NO EXISTE" -ForegroundColor Red
        $errores++
    }
}

# ── 2. DEPENDENCIAS EN package.json ─────────────────────────
Write-Host ""
Write-Host ">> Comprobando dependencias..." -ForegroundColor Cyan

$pkg = Get-Content "package.json" | ConvertFrom-Json
$deps = @("framer-motion", "lucide-react", "next", "react", "react-dom")

foreach ($dep in $deps) {
    $enDeps    = $pkg.dependencies.PSObject.Properties.Name -contains $dep
    $enDevDeps = $pkg.devDependencies.PSObject.Properties.Name -contains $dep
    if ($enDeps -or $enDevDeps) {
        Write-Host "  $OK  $dep instalado" -ForegroundColor Green
    } else {
        Write-Host "  $FAIL  $dep NO encontrado en package.json" -ForegroundColor Red
        $errores++
    }
}

# ── 3. node_modules existe ───────────────────────────────────
Write-Host ""
Write-Host ">> Comprobando node_modules..." -ForegroundColor Cyan

if (Test-Path "node_modules") {
    Write-Host "  $OK  node_modules existe" -ForegroundColor Green
} else {
    Write-Host "  $FAIL  node_modules no existe — corre: npm install" -ForegroundColor Red
    $errores++
}

# 4. TYPESCRIPT
Write-Host ""
Write-Host ">> Corriendo TypeScript..." -ForegroundColor Cyan

$tscOutput = & npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  [OK]    Sin errores de TypeScript" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] Errores de TypeScript:" -ForegroundColor Red
    foreach ($line in $tscOutput) {
        Write-Host "          $line" -ForegroundColor Yellow
    }
    $errores++
}

# RESUMEN
Write-Host ""
Write-Host "============================================" -ForegroundColor Magenta
if ($errores -eq 0) {
    Write-Host "  TODO BIEN - 0 errores encontrados" -ForegroundColor Green
} else {
    Write-Host "  $errores error(es) encontrado(s)" -ForegroundColor Red
}
Write-Host "============================================" -ForegroundColor Magenta
Write-Host ""
