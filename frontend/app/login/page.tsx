'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

      if (response.ok) {
        const data = await response.json()
        // 保存令牌到 localStorage
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify({ email }))
        
        // 跳转到创建项目页面
        router.push('/create-project')
      } else {
        const errorData = await response.json()
        setError(errorData.detail || '登录失败')
      }
    } catch (error) {
      console.error('登录失败:', error)
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              登录 KidVibe
            </CardTitle>
            <CardDescription>
              请输入您的账号信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kidvibe.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>默认账号：</p>
              <p>邮箱：admin@kidvibe.com</p>
              <p>密码：admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 