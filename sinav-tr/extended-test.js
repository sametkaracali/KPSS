const axios = require('axios');

class ExtendedTestSuite {
  constructor() {
    this.baseURL = 'http://localhost:3000';
    this.apiURL = 'http://localhost:3001/api';
    this.results = {
      passed: 0,
      failed: 0,
      total: 0
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

  async testPageLoad(pageName, path) {
    try {
      this.log(`Testing: ${pageName} Page Load`);
      const response = await axios.get(`${this.baseURL}${path}`, {
        timeout: 10000,
        validateStatus: (status) => status < 500
      });
      
      if (response.status === 200) {
        this.results.passed++;
        this.log(`✓ ${pageName} Page Load`, 'success');
        return true;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      this.results.failed++;
      this.log(`✗ ${pageName} Page Load - ${error.message}`, 'error');
      return false;
    } finally {
      this.results.total++;
    }
  }

  async runExtendedTests() {
    this.log('🚀 Starting Extended Test Suite for New Pages');
    console.log('==================================================');

    // Test all new pages
    const pages = [
      { name: 'YKS', path: '/yks' },
      { name: 'KPSS', path: '/kpss' },
      { name: 'Sorular', path: '/sorular' },
      { name: 'Videolar', path: '/videolar' },
      { name: 'Performans', path: '/performans' },
      { name: 'Rozetler', path: '/rozetler' },
      { name: 'Liderlik', path: '/liderlik' }
    ];

    for (const page of pages) {
      await this.testPageLoad(page.name, page.path);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Test API endpoints
    await this.testAPIEndpoints();

    this.printResults();
  }

  async testAPIEndpoints() {
    const endpoints = [
      { name: 'Health Check', path: '/health' },
      { name: 'Questions API', path: '/questions' },
      { name: 'Subjects API', path: '/subjects' },
      { name: 'Exams API', path: '/exams' }
    ];

    for (const endpoint of endpoints) {
      try {
        this.log(`Testing: ${endpoint.name}`);
        const response = await axios.get(`${this.apiURL}${endpoint.path}`, {
          timeout: 5000,
          validateStatus: (status) => status < 500
        });
        
        if (response.status === 200) {
          this.results.passed++;
          this.log(`✓ ${endpoint.name}`, 'success');
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        this.results.failed++;
        this.log(`✗ ${endpoint.name} - ${error.message}`, 'error');
      } finally {
        this.results.total++;
      }
    }
  }

  printResults() {
    console.log('\n==================================================');
    this.log('📊 EXTENDED TEST RESULTS');
    console.log('==================================================');
    this.log(`Total Tests: ${this.results.total}`);
    this.log(`Passed: ${this.results.passed}`, 'success');
    this.log(`Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'success');
    
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    this.log(`Success Rate: ${successRate}%`, successRate >= 90 ? 'success' : 'warning');

    if (this.results.passed === this.results.total) {
      console.log('\n🎉 ALL TESTS PASSED! PROJECT IS 100% FUNCTIONAL! 🚀');
    } else {
      console.log('\n⚠️ Some tests failed. Check the logs above for details.');
    }
  }
}

// Run the extended test suite
const testSuite = new ExtendedTestSuite();
testSuite.runExtendedTests().catch(console.error);
