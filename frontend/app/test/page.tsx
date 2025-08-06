'use client'

import { useState } from 'react'

export default function TestPage() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/health')
      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`错误: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testChat = async () => {
    if (!message.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/v1/chat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          session_id: null,
          context: {}
        })
      })
      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`错误: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">KidVibe 测试页面</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* API 测试 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">API 健康检查</h2>
            <button
              onClick={testAPI}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '测试中...' : '测试 API'}
            </button>
          </div>

          {/* 聊天测试 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">AI 聊天测试</h2>
            <div className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="输入您的消息..."
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={3}
              />
              <button
                onClick={testChat}
                disabled={loading || !message.trim()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? '发送中...' : '发送消息'}
              </button>
            </div>
          </div>
        </div>

        {/* 响应显示 */}
        {response && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">响应结果</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {response}
            </pre>
          </div>
        )}

        {/* 项目信息 */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">项目信息</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-gray-900">前端技术栈</h3>
              <ul className="mt-2 text-sm text-gray-600">
                <li>• Next.js 14</li>
                <li>• React 18</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">后端技术栈</h3>
              <ul className="mt-2 text-sm text-gray-600">
                <li>• FastAPI</li>
                <li>• Python 3.11</li>
                <li>• SQLAlchemy</li>
                <li>• Gemini AI</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 