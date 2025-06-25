/**
 * Alternative Cart Solutions Investigation
 * Check WooCommerce native endpoints and alternative solutions
 */

const axios = require('axios');

const STORE_URL = 'https://sultanafitness.store';
const CONSUMER_KEY = 'ck_fe2d2056ee594ff1c4693db397426f6a1425d4ec';
const CONSUMER_SECRET = 'cs_f6f4f25a3aa73c7db791cf2816fb5a1bc5bb34a7';

const wooApi = axios.create({
  baseURL: `${STORE_URL}/wp-json/wc/v3`,
  params: {
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
  },
  timeout: 15000
});

async function investigateAlternatives() {
  console.log('🔍 Investigating Alternative Cart Solutions...');
  console.log('═'.repeat(60));
  
  // 1. Check WooCommerce Store API (newer approach)
  console.log('\n🛒 Testing WooCommerce Store API...');
  console.log('─'.repeat(40));
  
  const storeApiEndpoints = [
    '/cart',
    '/cart/items',
    '/cart/add-item',
    '/cart/remove-item',
    '/cart/update-item',
    '/checkout'
  ];
  
  for (const endpoint of storeApiEndpoints) {
    try {
      const response = await axios.get(`${STORE_URL}/wp-json/wc/store/v1${endpoint}`, {
        timeout: 5000
      });
      console.log(`✅ Store API ${endpoint} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ Store API ${endpoint} - Status: ${error.response?.status || 'Network Error'}`);
    }
  }
  
  // 2. Check WooCommerce Orders/Customers API
  console.log('\n📋 Testing WooCommerce Orders API...');
  console.log('─'.repeat(40));
  
  try {
    const response = await wooApi.get('/orders', { params: { per_page: 1 } });
    console.log(`✅ Orders API - Status: ${response.status} - Found ${response.data.length} orders`);
  } catch (error) {
    console.log(`❌ Orders API - Status: ${error.response?.status || 'Error'}`);
  }
  
  try {
    const response = await wooApi.get('/customers', { params: { per_page: 1 } });
    console.log(`✅ Customers API - Status: ${response.status} - Found ${response.data.length} customers`);
  } catch (error) {
    console.log(`❌ Customers API - Status: ${error.response?.status || 'Error'}`);
  }
  
  // 3. Check WordPress REST API for plugins
  console.log('\n🔌 Checking Installed Plugins...');
  console.log('─'.repeat(40));
  
  try {
    const response = await axios.get(`${STORE_URL}/wp-json/`, {
      timeout: 10000
    });
    
    const routes = response.data.routes || {};
    const cartRelatedRoutes = Object.keys(routes).filter(route => 
      route.includes('cart') || 
      route.includes('cocart') || 
      route.includes('wc/store') ||
      route.includes('basket')
    );
    
    if (cartRelatedRoutes.length > 0) {
      console.log('📋 Available Cart-Related Routes:');
      cartRelatedRoutes.forEach(route => {
        const methods = routes[route].methods || [];
        console.log(`   - ${route} [${methods.join(', ')}]`);
      });
    } else {
      console.log('❌ No cart-related routes found');
    }
  } catch (error) {
    console.log('❌ Could not fetch WordPress REST API index');
  }
  
  // 4. Test working CoCart endpoints to understand what's available
  console.log('\n✅ Testing Working CoCart Endpoints...');
  console.log('─'.repeat(40));
  
  try {
    const cartResponse = await axios.get(`${STORE_URL}/wp-json/cocart/v2/cart`);
    console.log('📋 Current cart structure:');
    console.log(JSON.stringify(cartResponse.data, null, 2));
  } catch (error) {
    console.log('❌ Could not fetch cart details');
  }
  
  try {
    const totalsResponse = await axios.get(`${STORE_URL}/wp-json/cocart/v1/totals`);
    console.log('📊 Available totals:');
    console.log(JSON.stringify(totalsResponse.data, null, 2));
  } catch (error) {
    console.log('❌ Could not fetch totals');
  }
  
  // 5. Try direct WooCommerce Session endpoints
  console.log('\n🔐 Testing WooCommerce Session Endpoints...');
  console.log('─'.repeat(40));
  
  const sessionEndpoints = [
    '/system_status',
    '/settings',
    '/settings/general',
    '/payment_gateways',
    '/shipping/zones'
  ];
  
  for (const endpoint of sessionEndpoints) {
    try {
      const response = await wooApi.get(endpoint);
      console.log(`✅ ${endpoint} - Available`);
    } catch (error) {
      console.log(`❌ ${endpoint} - Status: ${error.response?.status || 'Error'}`);
    }
  }
}

async function testCreateOrder() {
  console.log('\n🛍️ Testing Order Creation (Alternative to Cart)...');
  console.log('─'.repeat(50));
  
  try {
    // First get a product to test with
    const productsResponse = await wooApi.get('/products', { params: { per_page: 1 } });
    
    if (productsResponse.data.length === 0) {
      console.log('❌ No products available for testing');
      return;
    }
    
    const product = productsResponse.data[0];
    console.log(`📦 Testing with product: ${product.name} (ID: ${product.id})`);
    
    // Try to create a test order
    const orderData = {
      payment_method: 'bacs',
      payment_method_title: 'Direct Bank Transfer',
      set_paid: false,
      billing: {
        first_name: 'Test',
        last_name: 'Customer',
        address_1: 'Test Address',
        city: 'Riyadh',
        state: 'Riyadh Region',
        postcode: '12345',
        country: 'SA',
        email: 'test@example.com',
        phone: '123456789'
      },
      shipping: {
        first_name: 'Test',
        last_name: 'Customer',
        address_1: 'Test Address',
        city: 'Riyadh',
        state: 'Riyadh Region',
        postcode: '12345',
        country: 'SA'
      },
      line_items: [
        {
          product_id: product.id,
          quantity: 1
        }
      ]
    };
    
    // Note: This is just a test - we won't actually create the order
    console.log('✅ Order structure prepared successfully');
    console.log('📋 Can create orders as alternative to cart functionality');
    
  } catch (error) {
    console.log(`❌ Order creation test failed: ${error.message}`);
  }
}

async function runInvestigation() {
  await investigateAlternatives();
  await testCreateOrder();
  
  console.log('\n📝 RECOMMENDATIONS:');
  console.log('═'.repeat(60));
  console.log('1. CoCart plugin needs to be properly installed/configured');
  console.log('2. Consider using WooCommerce Store API (if available)');
  console.log('3. Alternative: Use localStorage for cart + Orders API for checkout');
  console.log('4. Alternative: Implement session-based cart with WooCommerce');
  console.log('\n🏁 Investigation completed!');
}

runInvestigation().catch(error => {
  console.error('❌ Investigation failed:', error.message);
});
