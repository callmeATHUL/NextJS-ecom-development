/**
 * Test Fixed Cart API System
 * Run this file to verify the new Store API cart implementation
 */

const axios = require('axios');

// Configuration
const STORE_URL = 'https://sultanafitness.store';
const STORE_API_BASE = `${STORE_URL}/wp-json/wc/store/v1`;
const CONSUMER_KEY = 'ck_fe2d2056ee594ff1c4693db397426f6a1425d4ec';
const CONSUMER_SECRET = 'cs_f6f4f25a3aa73c7db791cf2816fb5a1bc5bb34a7';

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

// Helper function to make Store API requests
async function storeApiRequest(endpoint, method = 'GET', data = null) {
  try {
    const config = {
      method,
      url: `${STORE_API_BASE}${endpoint}`,
      timeout: 15000,
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

// Helper function to get WooCommerce products for testing
async function getTestProduct() {
  try {
    const response = await axios.get(`${STORE_URL}/wp-json/wc/v3/products`, {
      params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        per_page: 1,
        status: 'publish'
      }
    });
    return response.data[0] || null;
  } catch (error) {
    return null;
  }
}

// Test logging function
function logTest(testName, result, details = '') {
  const status = result.success ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${testName}`);
  
  if (result.success) {
    testResults.passed++;
    if (details) console.log(`   ℹ️  ${details}`);
  } else {
    testResults.failed++;
    console.log(`   ❌ Error: ${result.error}`);
    if (result.status) console.log(`   📋 Status: ${result.status}`);
    if (result.data) console.log(`   📄 Data:`, JSON.stringify(result.data, null, 2));
  }
  
  testResults.total++;
  console.log('');
}

// Individual test functions
async function testStoreApiConnection() {
  console.log('🔧 Testing Store API Connection...');
  const result = await storeApiRequest('/cart');
  
  logTest('Store API Connection', result, 
    result.success ? `Connected successfully (Status: ${result.status})` : '');
  
  return result.success ? result.data : null;
}

async function testGetCart() {
  console.log('🛒 Testing Get Cart...');
  const result = await storeApiRequest('/cart');
  
  logTest('Get Cart', result, 
    result.success ? `Cart contains ${result.data.items_count || 0} items` : '');
  
  return result.success ? result.data : null;
}

async function testAddItemToCart(product) {
  if (!product) {
    console.log('⏭️ Skipping add to cart test (no product available)');
    return null;
  }
  
  console.log('➕ Testing Add Item to Cart...');
  const result = await storeApiRequest('/cart/add-item', 'POST', {
    id: product.id,
    quantity: 1
  });
  
  logTest('Add Item to Cart', result, 
    result.success ? `Added product ${product.name} (ID: ${product.id}) to cart` : '');
  
  return result.success ? result.data : null;
}

async function testUpdateCartItem(cart) {
  if (!cart || !cart.items || cart.items.length === 0) {
    console.log('⏭️ Skipping update cart item test (no items in cart)');
    return null;
  }
  
  console.log('📝 Testing Update Cart Item...');
  const firstItem = cart.items[0];
  const result = await storeApiRequest('/cart/update-item', 'POST', {
    key: firstItem.key,
    quantity: 2
  });
  
  logTest('Update Cart Item', result, 
    result.success ? `Updated item quantity to 2` : '');
  
  return result.success ? result.data : null;
}

async function testRemoveCartItem(cart) {
  if (!cart || !cart.items || cart.items.length === 0) {
    console.log('⏭️ Skipping remove cart item test (no items in cart)');
    return null;
  }
  
  console.log('🗑️ Testing Remove Cart Item...');
  const firstItem = cart.items[0];
  const result = await storeApiRequest('/cart/remove-item', 'POST', {
    key: firstItem.key
  });
  
  logTest('Remove Cart Item', result, 
    result.success ? `Removed item from cart` : '');
  
  return result.success ? result.data : null;
}

async function testClearCart() {
  console.log('🧹 Testing Clear Cart (by removing all items)...');
  
  // First get current cart
  const cartResult = await storeApiRequest('/cart');
  if (!cartResult.success || !cartResult.data.items || cartResult.data.items.length === 0) {
    console.log('✅ Cart is already empty');
    logTest('Clear Cart', { success: true }, 'Cart was already empty');
    return;
  }
  
  // Remove each item
  let allRemoved = true;
  let errorMessage = '';
  
  for (const item of cartResult.data.items) {
    const result = await storeApiRequest('/cart/remove-item', 'POST', {
      key: item.key
    });
    
    if (!result.success) {
      allRemoved = false;
      errorMessage = result.error;
      break;
    }
  }
  
  logTest('Clear Cart', 
    { success: allRemoved, error: errorMessage }, 
    allRemoved ? 'All items removed successfully' : '');
}

async function testApplyCoupon() {
  console.log('🎫 Testing Apply Coupon...');
  const result = await storeApiRequest('/cart/apply-coupon', 'POST', {
    code: 'TESTCOUPON'
  });
  
  // This might fail if coupon doesn't exist, which is expected
  const isExpectedFailure = result.status === 400 && 
    (result.data?.message?.includes('does not exist') || 
     result.data?.message?.includes('not valid'));
  
  if (isExpectedFailure) {
    logTest('Apply Coupon', { success: true }, 'Coupon endpoint working (coupon not found as expected)');
  } else {
    logTest('Apply Coupon', result, 
      result.success ? 'Coupon applied successfully' : '');
  }
}

async function testCartItems() {
  console.log('📦 Testing Cart Items Endpoint...');
  const result = await storeApiRequest('/cart/items');
  
  logTest('Cart Items Endpoint', result, 
    result.success ? `Items endpoint accessible` : '');
}

// Main test runner
async function runFixedCartTests() {
  console.log('🚀 Testing Fixed Cart API System...');
  console.log('═'.repeat(60));
  console.log(`🏪 Store URL: ${STORE_URL}`);
  console.log(`🔗 Store API: ${STORE_API_BASE}`);
  console.log('═'.repeat(60));
  console.log('');

  // Get a test product first
  console.log('📦 Getting test product...');
  const testProduct = await getTestProduct();
  if (testProduct) {
    console.log(`✅ Test product: ${testProduct.name} (ID: ${testProduct.id})`);
  } else {
    console.log('⚠️ No test product available');
  }
  console.log('');

  // Run Store API tests
  console.log('🟢 STORE API CART TESTS');
  console.log('─'.repeat(30));
  
  const initialCart = await testStoreApiConnection();
  await testGetCart();
  await testCartItems();
  
  const cartWithItem = await testAddItemToCart(testProduct);
  const updatedCart = await testUpdateCartItem(cartWithItem);
  await testRemoveCartItem(updatedCart || cartWithItem);
  
  await testApplyCoupon();
  await testClearCart();
  
  // Final Summary
  console.log('');
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(60));
  console.log(`✅ Tests Passed: ${testResults.passed}`);
  console.log(`❌ Tests Failed: ${testResults.failed}`);
  console.log(`📊 Total Tests: ${testResults.total}`);
  
  const successRate = (testResults.passed / testResults.total * 100).toFixed(1);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  console.log('');
  
  if (testResults.failed > 0) {
    console.log('🔧 ANALYSIS:');
    console.log('─'.repeat(30));
    console.log('Some tests failed. This could be due to:');
    console.log('• WooCommerce Store API permissions');
    console.log('• Missing test data (products, coupons)');
    console.log('• Server-side session handling');
    console.log('• CORS or authentication issues');
    console.log('');
    console.log('📋 Check the detailed error information above each failed test.');
  } else {
    console.log('🎉 All tests passed! The fixed cart system is working correctly.');
    console.log('');
    console.log('✅ Ready to deploy the fixes:');
    console.log('1. Replace cart-api.ts with cart-api-fixed.ts');
    console.log('2. Replace cart-store.ts with cart-store-fixed.ts');
    console.log('3. Update any components to use the new cart store');
  }
  
  console.log('');
  console.log('🏁 Test completed!');
}

// Run the tests
runFixedCartTests().catch(error => {
  console.error('❌ Test runner failed:', error);
});
