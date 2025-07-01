

const axios = require('axios');

const STORE_URL = 'https://sultanafitness.store';
const CONSUMER_KEY = 'ck_fe2d2056ee594ff1c4693db397426f6a1425d4ec';
const CONSUMER_SECRET = 'cs_f6f4f25a3aa73c7db791cf2816fb5a1bc5bb34a7';

const WOOCOMMERCE_API_BASE = `${STORE_URL}/wp-json/wc/v3`;
const STORE_API_BASE = `${STORE_URL}/wp-json/wc/store/v1`;

async function runTroubleshooting() {
  console.log('🚀 Starting API Troubleshooting Script...');
  console.log('========================================');

  // Test 1: WooCommerce REST API - Products
  try {
    console.log('\n[1] Testing WooCommerce REST API - Products...');
    const response = await axios.get(`${WOOCOMMERCE_API_BASE}/products`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        per_page: 1
      }
    });
    console.log('✅ SUCCESS: Products endpoint is responding.');
    console.log(`   - Status: ${response.status}`);
    console.log(`   - Products Found: ${response.data.length}`);
  } catch (error) {
    console.error('❌ FAILED: Could not connect to Products endpoint.');
    if (error.response) {
      console.error(`   - Status: ${error.response.status}`);
      console.error(`   - Data: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`   - Error: ${error.message}`);
    }
  }

  // Test 2: WooCommerce REST API - Categories
  try {
    console.log('\n[2] Testing WooCommerce REST API - Categories...');
    const response = await axios.get(`${WOOCOMMERCE_API_BASE}/products/categories`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        per_page: 1
      }
    });
    console.log('✅ SUCCESS: Categories endpoint is responding.');
    console.log(`   - Status: ${response.status}`);
    console.log(`   - Categories Found: ${response.data.length}`);
  } catch (error) {
    console.error('❌ FAILED: Could not connect to Categories endpoint.');
    if (error.response) {
      console.error(`   - Status: ${error.response.status}`);
      console.error(`   - Data: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`   - Error: ${error.message}`);
    }
  }

  // Test 3: WooCommerce Store API - Cart
  try {
    console.log('\n[3] Testing WooCommerce Store API - Cart...');
    const response = await axios.get(`${STORE_API_BASE}/cart`);
    console.log('✅ SUCCESS: Store API (Cart) is responding.');
    console.log(`   - Status: ${response.status}`);
  } catch (error) {
    console.error('❌ FAILED: Could not connect to Store API (Cart).');
    if (error.response) {
      console.error(`   - Status: ${error.response.status}`);
      console.error(`   - Data: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`   - Error: ${error.message}`);
    }
  }

  console.log('\n========================================');
  console.log('🏁 Troubleshooting Script Finished.');
}

runTroubleshooting();
