// Test file to verify build process
console.log('Build test starting...');

// Test basic imports
try {
  console.log('Testing React import...');
  const React = require('react');
  console.log('✅ React import successful');
} catch (error) {
  console.error('❌ React import failed:', error.message);
}

try {
  console.log('Testing Vite import...');
  const vite = require('vite');
  console.log('✅ Vite import successful');
} catch (error) {
  console.error('❌ Vite import failed:', error.message);
}

console.log('Build test completed.');
