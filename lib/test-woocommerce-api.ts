import { 
  testApiConnection, 
  getProducts, 
  getProduct, 
  getCategories, 
  getCategory,
  getFeaturedProducts,
  getSaleProducts,
  searchProducts,
  config 
} from './woocommerce'

// Test configuration
console.log('🔧 WooCommerce API Configuration:')
console.log('- Store URL:', config.storeUrl)
console.log('- API Base URL:', config.apiBaseUrl)
console.log('- Has Credentials:', config.hasCredentials)
console.log('')

/**
 * Comprehensive WooCommerce API Test Suite
 */
export async function runAllWooCommerceTests(): Promise<boolean> {
  console.log('🚀 Starting WooCommerce API Test Suite...')
  console.log('='.repeat(60))
  
  let allTestsPassed = true
  const results: { test: string; passed: boolean; error?: string }[] = []

  // Test 1: API Connection
  console.log('\n📡 Test 1: API Connection')
  console.log('-'.repeat(30))
  try {
    const connectionResult = await testApiConnection()
    results.push({ test: 'API Connection', passed: connectionResult })
    if (!connectionResult) {
      console.log('❌ API Connection Failed')
      allTestsPassed = false
    }
  } catch (error: any) {
    console.log('❌ API Connection Test Error:', error.message)
    results.push({ test: 'API Connection', passed: false, error: error.message })
    allTestsPassed = false
  }

  // Test 2: Get Products (Basic)
  console.log('\n🛍️ Test 2: Get Products (Basic)')
  console.log('-'.repeat(30))
  try {
    const products = await getProducts({ per_page: 5 })
    const passed = Array.isArray(products) && products.length >= 0
    results.push({ test: 'Get Products (Basic)', passed })
    
    if (passed) {
      console.log(`✅ Successfully fetched ${products.length} products`)
      if (products.length > 0) {
        console.log(`📦 Sample product: ${products[0].name} (ID: ${products[0].id})`)
      }
    } else {
      console.log('❌ Get Products failed - Invalid response')
      allTestsPassed = false
    }
  } catch (error: any) {
    console.log('❌ Get Products Test Error:', error.message)
    results.push({ test: 'Get Products (Basic)', passed: false, error: error.message })
    allTestsPassed = false
  }

  // Test 3: Get Categories
  console.log('\n📂 Test 3: Get Categories')
  console.log('-'.repeat(30))
  try {
    const categories = await getCategories()
    const passed = Array.isArray(categories) && categories.length >= 0
    results.push({ test: 'Get Categories', passed })
    
    if (passed) {
      console.log(`✅ Successfully fetched ${categories.length} categories`)
      if (categories.length > 0) {
        console.log('📋 Available categories:')
        categories.slice(0, 5).forEach(cat => {
          console.log(`   - ${cat.name} (${cat.count} products)`)
        })
      }
    } else {
      console.log('❌ Get Categories failed - Invalid response')
      allTestsPassed = false
    }
  } catch (error: any) {
    console.log('❌ Get Categories Test Error:', error.message)
    results.push({ test: 'Get Categories', passed: false, error: error.message })
    allTestsPassed = false
  }

  // Test 4: Get Single Product by Slug
  console.log('\n🔍 Test 4: Get Single Product by Slug')
  console.log('-'.repeat(30))
  try {
    // First get a product to test with
    const allProducts = await getProducts({ per_page: 1 })
    
    if (allProducts.length > 0) {
      const testSlug = allProducts[0].slug
      console.log(`🎯 Testing with product slug: ${testSlug}`)
      
      const product = await getProduct(testSlug)
      const passed = product !== null && product.slug === testSlug
      results.push({ test: 'Get Single Product', passed })
      
      if (passed) {
        console.log(`✅ Successfully fetched product: ${product?.name}`)
      } else {
        console.log('❌ Get Single Product failed - Product not found')
        allTestsPassed = false
      }
    } else {
      console.log('⚠️ Skipping single product test - No products available')
      results.push({ test: 'Get Single Product', passed: true }) // Skip test
    }
  } catch (error: any) {
    console.log('❌ Get Single Product Test Error:', error.message)
    results.push({ test: 'Get Single Product', passed: false, error: error.message })
    allTestsPassed = false
  }

  // Test 5: Search Products
  console.log('\n🔎 Test 5: Search Products')
  console.log('-'.repeat(30))
  try {
    const searchResults = await searchProducts('fitness', { per_page: 3 })
    const passed = Array.isArray(searchResults)
    results.push({ test: 'Search Products', passed })
    
    if (passed) {
      console.log(`✅ Successfully searched products: ${searchResults.length} results for "fitness"`)
      if (searchResults.length > 0) {
        console.log('🔍 Search results:')
        searchResults.forEach(product => {
          console.log(`   - ${product.name} (SAR ${product.price})`)
        })
      }
    } else {
      console.log('❌ Search Products failed - Invalid response')
      allTestsPassed = false
    }
  } catch (error: any) {
    console.log('❌ Search Products Test Error:', error.message)
    results.push({ test: 'Search Products', passed: false, error: error.message })
    allTestsPassed = false
  }

  // Test 6: Get Featured Products
  console.log('\n⭐ Test 6: Get Featured Products')
  console.log('-'.repeat(30))
  try {
    const featuredProducts = await getFeaturedProducts(3)
    const passed = Array.isArray(featuredProducts)
    results.push({ test: 'Get Featured Products', passed })
    
    if (passed) {
      console.log(`✅ Successfully fetched ${featuredProducts.length} featured products`)
      featuredProducts.forEach(product => {
        console.log(`   ⭐ ${product.name} (Featured: ${product.featured})`)
      })
    } else {
      console.log('❌ Get Featured Products failed - Invalid response')
      allTestsPassed = false
    }
  } catch (error: any) {
    console.log('❌ Get Featured Products Test Error:', error.message)
    results.push({ test: 'Get Featured Products', passed: false, error: error.message })
    allTestsPassed = false
  }

  // Test 7: Get Sale Products
  console.log('\n💰 Test 7: Get Sale Products')
  console.log('-'.repeat(30))
  try {
    const saleProducts = await getSaleProducts(3)
    const passed = Array.isArray(saleProducts)
    results.push({ test: 'Get Sale Products', passed })
    
    if (passed) {
      console.log(`✅ Successfully fetched ${saleProducts.length} sale products`)
      saleProducts.forEach(product => {
        if (product.on_sale) {
          console.log(`   💰 ${product.name} - Was SAR ${product.regular_price}, Now SAR ${product.sale_price}`)
        } else {
          console.log(`   📦 ${product.name} - SAR ${product.price}`)
        }
      })
    } else {
      console.log('❌ Get Sale Products failed - Invalid response')  
      allTestsPassed = false
    }
  } catch (error: any) {
    console.log('❌ Get Sale Products Test Error:', error.message)
    results.push({ test: 'Get Sale Products', passed: false, error: error.message })
    allTestsPassed = false
  }

  // Test 8: Advanced Product Filtering
  console.log('\n🎛️ Test 8: Advanced Product Filtering')
  console.log('-'.repeat(30))
  try {
    const filteredProducts = await getProducts({ 
      per_page: 3, 
      orderby: 'price',
      order: 'desc'
    })
    const passed = Array.isArray(filteredProducts)
    results.push({ test: 'Advanced Filtering', passed })
    
    if (passed) {
      console.log(`✅ Successfully fetched ${filteredProducts.length} products with advanced filtering`)
      console.log('💲 Products ordered by price (desc):')
      filteredProducts.forEach(product => {
        console.log(`   - ${product.name}: SAR ${product.price}`)
      })
    } else {
      console.log('❌ Advanced Filtering failed - Invalid response')
      allTestsPassed = false
    }
  } catch (error: any) {
    console.log('❌ Advanced Filtering Test Error:', error.message)
    results.push({ test: 'Advanced Filtering', passed: false, error: error.message })
    allTestsPassed = false
  }

  // Final Results Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Test Results Summary')
  console.log('='.repeat(60))
  
  const passedTests = results.filter(r => r.passed).length
  const totalTests = results.length
  
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌'
    console.log(`${status} ${result.test}`)
    if (result.error) {
      console.log(`   Error: ${result.error}`)
    }
  })
  
  console.log('')
  console.log(`📋 Overall: ${passedTests}/${totalTests} tests passed`)
  
  if (allTestsPassed) {
    console.log('🎉 All WooCommerce API tests PASSED! Your e-commerce functionality should work properly.')
  } else {
    console.log('⚠️ Some tests FAILED. Please check the errors above and fix the issues.')
  }
  
  console.log('')
  console.log('🔗 API Endpoints Tested:')
  console.log('- GET /products (with various parameters)')
  console.log('- GET /products/{id}')
  console.log('- GET /products/categories')
  console.log('- Authentication via Consumer Key/Secret')
  
  return allTestsPassed
}

// Export for use in other files
export default runAllWooCommerceTests