// Copy and paste this code into your browser console to test the APIs
// This mimics your working Postman request

async function testWooCommerceAPI() {
  console.log("🧪 Testing WooCommerce API...");
  
  try {
    // Test the exact URL that works in Postman
    const response = await fetch(
      "https://www.sultanafitness.store/wp-json/wc/v3/products?consumer_key=ck_fe2d2056ee594ff1c4693db397426f6a1425d4ec&consumer_secret=cs_f6f4f25a3aa73c7db791cf2816fb5a1bc5bb34a7&per_page=5"
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const products = await response.json();
    
    console.log("✅ WooCommerce API is working!");
    console.log(`Found ${products.length} products:`);
    
    products.forEach((product: any) => {
      console.log(`- ${product.name} (ID: ${product.id}, Price: ${product.price})`);
    });
    
    return true;
  } catch (error) {
    console.log("❌ WooCommerce API failed:", error);
    return false;
  }
}

async function testCoCartAPI() {
  console.log("\n🛒 Testing CoCart API...");
  
  try {
    const response = await fetch("https://www.sultanafitness.store/wp-json/cocart/v2/cart");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const cart = await response.json();
    
    console.log("✅ CoCart API is working!");
    console.log(`Cart has ${cart.item_count || 0} items`);
    console.log(`Cart total: ${cart.totals?.total || '0'}`);
    
    return true;
  } catch (error) {
    console.error("❌ CoCart API failed:", error);
    return false;
  }
}

// Run both tests
async function runAllTests() {
  console.log("🚀 Starting API Tests...\n");
  
  await testWooCommerceAPI();
  await testCoCartAPI();
  
  console.log("\n🏁 Tests Complete!");
}

// Run the tests
runAllTests();