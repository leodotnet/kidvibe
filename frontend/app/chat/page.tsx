'use client'

import { useState } from 'react'
import { ChatInterface } from '@/components/chat/ChatInterface'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat/chat', {
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

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message?.content || '抱歉，我无法处理您的请求。',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '抱歉，发生了错误，请稍后重试。',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('聊天请求失败:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '网络错误，请检查连接后重试。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI 编程助手
          </h1>
          <p className="text-xl text-gray-600">
            与 AI 助手对话，获取编程帮助和代码建议
          </p>
        </div>

        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          loading={loading}
        />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>KidVibe AI 助手可以帮助您解决编程问题、生成代码、分析需求等</p>
        </div>
      </div>
    </div>
  )
} 