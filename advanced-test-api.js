// Advanced WooCommerce API test with URL variations
const https = require('https');
const http = require('http');

// Configuration variants to test
const CONSUMER_KEY = 'ck_fe2d2056ee594ff1c4693db397426f6a1425d4ec';
const CONSUMER_SECRET = 'cs_f6f4f25a3aa73c7db791cf2816fb5a1bc5bb34a7';

const URL_VARIANTS = [
  'https://sultanafitness.store',
  'https://www.sultanafitness.store',
  'http://sultanafitness.store',
  'http://www.sultanafitness.store'
];

// Test different URL variations
async function testURLVariants() {
  console.log('🚀 Testing WooCommerce API with different URL variants...');
  console.log('=' .repeat(60));
  
  for (const baseUrl of URL_VARIANTS) {
    console.log(`\n🔍 Testing Base URL: ${baseUrl}`);
    console.log('-' .repeat(40));
    
    // Test basic connectivity first
    try {
      const connectResult = await makeRequest(baseUrl, true);
      console.log(`✅ Basic connectivity: SUCCESS (${connectResult.statusCode})`);
      
      if (connectResult.statusCode === 301 || connectResult.statusCode === 302) {
        console.log(`🔄 Redirect detected to: ${connectResult.headers.location}`);
        if (connectResult.headers.location) {
          // Test the redirected URL
          const redirectedUrl = connectResult.headers.location;
          console.log(`🔄 Testing redirected URL: ${redirectedUrl}`);
          
          try {
            const redirectResult = await makeRequest(redirectedUrl, true);
            console.log(`✅ Redirected URL works: SUCCESS (${redirectResult.statusCode})`);
            
            if (redirectResult.statusCode === 200) {
              // Test WooCommerce API on the working URL
              await testWooCommerceEndpoints(redirectedUrl);
              break; // Exit loop if we found a working URL
            }
          } catch (redirectError) {
            console.log(`❌ Redirected URL failed: ${redirectError.message}`);
          }
        }
      } else if (connectResult.statusCode === 200) {
        // Test WooCommerce API on this URL
        await testWooCommerceEndpoints(baseUrl);
        break; // Exit loop if we found a working URL
      }
    } catch (error) {
      console.log(`❌ Basic connectivity failed: ${error.message}`);
    }
  }
}

async function testWooCommerceEndpoints(baseUrl) {
  console.log(`\n🛍️ Testing WooCommerce endpoints on: ${baseUrl}`);
  console.log('-' .repeat(40));
  
  const endpoints = [
    {
      name: 'WooCommerce System Status',
      path: '/wp-json/wc/v3/system_status'
    },
    {
      name: 'WooCommerce Products',
      path: '/wp-json/wc/v3/products'
    },
    {
      name: 'WooCommerce Categories',
      path: '/wp-json/wc/v3/products/categories'
    },
    {
      name: 'CoCart Status',
      path: '/wp-json/cocart/v2/cart'
    }
  ];

  for (const endpoint of endpoints) {
    const fullUrl = `${baseUrl}${endpoint.path}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=1`;
    
    console.log(`\n🔍 Testing: ${endpoint.name}`);
    
    try {
      const result = await makeRequest(fullUrl);
      console.log(`✅ ${endpoint.name}: SUCCESS (${result.statusCode})`);
      
      if (result.data) {
        try {
          const data = JSON.parse(result.data);
          
          if (endpoint.name === 'WooCommerce Products' && Array.isArray(data)) {
            console.log(`📦 Found ${data.length} products`);
            if (data.length > 0) {
              console.log(`🛍️ Sample: ${data[0].name} - SAR ${data[0].price}`);
            }
          } else if (endpoint.name === 'WooCommerce Categories' && Array.isArray(data)) {
            console.log(`📂 Found ${data.length} categories`);
            if (data.length > 0) {
              console.log(`📋 Sample: ${data[0].name} (${data[0].count} products)`);
            }
          } else if (endpoint.name === 'CoCart Status') {
            console.log(`🛒 Cart status: ${data.item_count || 0} items`);
          } else if (endpoint.name === 'WooCommerce System Status') {
            console.log(`⚙️ System info: ${data.environment?.home_url || 'Available'}`);
          }
        } catch (parseError) {
          console.log(`⚠️ Response received but couldn't parse JSON`);
          console.log(`📄 Response preview: ${result.data.substring(0, 100)}...`);
        }
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint.name}: FAILED`);
      console.log(`🚨 Error: ${error.message}`);
      
      if (error.message.includes('401')) {
        console.log('🔐 Authentication failed - check consumer key/secret');
      } else if (error.message.includes('404')) {
        console.log('🔍 Endpoint not found - WooCommerce API may not be enabled');
      }
    }
  }
}

// Enhanced request function with redirect handling
function makeRequest(url, followRedirects = false) {
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
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 15000
    };

    const req = module.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (followRedirects && (res.statusCode === 301 || res.statusCode === 302)) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        } else {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout after 15 seconds'));
    });

    req.setTimeout(15000);
    req.end();
  });
}

// Run the comprehensive tests
testURLVariants().catch(error => {
  console.error('\n❌ Failed to run tests:', error);
  console.log('\n💡 Troubleshooting suggestions:');
  console.log('1. Check if sultanafitness.store is online');
  console.log('2. Verify WooCommerce REST API is enabled');
  console.log('3. Check consumer key and secret are correct');
  console.log('4. Ensure SSL certificate is valid');
});
