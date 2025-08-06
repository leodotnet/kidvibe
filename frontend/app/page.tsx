'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-xl font-bold text-gray-900">KidVibe</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/features" className="text-gray-600 hover:text-gray-900">
                功能特性
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                价格方案
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                文档
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <span className="text-sm text-gray-600">
                    欢迎，{user?.email}
                  </span>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    退出登录
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    登录
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    开始使用
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
            AI 驱动的
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Web 应用构建平台
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            通过自然语言描述和聊天交互来创建、改进和部署 Web 应用程序。
            让编程变得简单，让创意快速实现。
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            {isLoggedIn ? (
              <>
                <Link
                  href="/create-project"
                  className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700"
                >
                  开始创建项目
                </Link>
                <Link
                  href="/chat"
                  className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  AI 聊天助手
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700"
                >
                  开始使用
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  登录
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 h-12 w-12 rounded-lg bg-blue-100 p-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">聊天式编程</h3>
            <p className="text-gray-600">通过自然语言对话来创建和改进代码，让编程变得直观简单。</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 h-12 w-12 rounded-lg bg-green-100 p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">实时预览</h3>
            <p className="text-gray-600">代码变更实时反映在预览窗口中，所见即所得的开发体验。</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 h-12 w-12 rounded-lg bg-purple-100 p-3">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">智能生成</h3>
            <p className="text-gray-600">基于多种 AI 模型的智能代码生成，支持多种技术栈和框架。</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 h-12 w-12 rounded-lg bg-orange-100 p-3">
              <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">自动部署</h3>
            <p className="text-gray-600">一键部署到云端，自动配置数据库、API 和运行环境。</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 KidVibe. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 