import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get environment variables
    const storeUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET
    
    // Test API connection
    const testUrl = `${storeUrl}/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=1`
    
    let apiStatus = 'Unknown'
    let apiError = null
    
    try {
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data = await response.json()
        apiStatus = `Working - ${data.length} products found`
      } else {
        apiStatus = `Failed - HTTP ${response.status}`
        apiError = await response.text()
      }
    } catch (error: any) {
      apiStatus = 'Connection Error'
      apiError = error.message
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      config: {
        storeUrl: storeUrl || 'NOT_SET',
        hasConsumerKey: !!consumerKey,
        hasConsumerSecret: !!consumerSecret,
        consumerKeyPrefix: consumerKey ? consumerKey.substring(0, 10) + '...' : 'NOT_SET'
      },
      apiTest: {
        status: apiStatus,
        error: apiError,
        testUrl: testUrl.replace(consumerSecret || '', '***SECRET***')
      },
      headers: {
        host: request.headers.get('host'),
        userAgent: request.headers.get('user-agent'),
        origin: request.headers.get('origin')
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Debug API failed',
      message: error.message
    }, { status: 500 })
  }
}
