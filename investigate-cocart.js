/**
 * CoCart API Investigation Script
 * This script will discover available CoCart endpoints
 */

const axios = require('axios');

const STORE_URL = 'https://sultanafitness.store';
const COCART_API_BASE = `${STORE_URL}/wp-json/cocart/v2`;

async function investigateCoCartEndpoints() {
  console.log('🔍 Investigating CoCart API Endpoints...');
  console.log('═'.repeat(50));
  
  // Test different versions and endpoints
  const endpointsToTest = [
    // v2 endpoints
    '/cart',
    '/cart/add-item',
    '/cart/item',
    '/cart/items',
    '/cart/remove-item',
    '/cart/clear',
    '/cart/count',
    '/cart/totals',
    
    // Alternative v1 endpoints
    '/add-item',
    '/item',
    '/items',
    '/remove-item',
    '/clear',
    '/count',
    '/totals'
  ];
  
  for (const endpoint of endpointsToTest) {
    try {
      const response = await axios.get(`${COCART_API_BASE}${endpoint}`, {
        timeout: 5000
      });
      console.log(`✅ ${endpoint} - Status: ${response.status}`);
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${endpoint} - Status: ${error.response.status} (${error.response.statusText})`);
      } else {
        console.log(`❌ ${endpoint} - Network Error`);
      }
    }
  }
  
  console.log('\n🔍 Testing CoCart v1 API...');
  console.log('─'.repeat(30));
  
  // Test v1 API as fallback
  const v1Base = `${STORE_URL}/wp-json/cocart/v1`;
  const v1Endpoints = [
    '/add-item',
    '/cart',
    '/clear',
    '/count',
    '/item',
    '/totals'
  ];
  
  for (const endpoint of v1Endpoints) {
    try {
      const response = await axios.get(`${v1Base}${endpoint}`, {
        timeout: 5000
      });
      console.log(`✅ v1${endpoint} - Status: ${response.status}`);
    } catch (error) {
      if (error.response) {
        console.log(`❌ v1${endpoint} - Status: ${error.response.status}`);
      } else {
        console.log(`❌ v1${endpoint} - Network Error`);
      }
    }
  }
  
  console.log('\n🔍 Testing WP REST API Index...');
  console.log('─'.repeat(30));
  
  // Check WordPress REST API index to see available routes
  try {
    const response = await axios.get(`${STORE_URL}/wp-json/`, {
      timeout: 10000
    });
    
    const routes = response.data.routes || {};
    const coCartRoutes = Object.keys(routes).filter(route => route.includes('cocart'));
    
    if (coCartRoutes.length > 0) {
      console.log('📋 Available CoCart Routes:');
      coCartRoutes.forEach(route => {
        console.log(`   - ${route}`);
      });
    } else {
      console.log('❌ No CoCart routes found in WordPress REST API');
    }
  } catch (error) {
    console.log('❌ Could not fetch WordPress REST API index');
  }
}

investigateCoCartEndpoints().catch(error => {
  console.error('❌ Investigation failed:', error.message);
});
