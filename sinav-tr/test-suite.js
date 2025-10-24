const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';
const WEB_BASE = 'http://localhost:3000';

class TestSuite {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  log(message, type = 'info') {
    const colors = {
      success: '\x1b[32m', // Green
      error: '\x1b[31m',   // Red
      warning: '\x1b[33m', // Yellow
      info: '\x1b[34m'     // Blue
    };
    const reset = '\x1b[0m';
    console.log(`${colors[type]}[${type.toUpperCase()}] ${message}${reset}`);
  }

  async test(name, testFn) {
    try {
      this.log(`Testing: ${name}`, 'info');
      await testFn();
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASSED' });
      this.log(`✓ ${name}`, 'success');
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAILED', error: error.message });
      this.log(`✗ ${name}: ${error.message}`, 'error');
    }
  }

  async runAllTests() {
    this.log('🚀 Starting Comprehensive Test Suite', 'info');
    console.log('='.repeat(50));

    // 1. Health Check Tests
    await this.test('API Health Check', async () => {
      const response = await axios.get(`${API_BASE}/health`);
      if (response.data.status !== 'ok') throw new Error('API not healthy');
    });

    await this.test('Database Connection', async () => {
      const response = await axios.get(`${API_BASE}/health/detailed`);
      if (response.data.database.status !== 'connected') throw new Error('Database not connected');
    });

    // 2. Authentication Tests
    await this.test('User Registration', async () => {
      const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'test123',
        name: 'Test User',
        role: 'STUDENT'
      };
      const response = await axios.post(`${API_BASE}/auth/register`, testUser);
      if (!response.data.token) throw new Error('No token returned');
    });

    await this.test('User Login', async () => {
      const credentials = {
        email: 'student@test.com',
        password: 'test123'
      };
      const response = await axios.post(`${API_BASE}/auth/login`, credentials);
      if (!response.data.token) throw new Error('Login failed');
      this.authToken = response.data.token;
    });

    await this.test('Protected Route Access', async () => {
      if (!this.authToken) throw new Error('No auth token available');
      const response = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });
      if (!response.data.id) throw new Error('Protected route failed');
    });

    // 3. Questions API Tests
    await this.test('Get Questions', async () => {
      const response = await axios.get(`${API_BASE}/questions`);
      if (!Array.isArray(response.data.questions)) throw new Error('Questions not returned as array');
    });

    await this.test('Get Subjects', async () => {
      const response = await axios.get(`${API_BASE}/questions/subjects/list`);
      if (!Array.isArray(response.data.subjects)) throw new Error('Subjects not returned');
    });

    // 4. Exams API Tests
    await this.test('Get Exams', async () => {
      const response = await axios.get(`${API_BASE}/exams`);
      if (!Array.isArray(response.data.exams)) throw new Error('Exams not returned');
    });

    // 5. Payments API Tests
    await this.test('Get Payment Plans', async () => {
      const response = await axios.get(`${API_BASE}/payments/plans`);
      if (!Array.isArray(response.data.plans)) throw new Error('Plans not returned');
    });

    // 6. Frontend Page Tests
    await this.test('Homepage Load', async () => {
      const response = await axios.get(WEB_BASE);
      if (response.status !== 200) throw new Error('Homepage not loading');
    });

    await this.test('Login Page Load', async () => {
      const response = await axios.get(`${WEB_BASE}/login`);
      if (response.status !== 200) throw new Error('Login page not loading');
    });

    await this.test('Register Page Load', async () => {
      const response = await axios.get(`${WEB_BASE}/register`);
      if (response.status !== 200) throw new Error('Register page not loading');
    });

    await this.test('Dersler Page Load', async () => {
      const response = await axios.get(`${WEB_BASE}/dersler`);
      if (response.status !== 200) throw new Error('Dersler page not loading');
    });

    await this.test('Denemeler Page Load', async () => {
      const response = await axios.get(`${WEB_BASE}/denemeler`);
      if (response.status !== 200) throw new Error('Denemeler page not loading');
    });

    await this.test('Topluluk Page Load', async () => {
      const response = await axios.get(`${WEB_BASE}/topluluk`);
      if (response.status !== 200) throw new Error('Topluluk page not loading');
    });

    await this.test('Dashboard Page Load', async () => {
      const response = await axios.get(`${WEB_BASE}/dashboard`);
      if (response.status !== 200) throw new Error('Dashboard page not loading');
    });

    // Test Results
    this.printResults();
  }

  printResults() {
    console.log('\n' + '='.repeat(50));
    this.log('📊 TEST RESULTS', 'info');
    console.log('='.repeat(50));
    
    this.log(`Total Tests: ${this.results.passed + this.results.failed}`, 'info');
    this.log(`Passed: ${this.results.passed}`, 'success');
    this.log(`Failed: ${this.results.failed}`, 'error');
    
    const successRate = ((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1);
    this.log(`Success Rate: ${successRate}%`, successRate > 90 ? 'success' : successRate > 70 ? 'warning' : 'error');

    if (this.results.failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.tests
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          this.log(`  • ${test.name}: ${test.error}`, 'error');
        });
    }

    console.log('\n✅ PASSED TESTS:');
    this.results.tests
      .filter(test => test.status === 'PASSED')
      .forEach(test => {
        this.log(`  • ${test.name}`, 'success');
      });
  }
}

// Ana test fonksiyonu
async function runTests() {
  const testSuite = new TestSuite();
  
  try {
    await testSuite.runAllTests();
  } catch (error) {
    console.error('Test suite failed:', error);
    process.exit(1);
  }
}

// Eğer doğrudan çalıştırılıyorsa testleri başlat
if (require.main === module) {
  runTests();
}

module.exports = { TestSuite, runTests };
