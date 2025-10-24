# 🚀 Sınav TR - Çalıştırma Rehberi

Bu rehber, Sınav TR projesini sıfırdan çalıştırmak için gereken tüm adımları içerir.

---

## 📋 Gereksinimler

### Zorunlu
- ✅ **Node.js**: v18 veya üzeri (Sizde v24.6.0 var ✅)
- ✅ **npm**: v9 veya üzeri (Sizde v11.5.1 var ✅)
- ⚠️ **PostgreSQL**: v14 veya üzeri (Kurulması gerekiyor)
- ⚠️ **Redis**: v7 veya üzeri (İsteğe bağlı, cache için)

### İsteğe Bağlı
- Git (versiyon kontrolü için)
- Docker (containerize deployment için)

---

## 🎯 Hızlı Başlangıç (Şu Anda Çalışıyor!)

Projeniz zaten çalışıyor durumda! 🎉

### Çalışan Sunucular

**Frontend (Web):**
- URL: http://localhost:3000
- Durum: ✅ Çalışıyor
- Process: Background'da aktif

**Kontrol:**
```powershell
# Tarayıcınızda açın
start http://localhost:3000
```

---

## 📝 Adım Adım Kurulum (Yeniden Başlatmak İçin)

### 1. Projeyi Hazırlayın

```powershell
# Proje dizinine gidin
cd "C:\Users\samet\KPSS PROJE\sinav-tr"

# Bağımlılıkları yükleyin (zaten yüklü, tekrar gerekirse)
npm install
```

### 2. Environment Değişkenlerini Ayarlayın

#### Web için (.env.local)
```powershell
cd apps/web

# .env.local dosyası zaten var, düzenleyin
notepad .env.local
```

**apps/web/.env.local içeriği:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

#### API için (.env)
```powershell
cd ../api

# .env dosyası zaten var, düzenleyin
notepad .env
```

**apps/api/.env içeriği (ŞU AN İÇİN - Database olmadan):**
```env
# Port
PORT=3001

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Database (Geçici - SQLite veya mock kullanabilirsiniz)
DATABASE_URL="file:./dev.db"

# Redis (İsteğe bağlı - yoksa yorum satırı yapın)
# REDIS_URL=redis://localhost:6379

# Iyzico (Test modunda geçici)
IYZICO_API_KEY=sandbox-test-key
IYZICO_SECRET_KEY=sandbox-test-secret
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
```

### 3. Development Modunda Çalıştırın

#### Seçenek A: Her İki Sunucuyu Birlikte
```powershell
cd "C:\Users\samet\KPSS PROJE\sinav-tr"
npm run dev
```

#### Seçenek B: Ayrı Ayrı (Önerilen - Debug için)

**Terminal 1 - Frontend:**
```powershell
cd "C:\Users\samet\KPSS PROJE\sinav-tr\apps\web"
npm run dev
```

**Terminal 2 - Backend (Database kurulunca):**
```powershell
cd "C:\Users\samet\KPSS PROJE\sinav-tr\apps\api"
npx prisma generate
npx nest start --watch
```

---

## 🗄️ Database Kurulumu (Gelişmiş)

### PostgreSQL Kurulumu

#### Windows için:

**1. PostgreSQL İndirin:**
```powershell
# Tarayıcıda açın
start https://www.postgresql.org/download/windows/
```
veya
```powershell
# Chocolatey ile (eğer yüklüyse)
choco install postgresql
```

**2. PostgreSQL Başlatın:**
```powershell
# Servis kontrolü
Get-Service postgresql*

# Manuel başlat
Start-Service postgresql-x64-14
```

**3. Database Oluşturun:**
```powershell
# psql'e bağlanın
psql -U postgres

# Database oluştur
CREATE DATABASE sinavtr;

# Kullanıcı oluştur (isteğe bağlı)
CREATE USER sinavtr_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sinavtr TO sinavtr_user;

# Çıkış
\q
```

**4. .env Güncelleyin:**
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sinavtr"
```

### Prisma Migration

```powershell
cd "C:\Users\samet\KPSS PROJE\sinav-tr\apps\api"

# Prisma client oluştur (✅ zaten yapıldı)
npx prisma generate

# Migration çalıştır
npx prisma migrate dev --name init

# Seed data ekle (test verileri)
npx prisma db seed
```

---

## 🔄 Durdurma ve Yeniden Başlatma

### Çalışan Sunucuları Durdurma

**PowerShell ile:**
```powershell
# Port 3000'i kullanan process'i bul ve durdur
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | 
  Select-Object -ExpandProperty OwningProcess | 
  ForEach-Object { Stop-Process -Id $_ -Force }

# Port 3001'i kullanan process'i bul ve durdur (API için)
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | 
  Select-Object -ExpandProperty OwningProcess | 
  ForEach-Object { Stop-Process -Id $_ -Force }
```

veya **Ctrl+C** ile terminal'de durdurabilirsiniz.

### Temiz Başlangıç

```powershell
cd "C:\Users\samet\KPSS PROJE\sinav-tr"

# Cache'leri temizle
npm run clean

# Yeniden build
npm run build

# Çalıştır
npm run dev
```

---

## 🧪 Test ve Kontrol

### Frontend Kontrolü
```powershell
# Tarayıcıda açın
start http://localhost:3000

# veya curl ile test
curl http://localhost:3000
```

### API Kontrolü (Database kurulunca)
```powershell
# Health check
curl http://localhost:3001/api/health

# Swagger docs
start http://localhost:3001/api/docs
```

---

## 📁 Proje Yapısı

```
C:\Users\samet\KPSS PROJE\sinav-tr\
│
├── apps/
│   ├── web/                    # Frontend (Port: 3000)
│   │   ├── .env.local         # ✅ Environment vars
│   │   └── npm run dev        # Çalıştır
│   │
│   └── api/                    # Backend (Port: 3001)
│       ├── .env               # ✅ Environment vars
│       ├── prisma/            # Database schema
│       └── npm run dev        # Çalıştır
│
├── package.json               # Root config
└── turbo.json                 # Monorepo config
```

---

## 🐛 Sorun Giderme

### Port Zaten Kullanımda

**Hata:**
```
Port 3000 is in use, trying 3001 instead
```

**Çözüm:**
```powershell
# Kullanılan portu kontrol et
Get-NetTCPConnection -LocalPort 3000

# Process'i durdur
Stop-Process -Id <PID> -Force
```

### Module Not Found

**Hata:**
```
Cannot find module 'react'
```

**Çözüm:**
```powershell
# node_modules'ı sil ve tekrar yükle
cd "C:\Users\samet\KPSS PROJE\sinav-tr"
Remove-Item -Recurse -Force node_modules, apps/*/node_modules
npm install
```

### TypeScript Hataları

**Çözüm:**
```powershell
# TypeScript cache'i temizle
cd apps/web
Remove-Item -Recurse -Force .next

cd ../api
Remove-Item -Recurse -Force dist
```

### Prisma Client Hatası

**Hata:**
```
@prisma/client did not initialize yet
```

**Çözüm:**
```powershell
cd apps/api
npx prisma generate
```

---

## 🎨 Geliştirme İpuçları

### Hot Reload
- Kod değişiklikleriniz otomatik olarak sayfayı yeniler
- API değişiklikleri için sunucu otomatik yeniden başlar

### Debug Modu

**Frontend:**
```powershell
# Chrome DevTools otomatik açılır
npm run dev
```

**Backend:**
```powershell
cd apps/api
npm run start:debug
# Ardından Chrome'da chrome://inspect açın
```

### Linting ve Formatting

```powershell
# Tüm projeyi lint et
npm run lint

# Formatla
npm run format
```

---

## 📊 Mevcut Durum

### ✅ Hazır Olanlar
- Frontend sunucusu çalışıyor (http://localhost:3000)
- Tüm bağımlılıklar yüklü
- TypeScript hataları düzeltildi
- Prisma client oluşturuldu

### ⚠️ Kurulması Gerekenler
- PostgreSQL database
- Redis (isteğe bağlı)
- Environment değişkenleri (üretim için)

---

## 🚀 Production Build

### Build Oluşturma

```powershell
cd "C:\Users\samet\KPSS PROJE\sinav-tr"

# Tüm projeyi build et
npm run build
```

### Production Modunda Çalıştırma

```powershell
# Frontend
cd apps/web
npm run start

# Backend
cd apps/api
npm run start:prod
```

---

## 📞 Yardım

### Logları Kontrol Etme

**Frontend logs:**
```powershell
# Terminal'de görünür, ayrıca:
start http://localhost:3000
# Tarayıcı console'unda F12
```

**Backend logs:**
```powershell
cd apps/api
# Logs konsolda görünür
```

### Hata Raporlama

1. Terminal çıktısını kopyalayın
2. Hata mesajını not edin
3. `package.json` ve `.env` dosyalarını kontrol edin

---

## ⚡ Hızlı Komutlar

```powershell
# Proje dizinine git
cd "C:\Users\samet\KPSS PROJE\sinav-tr"

# Frontend başlat (şu an çalışıyor)
cd apps/web && npm run dev

# Backend başlat (database gerekli)
cd apps/api && npm run dev

# Tümünü birlikte başlat
npm run dev

# Build
npm run build

# Test
npm run test

# Temizle
npm run clean
```

---

## 🎉 Sonuç

Projeniz **şu anda çalışıyor**! 

**Frontend:** http://localhost:3000 ✅

Yeni bir terminal açıp backend'i de başlatmak isterseniz yukarıdaki adımları takip edin.

**İyi çalışmalar!** 🚀
