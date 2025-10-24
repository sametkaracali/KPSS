Write-Host "Temizlik başlatılıyor..." -ForegroundColor Cyan

# Remove unnecessary markdown files
$filesToRemove = @(
    "SETUP.md",
    "QUICK_FIX.md",
    "PROJECT_*.md",
    "FINAL_TEST_REPORT.md",
    "DEVELOPMENT.md",
    "DEPLOYMENT.md",
    "COMPREHENSIVE_TEST_REPORT.md",
    "MANUAL_TEST_CHECKLIST.md",
    "IMPLEMENTATION_GUIDE.md"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force -ErrorAction SilentlyContinue
        Write-Host "Silindi: $file" -ForegroundColor Yellow
    }
}

# Rename new README if it exists
if (Test-Path "README_NEW.md") {
    if (Test-Path "README.md") {
        Remove-Item -Path "README.md" -Force -ErrorAction SilentlyContinue
    }
    Rename-Item -Path "README_NEW.md" -NewName "README.md"
    Write-Host "README.md guncellendi" -ForegroundColor Green
}

# Make scripts executable (for WSL/Linux environments)
if (Get-Command bash -ErrorAction SilentlyContinue) {
    bash -c 'chmod +x setup.sh'
    bash -c 'chmod +x cleanup.sh'
}

Write-Host "Temizlik tamamlandi!" -ForegroundColor Green
