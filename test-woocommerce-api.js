/**
 * Comprehensive WooCommerce & CoCart API Test Suite
 * Run this file with: node test-woocommerce-api.js
 */

const axios = require('axios');

// Configuration from your .env.local
const STORE_URL = 'https://sultanafitness.store';
const CONSUMER_KEY = 'ck_fe2d2056ee594ff1c4693db397426f6a1425d4ec';
const CONSUMER_SECRET = 'cs_f6f4f25a3aa73c7db791cf2816fb5a1bc5bb34a7';

// API Base URLs
const WOOCOMMERCE_API_BASE = `${STORE_URL}/wp-json/wc/v3`;
const COCART_API_BASE = `${STORE_URL}/wp-json/cocart/v2`;

// Test results storage
const testResults = {
  woocommerce: {},
  cocart: {},
  summary: { passed: 0, failed: 0, total: 0 }
};

// Helper function to make authenticated WooCommerce requests
async function wooCommerceRequest(endpoint, params = {}) {
  try {
    const url = `${WOOCOMMERCE_API_BASE}${endpoint}`;
    const response = await axios.get(url, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        ...params
      },
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
  }
}

// Helper function to make CoCart requests
async function coCartRequest(endpoint, method = 'GET', data = null) {
  try {
    const url = `${COCART_API_BASE}${endpoint}`;
    const config = {
      method,
      url,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
  }
}

// Test logging function
function logTest(testName, result, details = '') {
  const status = result.success ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${testName}`);
  
  if (result.success) {
    testResults.summary.passed++;
    if (details) console.log(`   ℹ️  ${details}`);
  } else {
    testResults.summary.failed++;
    console.log(`   ❌ Error: ${result.error}`);
    if (result.status) console.log(`   📋 Status: ${result.status}`);
    if (result.data) console.log(`   📄 Data:`, result.data);
  }
  
  testResults.summary.total++;
  console.log(''); // Empty line for readability
}

// Individual test functions
async function testWooCommerceConnection() {
  console.log('🔧 Testing WooCommerce API Connection...');
  const result = await wooCommerceRequest('/products', { per_page: 1 });
  
  testResults.woocommerce.connection = result;
  logTest('WooCommerce API Connection', result, 
    result.success ? `Connected successfully (Status: ${result.status})` : '');
}

async function testGetProducts() {
  console.log('🛍️ Testing Get Products...');
  const result = await wooCommerceRequest('/products', { per_page: 5 });
  
  testResults.woocommerce.getProducts = result;
  logTest('Get Products', result, 
    result.success ? `Retrieved ${result.data.length} products` : '');
  
  return result.success ? result.data : [];
}

async function testGetCategories() {
  console.log('📂 Testing Get Categories...');
  const result = await wooCommerceRequest('/products/categories', { per_page: 10 });
  
  testResults.woocommerce.getCategories = result;
  logTest('Get Categories', result, 
    result.success ? `Retrieved ${result.data.length} categories` : '');
  
  return result.success ? result.data : [];
}

async function testGetSingleProduct(products) {
  if (products.length === 0) {
    console.log('⏭️ Skipping single product test (no products available)');
    return;
  }
  
  console.log('🔍 Testing Get Single Product...');
  const productId = products[0].id;
  const result = await wooCommerceRequest(`/products/${productId}`);
  
  testResults.woocommerce.getSingleProduct = result;
  logTest('Get Single Product', result, 
    result.success ? `Retrieved product: ${result.data.name}` : '');
}

async function testSearchProducts() {
  console.log('🔎 Testing Search Products...');
  const result = await wooCommerceRequest('/products', { 
    search: 'fitness',
    per_page: 3 
  });
  
  testResults.woocommerce.searchProducts = result;
  logTest('Search Products', result, 
    result.success ? `Found ${result.data.length} products matching "fitness"` : '');
}

async function testGetProductsByCategory(categories) {
  if (categories.length === 0) {
    console.log('⏭️ Skipping category products test (no categories available)');
    return;
  }
  
  console.log('📁 Testing Get Products by Category...');
  const categoryId = categories[0].id;
  const result = await wooCommerceRequest('/products', { 
    category: categoryId,
    per_page: 3 
  });
  
  testResults.woocommerce.getProductsByCategory = result;
  logTest('Get Products by Category', result, 
    result.success ? `Found ${result.data.length} products in category "${categories[0].name}"` : '');
}

async function testCoCartConnection() {
  console.log('🛒 Testing CoCart API Connection...');
  const result = await coCartRequest('/cart');
  
  testResults.cocart.connection = result;
  logTest('CoCart API Connection', result, 
    result.success ? `Connected successfully (Status: ${result.status})` : '');
}

async function testCoCartGetCart() {
  console.log('🛍️ Testing CoCart Get Cart...');
  const result = await coCartRequest('/cart');
  
  testResults.cocart.getCart = result;
  logTest('CoCart Get Cart', result, 
    result.success ? `Cart contains ${result.data.item_count || 0} items` : '');
  
  return result.success ? result.data : null;
}

async function testCoCartAddItem(products) {
  if (products.length === 0) {
    console.log('⏭️ Skipping add to cart test (no products available)');
    return;
  }
  
  console.log('➕ Testing CoCart Add Item...');
  const productId = products[0].id;
  const result = await coCartRequest('/cart/add-item', 'POST', {
    id: productId,
    quantity: 1
  });
  
  testResults.cocart.addItem = result;
  logTest('CoCart Add Item', result, 
    result.success ? `Added product ${productId} to cart` : '');
  
  return result.success ? result.data : null;
}

async function testCoCartUpdateItem(cartItem) {
  if (!cartItem || !cartItem.item_key) {
    console.log('⏭️ Skipping update cart item test (no cart item available)');
    return;
  }
  
  console.log('📝 Testing CoCart Update Item...');
  const result = await coCartRequest('/cart/item', 'POST', {
    cart_item_key: cartItem.item_key,
    quantity: 2
  });
  
  testResults.cocart.updateItem = result;
  logTest('CoCart Update Item', result, 
    result.success ? `Updated item quantity to 2` : '');
}

async function testCoCartRemoveItem(cartItem) {
  if (!cartItem || !cartItem.item_key) {
    console.log('⏭️ Skipping remove cart item test (no cart item available)');
    return;
  }
  
  console.log('🗑️ Testing CoCart Remove Item...');
  const result = await coCartRequest(`/cart/item/${cartItem.item_key}`, 'DELETE');
  
  testResults.cocart.removeItem = result;
  logTest('CoCart Remove Item', result, 
    result.success ? `Removed item from cart` : '');
}

async function testCoCartClearCart() {
  console.log('🧹 Testing CoCart Clear Cart...');
  const result = await coCartRequest('/cart/clear', 'DELETE');
  
  testResults.cocart.clearCart = result;
  logTest('CoCart Clear Cart', result, 
    result.success ? `Cart cleared successfully` : '');
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive WooCommerce & CoCart API Tests...');
  console.log('═'.repeat(60));
  console.log(`🏪 Store URL: ${STORE_URL}`);
  console.log(`🔑 Consumer Key: ${CONSUMER_KEY.substring(0, 10)}...`);
  console.log('═'.repeat(60));
  console.log('');

  // WooCommerce API Tests
  console.log('🔵 WOOCOMMERCE API TESTS');
  console.log('─'.repeat(30));
  
  await testWooCommerceConnection();
  const products = await testGetProducts();
  const categories = await testGetCategories();
  await testGetSingleProduct(products);
  await testSearchProducts();
  await testGetProductsByCategory(categories);
  
  console.log('');
  
  // CoCart API Tests
  console.log('🟢 COCART API TESTS');
  console.log('─'.repeat(30));
  
  await testCoCartConnection();
  await testCoCartGetCart();
  const addedItem = await testCoCartAddItem(products);
  await testCoCartUpdateItem(addedItem);
  await testCoCartRemoveItem(addedItem);
  await testCoCartClearCart();
  
  // Final Summary
  console.log('');
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(60));
  console.log(`✅ Tests Passed: ${testResults.summary.passed}`);
  console.log(`❌ Tests Failed: ${testResults.summary.failed}`);
  console.log(`📊 Total Tests: ${testResults.summary.total}`);
  
  const successRate = (testResults.summary.passed / testResults.summary.total * 100).toFixed(1);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  console.log('');
  
  if (testResults.summary.failed > 0) {
    console.log('🔧 RECOMMENDED FIXES:');
    console.log('─'.repeat(30));
    
    // WooCommerce issues
    if (!testResults.woocommerce.connection?.success) {
      console.log('❌ WooCommerce API Connection Failed:');
      console.log('   • Check if WooCommerce REST API is enabled');
      console.log('   • Verify consumer key and secret');
      console.log('   • Ensure store URL is correct');
      console.log('   • Check if SSL is properly configured');
    }
    
    // CoCart issues
    if (!testResults.cocart.connection?.success) {
      console.log('❌ CoCart API Connection Failed:');
      console.log('   • Install CoCart plugin from WordPress admin');
      console.log('   • Ensure CoCart plugin is activated');
      console.log('   • Check plugin compatibility with your WooCommerce version');
    }
    
    console.log('');
    console.log('📋 Detailed error information is shown above each failed test.');
  } else {
    console.log('🎉 All tests passed! Your APIs are working correctly.');
  }
  
  console.log('');
  console.log('🏁 Test completed!');
}

// Run the tests
runAllTests().catch(error => {
  console.error('❌ Test runner failed:', error);
});
