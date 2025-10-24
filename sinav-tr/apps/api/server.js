const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'API is running!' 
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('📧 Login attempt:', email);
  
  // Test kullanıcıları
  const users = [
    { email: 'test@test.com', password: 'test123', name: 'Test User' },
    { email: 'student@test.com', password: 'test123', name: 'Öğrenci User' },
    { email: 'admin@test.com', password: 'test123', name: 'Admin User', role: 'ADMIN' },
  ];
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    console.log('✅ Login successful:', email);
    return res.json({
      success: true,
      user: {
        id: Date.now().toString(),
        email: user.email,
        name: user.name,
        role: user.role || 'STUDENT',
      },
      token: 'jwt-token-' + Date.now(),
    });
  }
  
  console.log('❌ Login failed:', email);
  res.status(401).json({
    success: false,
    message: 'Email veya şifre hatalı',
  });
});

// Register endpoint  
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  console.log('📝 Register attempt:', email);
  
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Tüm alanlar zorunludur',
    });
  }
  
  console.log('✅ Registration successful:', email);
  res.json({
    success: true,
    message: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.',
    user: {
      id: Date.now().toString(),
      email,
      name,
      role: 'STUDENT',
    },
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    message: 'Sunucu hatası: ' + err.message,
  });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 API Server BAŞLATILDI!');
  console.log('='.repeat(50));
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log('\n📝 Test Kullanıcıları:');
  console.log('   1. test@test.com / test123');
  console.log('   2. student@test.com / test123');
  console.log('   3. admin@test.com / test123');
  console.log('='.repeat(50) + '\n');
});
