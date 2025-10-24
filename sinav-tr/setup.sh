#!/bin/bash
set -e

echo "🚀 Sınav TR Kurulumuna Hoş Geldiniz!"
echo "--------------------------------"

# Check for required tools
echo "🔍 Gerekli araçlar kontrol ediliyor..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js yüklü değil. Lütfen Node.js 18+ yükleyin."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ NPM yüklü değil. Lütfen Node.js ile birlikte gelen NPM'i yükleyin."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "⚠️  Docker yüklü değil. PostgreSQL ve Redis için Docker kullanılacak."; }
command -v psql >/dev/null 2>&1 || { echo "⚠️  PostgreSQL CLI yüklü değil. Veritabanı işlemleri için gerekli olabilir."; }

# Install dependencies
echo "📦 Bağımlılıklar yükleniyor..."
npm install

# Setup environment
if [ ! -f ".env" ]; then
    echo "⚙️  .env dosyası oluşturuluyor..."
    cp .env.example .env
    echo "ℹ️  Lütfen .env dosyasını düzenleyin ve gerekli ayarları yapın."
    read -p "Devam etmek için ENTER'a basın..."
fi

# Setup database
echo "💾 Veritabanı ayarlanıyor..."
cd apps/api

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "⚠️  PostgreSQL çalışmıyor. Docker ile başlatılıyor..."
    docker run --name sinav-tr-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=sinavtr -p 5432:5432 -d postgres:15
    echo "✅ PostgreSQL Docker konteyneri başlatıldı."
fi

# Run migrations
echo "🔄 Veritabanı migration'ları çalıştırılıyor..."
npx prisma migrate dev --name init

# Generate Prisma client
echo "⚡ Prisma client oluşturuluyor..."
npx prisma generate

# Seed the database if needed
if [ -f "prisma/seed.ts" ]; then
    echo "🌱 Örnek veriler yükleniyor..."
    npx ts-node prisma/seed.ts
fi

cd ../..

echo ""
echo "🎉 Kurulum tamamlandı!"
echo "Başlamak için aşağıdaki komutu çalıştırın:"
echo "  npm run dev"
echo ""
echo "🌐 Uygulama http://localhost:3000 adresinde başlatılacak."
