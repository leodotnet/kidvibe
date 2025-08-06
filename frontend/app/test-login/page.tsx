'use client'

import { useState } from 'react'

export default function TestLoginPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult('')

    try {
      console.log('开始测试登录...')
      
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@kidvibe.com',
          password: 'admin123'
        })
      })

      console.log('响应状态:', response.status)
      console.log('响应头:', Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const data = await response.json()
        setResult(`✅ 登录成功: ${JSON.stringify(data, null, 2)}`)
      } else {
        const errorText = await response.text()
        setResult(`❌ 登录失败 (${response.status}): ${errorText}`)
      }
    } catch (error) {
      console.error('测试登录失败:', error)
      setResult(`❌ 网络错误: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testCORS = async () => {
    setLoading(true)
    setResult('')

    try {
      console.log('开始测试 CORS...')
      
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      })

      console.log('CORS 响应状态:', response.status)
      console.log('CORS 响应头:', Object.fromEntries(response.headers.entries()))

      setResult(`CORS 测试结果 (${response.status}): ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`)
    } catch (error) {
      console.error('CORS 测试失败:', error)
      setResult(`❌ CORS 错误: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            登录测试页面
          </h1>
          
          <div className="space-y-4">
            <button
              onClick={testLogin}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '测试中...' : '测试登录'}
            </button>
            
            <button
              onClick={testCORS}
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? '测试中...' : '测试 CORS'}
            </button>
          </div>
          
          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">测试结果:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {result}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 