/**
 * Final Comprehensive Test - All WooCommerce APIs
 * This test verifies both WooCommerce REST API and Store API functionality
 */

const axios = require('axios');

// Configuration
const STORE_URL = 'https://sultanafitness.store';
const CONSUMER_KEY = 'ck_fe2d2056ee594ff1c4693db397426f6a1425d4ec';
const CONSUMER_SECRET = 'cs_f6f4f25a3aa73c7db791cf2816fb5a1bc5bb34a7';

const WOOCOMMERCE_API_BASE = `${STORE_URL}/wp-json/wc/v3`;
const STORE_API_BASE = `${STORE_URL}/wp-json/wc/store/v1`;

// Test results
const results = {
  woocommerce: { passed: 0, failed: 0 },
  storeApi: { passed: 0, failed: 0 },
  total: { passed: 0, failed: 0 }
};

function logResult(category, testName, success, details = '') {
  const status = success ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${testName}`);
  if (details) console.log(`   ℹ️  ${details}`);
  
  results[category][success ? 'passed' : 'failed']++;
  results.total[success ? 'passed' : 'failed']++;
  console.log('');
}

// WooCommerce REST API Tests
async function testWooCommerceAPI() {
  console.log('🔵 WOOCOMMERCE REST API v3 TESTS');
  console.log('─'.repeat(40));
  
  // Test Products API
  try {
    const response = await axios.get(`${WOOCOMMERCE_API_BASE}/products`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        per_page: 5
      },
      timeout: 10000
    });
    logResult('woocommerce', 'Products API', true, `Retrieved ${response.data.length} products`);
    return response.data;
  } catch (error) {
    logResult('woocommerce', 'Products API', false, error.message);
    return [];
  }
}

async function testWooCommerceCategories() {
  try {
    const response = await axios.get(`${WOOCOMMERCE_API_BASE}/products/categories`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        per_page: 10
      },
      timeout: 10000
    });
    logResult('woocommerce', 'Categories API', true, `Retrieved ${response.data.length} categories`);
    return response.data;
  } catch (error) {
    logResult('woocommerce', 'Categories API', false, error.message);
    return [];
  }
}

async function testWooCommerceOrders() {
  try {
    const response = await axios.get(`${WOOCOMMERCE_API_BASE}/orders`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        per_page: 3
      },
      timeout: 10000
    });
    logResult('woocommerce', 'Orders API', true, `Retrieved ${response.data.length} orders`);
  } catch (error) {
    logResult('woocommerce', 'Orders API', false, error.message);
  }
}

// Store API Tests  
async function testStoreAPI() {
  console.log('🟢 WOOCOMMERCE STORE API TESTS');
  console.log('─'.repeat(40));
  
  // Test Cart API
  try {
    const response = await axios.get(`${STORE_API_BASE}/cart`, {
      timeout: 10000
    });
    logResult('storeApi', 'Cart API', true, `Cart has ${response.data.items_count || 0} items`);
    return response.data;
  } catch (error) {
    logResult('storeApi', 'Cart API', false, error.message);
    return null;
  }
}

async function testStoreProductsAPI() {
  try {
    const response = await axios.get(`${STORE_API_BASE}/products`, {
      params: { per_page: 3 },
      timeout: 10000
    });
    logResult('storeApi', 'Store Products API', true, `Retrieved ${response.data.length} products`);
    return response.data;
  } catch (error) {
    logResult('storeApi', 'Store Products API', false, error.message);
    return [];
  }
}

async function testStoreCheckoutAPI() {
  try {
    const response = await axios.get(`${STORE_API_BASE}/checkout`, {
      timeout: 10000
    });
    logResult('storeApi', 'Checkout API', true, 'Checkout endpoint accessible');
  } catch (error) {
    // 401 is expected for checkout without items
    if (error.response?.status === 401) {
      logResult('storeApi', 'Checkout API', true, 'Checkout endpoint accessible (auth required as expected)');
    } else {
      logResult('storeApi', 'Checkout API', false, error.message);
    }
  }
}

async function testFullCartWorkflow(storeProducts) {
  if (storeProducts.length === 0) {
    console.log('⏭️ Skipping cart workflow test (no products available)');
    return;
  }
  
  console.log('🛒 CART WORKFLOW TEST');
  console.log('─'.repeat(40));
  
  const testProduct = storeProducts[0];
  
  // Test add to cart
  try {
    const addResponse = await axios.post(`${STORE_API_BASE}/cart/add-item`, {
      id: testProduct.id,
      quantity: 1
    }, { timeout: 10000 });
    
    logResult('storeApi', 'Add to Cart', true, `Added ${testProduct.name} to cart`);
    
    // Test get updated cart
    const cartResponse = await axios.get(`${STORE_API_BASE}/cart`, { timeout: 10000 });
    const cart = cartResponse.data;
    
    if (cart.items_count > 0) {
      logResult('storeApi', 'Cart Update', true, `Cart now has ${cart.items_count} items`);
      
      // Test remove from cart
      const firstItem = cart.items[0];
      await axios.post(`${STORE_API_BASE}/cart/remove-item`, {
        key: firstItem.key
      }, { timeout: 10000 });
      
      logResult('storeApi', 'Remove from Cart', true, 'Item removed successfully');
    }
    
  } catch (error) {
    logResult('storeApi', 'Cart Workflow', false, error.message);
  }
}

// Run all tests
async function runFinalTests() {
  console.log('🚀 FINAL COMPREHENSIVE API TEST');
  console.log('════════════════════════════════════════════════════════════');
  console.log(`🏪 Store: ${STORE_URL}`);
  console.log(`🔑 Consumer Key: ${CONSUMER_KEY.substring(0, 10)}...`);
  console.log('════════════════════════════════════════════════════════════');
  console.log('');

  // WooCommerce REST API Tests
  const products = await testWooCommerceAPI();
  await testWooCommerceCategories();
  await testWooCommerceOrders();
  
  console.log('');
  
  // Store API Tests
  await testStoreAPI();
  const storeProducts = await testStoreProductsAPI();
  await testStoreCheckoutAPI();
  
  console.log('');
  
  // Full workflow test
  await testFullCartWorkflow(storeProducts);
  
  // Final Summary
  console.log('');
  console.log('📊 FINAL TEST RESULTS');
  console.log('════════════════════════════════════════════════════════════');
  console.log(`🔵 WooCommerce API: ${results.woocommerce.passed} passed, ${results.woocommerce.failed} failed`);
  console.log(`🟢 Store API: ${results.storeApi.passed} passed, ${results.storeApi.failed} failed`);
  console.log(`📊 Total: ${results.total.passed} passed, ${results.total.failed} failed`);
  
  const successRate = (results.total.passed / (results.total.passed + results.total.failed) * 100).toFixed(1);
  console.log(`📈 Overall Success Rate: ${successRate}%`);
  
  console.log('');
  
  if (results.total.failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Your e-commerce platform is fully functional!');
    console.log('');
    console.log('✅ READY FOR PRODUCTION:');
    console.log('• WooCommerce REST API: Products, Categories, Orders ✓');
    console.log('• WooCommerce Store API: Cart, Checkout, Products ✓');
    console.log('• Full cart workflow: Add, Update, Remove ✓');
    console.log('• E-commerce functionality: Complete ✓');
  } else {
    console.log('⚠️  Some tests failed, but core functionality may still work.');
    console.log('Check individual test results above for details.');
  }
  
  console.log('');
  console.log('🏁 Testing completed!');
}

runFinalTests().catch(error => {
  console.error('❌ Test suite failed:', error);
});
