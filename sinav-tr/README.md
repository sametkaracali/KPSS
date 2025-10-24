# 🎓 Sınav TR - Kapsamlı Sınav Hazırlık Platformu

> Türkiye'nin en kapsamlı online sınav hazırlık platformu

## 🚀 Hızlı Başlangıç

### Ön Gereksinimler
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Git

### Tek Komutla Kurulum

```bash
# Projeyi klonla
gh repo clone kullanici/sinav-tr
cd sinav-tr

# Kurulumu başlat (Tüm bağımlılıklar kurulacak ve veritabanı ayarlanacak)
npm run setup

# Geliştirme sunucularını başlat
npm run dev
```

## 📋 Özellikler

### Öğrenciler İçin
- 📚 Konu anlatımları ve ders notları
- 📝 Deneme sınavları
- 📊 Performans analizi
- 🎥 Video dersler
- 📱 Mobil uyumlu arayüz

### Öğretmenler İçin
- ✏️ Soru ve sınav oluşturma
- 📊 Öğrenci takip paneli
- 📝 Ödev yönetimi
- 💬 Öğrenci geri bildirimleri

### Yöneticiler İçin
- 👥 Kullanıcı yönetimi
- 📈 İstatistik ve raporlar
- 💰 Ödeme yönetimi
- ⚙️ Sistem ayarları

## 🛠 Teknoloji Yığını

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Query
- Zustand

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- Redis
- JWT + 2FA
- WebSocket
- Iyzico Entegrasyonu

## 📂 Proje Yapısı

```
sinav-tr/
├── apps/
│   ├── web/           # Next.js frontend uygulaması
│   └── api/           # NestJS backend API
├── prisma/           # Veritabanı şemaları ve migration'lar
├── public/           # Statik dosyalar
└── README.md         # Bu dosya
```

## 🔧 Geliştirme

### Ortam Değişkenleri
`.env` dosyasını `.env.example` şablonundan oluşturun ve gerekli ayarları yapın.

```bash
cp .env.example .env
```

### Komutlar

```bash
# Bağımlılıkları yükle
npm install

# Veritabanı migration'larını çalıştır
npm run db:migrate

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Testleri çalıştır
npm test
```

## 📄 Lisans

Bu proje [MIT lisansı](LICENSE) altında lisanslanmıştır.

---

**Sınav TR** - Başarınız için modern çözümler! 🚀
