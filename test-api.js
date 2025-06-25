// Simple Node.js test script for WooCommerce API
const https = require('https');
const http = require('http');

// Configuration
const STORE_URL = 'https://sultanafitness.store';
const CONSUMER_KEY = 'ck_fe2d2056ee594ff1c4693db397426f6a1425d4ec';
const CONSUMER_SECRET = 'cs_f6f4f25a3aa73c7db791cf2816fb5a1bc5bb34a7';

// Test WooCommerce API Connection
async function testWooCommerceAPI() {
  console.log('🚀 Testing WooCommerce API Connection...');
  console.log('=' .repeat(50));
  
  const testEndpoints = [
    {
      name: 'Connection Test',
      url: `${STORE_URL}/wp-json/wc/v3/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=1`
    },
    {
      name: 'Get Products',
      url: `${STORE_URL}/wp-json/wc/v3/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=5`
    },
    {
      name: 'Get Categories',
      url: `${STORE_URL}/wp-json/wc/v3/products/categories?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=10`
    }
  ];

  for (const endpoint of testEndpoints) {
    console.log(`\n🔍 Testing: ${endpoint.name}`);
    console.log(`📡 URL: ${endpoint.url}`);
    
    try {
      const result = await makeRequest(endpoint.url);
      console.log(`✅ ${endpoint.name}: SUCCESS`);
      console.log(`📊 Status: ${result.statusCode}`);
      
      if (result.data) {
        const data = JSON.parse(result.data);
        if (Array.isArray(data)) {
          console.log(`📦 Results: ${data.length} items`);
          if (data.length > 0) {
            if (endpoint.name === 'Get Products') {
              console.log(`🛍️ Sample Product: ${data[0].name} (ID: ${data[0].id})`);
            } else if (endpoint.name === 'Get Categories') {
              console.log(`📂 Sample Category: ${data[0].name} (${data[0].count} products)`);
            }
          }
        }
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: FAILED`);
      console.log(`🚨 Error: ${error.message}`);
    }
  }

  // Test CoCart API
  console.log(`\n🛒 Testing CoCart API...`);
  try {
    const cartResult = await makeRequest(`${STORE_URL}/wp-json/cocart/v2/cart`);
    console.log(`✅ CoCart API: SUCCESS`);
    console.log(`📊 Status: ${cartResult.statusCode}`);
    
    if (cartResult.data) {
      const cartData = JSON.parse(cartResult.data);
      console.log(`🛒 Cart Items: ${cartData.item_count || 0}`);
    }
  } catch (error) {
    console.log(`❌ CoCart API: FAILED`);
    console.log(`🚨 Error: ${error.message}`);
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🏁 API Testing Complete!');
}

// Helper function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const module = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'WooCommerce-API-Test/1.0',
        'Accept': 'application/json'
      },
      timeout: 10000
    };

    const req = module.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.setTimeout(10000);
    req.end();
  });
}

// Run the tests
testWooCommerceAPI().catch(error => {
  console.error('Failed to run tests:', error);
});
