#!/usr/bin/env node

import http from 'http';

const BASE_URL = 'http://148.113.136.150:3001';

// Test functions
async function testHealth() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}/api/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ Health Check:', result);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Timeout')));
  });
}

async function testProducts() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}/api/products`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ Products API:', {
            success: result.success,
            totalProducts: result.data?.products?.length || 0,
            pagination: result.data?.pagination
          });
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Timeout')));
  });
}

async function testCategories() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}/api/categories`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ Categories API:', {
            success: result.success,
            totalCategories: result.data?.length || 0
          });
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Timeout')));
  });
}

async function testTestimonials() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}/api/testimonials`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ Testimonials API:', {
            success: result.success,
            totalTestimonials: result.data?.testimonials?.length || 0
          });
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Timeout')));
  });
}

// Main test runner
async function runTests() {
  console.log('🚀 Testing Pets Yu Backend API...\n');
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  const tests = [
    { name: 'Health Check', fn: testHealth },
    { name: 'Products API', fn: testProducts },
    { name: 'Categories API', fn: testCategories },
    { name: 'Testimonials API', fn: testTestimonials }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`🧪 Testing ${test.name}...`);
      await test.fn();
      passed++;
    } catch (error) {
      console.log(`❌ ${test.name} failed:`, error.message);
      failed++;
    }
    console.log('');
  }

  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the backend logs in Portainer.');
  }
}

// Run tests
runTests().catch(console.error);
