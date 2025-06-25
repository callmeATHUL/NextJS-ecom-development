/**
 * Domain Testing Script
 * Test both domains to find the correct one
 */

const axios = require('axios');

const CONSUMER_KEY = 'ck_fe2d2056ee594ff1c4693db397426f6a1425d4ec';
const CONSUMER_SECRET = 'cs_f6f4f25a3aa73c7db791cf2816fb5a1bc5bb34a7';

// Test both domains
const domains = [
  'https://sultanafitness.store',
  'https://sulthanafitness.shop'
];

async function testDomain(domain) {
  console.log(`\n🔍 Testing domain: ${domain}`);
  console.log('─'.repeat(50));
  
  try {
    // Test WooCommerce REST API
    const wooResponse = await axios.get(`${domain}/wp-json/wc/v3/products`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        per_page: 1
      },
      timeout: 10000
    });
    
    console.log(`✅ WooCommerce API: Working (${wooResponse.status})`);
    console.log(`📦 Products found: ${wooResponse.data.length}`);
    
  } catch (error) {
    console.log(`❌ WooCommerce API: Failed (${error.response?.status || 'Network Error'})`);
  }
  
  try {
    // Test Store API
    const storeResponse = await axios.get(`${domain}/wp-json/wc/store/v1/cart`, {
      timeout: 10000
    });
    
    console.log(`✅ Store API: Working (${storeResponse.status})`);
    
  } catch (error) {
    console.log(`❌ Store API: Failed (${error.response?.status || 'Network Error'})`);
  }
  
  try {
    // Test WordPress REST API
    const wpResponse = await axios.get(`${domain}/wp-json/wp/v2/posts`, {
      params: { per_page: 1 },
      timeout: 10000
    });
    
    console.log(`✅ WordPress API: Working (${wpResponse.status})`);
    
  } catch (error) {
    console.log(`❌ WordPress API: Failed (${error.response?.status || 'Network Error'})`);
  }
  
  try {
    // Test if it's the main site
    const homeResponse = await axios.get(domain, {
      timeout: 10000
    });
    
    console.log(`✅ Website: Accessible (${homeResponse.status})`);
    
  } catch (error) {
    console.log(`❌ Website: Not accessible (${error.response?.status || 'Network Error'})`);
  }
}

async function findCorrectDomain() {
  console.log('🚀 Domain Testing - Finding the Correct API Domain');
  console.log('═'.repeat(60));
  
  for (const domain of domains) {
    await testDomain(domain);
  }
  
  console.log('\n📋 RECOMMENDATION:');
  console.log('─'.repeat(30));
  console.log('Based on the test results above:');
  console.log('• Use the domain where both WooCommerce API and Store API work');
  console.log('• Update .env.local with the correct domain');
  console.log('• Redeploy the application');
}

findCorrectDomain().catch(error => {
  console.error('❌ Domain testing failed:', error.message);
});
