const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Veritabanı bağlantısı test ediliyor...');
    
    // Try to connect to the database
    await prisma.$connect();
    console.log('✅ Veritabanına başarıyla bağlanıldı');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`👥 Toplam kullanıcı sayısı: ${userCount}`);
    
  } catch (error) {
    console.error('❌ Veritabanı bağlantı hatası:', error.message);
    if (error.code === 'P1001') {
      console.log('\n🔧 Olası Çözümler:');
      console.log('1. PostgreSQL sunucusunun çalıştığından emin olun');
      console.log('2. .env dosyasındaki DATABASE_URL\'i kontrol edin');
      console.log('3. Veritabanı kullanıcı adı ve şifresinin doğru olduğundan emin olun');
      console.log('4. PostgreSQL\'in 5432 portunda çalıştığından emin olun');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
