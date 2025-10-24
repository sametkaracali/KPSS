Write-Host "🚀 SINAV-TR FINAL TEST BAŞLADI" -ForegroundColor Green

Write-Host "`n📡 API Testleri..." -ForegroundColor Yellow
try { $health = curl http://localhost:3001/api/health -UseBasicParsing; Write-Host "✅ API Health: $($health.StatusCode)" } catch { Write-Host "❌ API Health Failed" }
try { $questions = curl http://localhost:3001/api/questions -UseBasicParsing; Write-Host "✅ Questions API: $($questions.StatusCode)" } catch { Write-Host "❌ Questions API Failed" }
try { $exams = curl http://localhost:3001/api/exams -UseBasicParsing; Write-Host "✅ Exams API: $($exams.StatusCode)" } catch { Write-Host "❌ Exams API Failed" }

Write-Host "`n🌐 Frontend Testleri..." -ForegroundColor Yellow
$pages = @("/", "/sorular", "/videolar", "/denemeler", "/yks", "/kpss", "/dashboard", "/performans", "/rozetler", "/liderlik")
foreach ($page in $pages) {
    try { 
        $response = curl "http://localhost:3000$page" -UseBasicParsing
        Write-Host "✅ $page : $($response.StatusCode)" 
    } catch { 
        Write-Host "❌ $page : Failed" 
    }
}

Write-Host "`n🔍 TypeScript Kontrolü..." -ForegroundColor Yellow
cd apps/web; $webTS = npx tsc --noEmit 2>&1; cd ../..
cd apps/api; $apiTS = npx tsc --noEmit 2>&1; cd ../..
if ($webTS -match "error") { Write-Host "❌ Web TS Errors" } else { Write-Host "✅ Web TS OK" }
if ($apiTS -match "error") { Write-Host "❌ API TS Errors" } else { Write-Host "✅ API TS OK" }

Write-Host "`n📊 Port Durumu..." -ForegroundColor Yellow
$port3000 = netstat -ano | findstr ":3000"
$port3001 = netstat -ano | findstr ":3001"
if ($port3000) { Write-Host "✅ Port 3000: Aktif" } else { Write-Host "❌ Port 3000: Kapalı" }
if ($port3001) { Write-Host "✅ Port 3001: Aktif" } else { Write-Host "❌ Port 3001: Kapalı" }

Write-Host "`n🎉 FINAL TEST TAMAMLANDI!" -ForegroundColor Green
