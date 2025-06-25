"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, XCircle, Play, RefreshCw } from 'lucide-react'

export default function ApiTestPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [overallResult, setOverallResult] = useState<boolean | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  // Capture console logs
  const originalConsoleLog = console.log
  const originalConsoleError = console.error

  const runApiTests = async () => {
    setIsRunning(true)
    setResults([])
    setOverallResult(null)
    setLogs([])

    // Override console to capture logs
    const capturedLogs: string[] = []
    
    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')
      capturedLogs.push(`[LOG] ${message}`)
      setLogs([...capturedLogs])
      originalConsoleLog(...args)
    }

    console.error = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')
      capturedLogs.push(`[ERROR] ${message}`)
      setLogs([...capturedLogs])
      originalConsoleError(...args)
    }

    try {
      // Import and run the test dynamically
      const { runAllWooCommerceTests } = await import('@/lib/test-woocommerce-api')
      const testResult = await runAllWooCommerceTests()
      
      setOverallResult(testResult)
    } catch (error: any) {
      console.error('Failed to run tests:', error)
      setOverallResult(false)
    } finally {
      // Restore original console functions
      console.log = originalConsoleLog
      console.error = originalConsoleError
      setIsRunning(false)
    }
  }

  const clearResults = () => {
    setResults([])
    setOverallResult(null)
    setLogs([])
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">WooCommerce API Test Suite</h1>
          <p className="text-xl text-gray-600">
            Test all WooCommerce REST API endpoints to ensure your e-commerce functionality works properly
          </p>
        </div>

        {/* Control Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>
              Run comprehensive tests on all WooCommerce API endpoints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={runApiTests} 
                disabled={isRunning}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run All Tests
                  </>
                )}
              </Button>
              
              <Button 
                onClick={clearResults} 
                variant="outline"
                disabled={isRunning}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear Results
              </Button>
            </div>

            {/* Overall Result */}
            {overallResult !== null && (
              <div className="flex items-center gap-2">
                {overallResult ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Badge variant="default" className="bg-green-500">
                      All Tests Passed
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <Badge variant="destructive">
                      Some Tests Failed
                    </Badge>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Results */}
        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Real-time output from the API test suite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className={`
                    ${log.includes('[ERROR]') ? 'text-red-400' : ''}
                    ${log.includes('✅') ? 'text-green-400' : ''}
                    ${log.includes('❌') ? 'text-red-400' : ''}
                    ${log.includes('⚠️') ? 'text-yellow-400' : ''}
                    ${log.includes('🎉') ? 'text-green-300 font-bold' : ''}
                  `}>
                    {log}
                  </div>
                ))}
                {isRunning && (
                  <div className="animate-pulse">
                    <span className="text-blue-400">Running tests...</span>
                    <span className="animate-bounce">_</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Information */}
        <Card>
          <CardHeader>
            <CardTitle>What This Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">WooCommerce API Endpoints</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ API Connection & Authentication</li>
                  <li>✓ Get Products (with filtering)</li>
                  <li>✓ Get Single Product by Slug</li>
                  <li>✓ Get Product Categories</li>
                  <li>✓ Search Products</li>
                  <li>✓ Get Featured Products</li>
                  <li>✓ Get Sale Products</li>
                  <li>✓ Advanced Product Filtering</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">E-commerce Features</h3>
                <ul className="space-y-2 text-sm">
                  <li>🛍️ Product Catalog</li>
                  <li>📂 Category Navigation</li>
                  <li>🔍 Product Search</li>
                  <li>⭐ Featured Products</li>
                  <li>💰 Sale/Discount Products</li>
                  <li>🎛️ Product Filtering & Sorting</li>
                  <li>📱 Mobile-Responsive Design</li>
                  <li>🛒 Shopping Cart Integration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-red-600">If tests fail:</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Check if your WooCommerce store is online: <code className="bg-gray-100 px-1 rounded">https://sultanafitness.store</code></li>
                  <li>Verify WooCommerce REST API is enabled in your WordPress admin</li>
                  <li>Confirm Consumer Key and Secret are correct in environment variables</li>
                  <li>Check if there are any CORS issues or server blocks</li>
                  <li>Ensure your hosting provider allows external API requests</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-600">If tests pass:</h4>
                <p>🎉 Great! Your WooCommerce API is working properly. All e-commerce features should function correctly.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}