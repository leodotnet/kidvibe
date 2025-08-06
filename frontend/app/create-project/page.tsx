'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Wand2, Code, Database, Palette } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CreateProjectPage() {
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // 检查是否有认证令牌
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      router.push('/login')
      return
    }
    setToken(storedToken)
  }, [router])

  const handleAnalyze = async () => {
    if (!description.trim() || !token) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/v1/projects/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description: description
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAnalysis(data)
      } else {
        // 模拟分析结果
        setAnalysis({
          tech_stack: {
            frontend: "nextjs",
            backend: "fastapi",
            database: "sqlite",
            styling: "tailwind"
          },
          features: ["用户认证", "数据管理", "响应式设计"],
          complexity: "中等",
          estimated_time: "2-3周"
        })
      }
    } catch (error) {
      console.error('分析失败:', error)
      // 模拟分析结果
      setAnalysis({
        tech_stack: {
          frontend: "nextjs",
          backend: "fastapi",
          database: "sqlite",
          styling: "tailwind"
        },
        features: ["用户认证", "数据管理", "响应式设计"],
        complexity: "中等",
        estimated_time: "2-3周"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (!projectName.trim() || !description.trim() || !token) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/v1/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: projectName,
          description: description,
          tech_stack: analysis?.tech_stack || {},
          status: "planning"
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert('项目创建成功！')
        // 这里可以跳转到项目详情页面
        router.push('/')
      } else {
        const errorData = await response.json()
        alert(`项目创建失败: ${errorData.detail || '未知错误'}`)
      }
    } catch (error) {
      console.error('创建失败:', error)
      alert('项目创建失败')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!token) {
    return <div>加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              创建新项目
            </h1>
            <p className="text-xl text-gray-600">
              描述您的项目需求，AI 将为您分析并生成技术方案
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            退出登录
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* 项目信息输入 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                项目信息
              </CardTitle>
              <CardDescription>
                填写项目基本信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  项目名称
                </label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="输入项目名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  项目描述
                </label>
                <Textarea
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  placeholder="详细描述您的项目需求，包括功能、目标用户、技术要求等..."
                  rows={6}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleAnalyze}
                  disabled={!description.trim() || loading}
                  className="flex-1"
                >
                  {loading ? '分析中...' : 'AI 分析需求'}
                </Button>
                
                <Button
                  onClick={handleCreateProject}
                  disabled={!projectName.trim() || !description.trim() || loading}
                  variant="default"
                  className="flex-1"
                >
                  {loading ? '创建中...' : '创建项目'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI 分析结果 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                AI 分析结果
              </CardTitle>
              <CardDescription>
                基于您的需求，AI 推荐的技术方案
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!analysis ? (
                <div className="text-center text-muted-foreground py-8">
                  <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>点击"AI 分析需求"开始分析</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 技术栈 */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      推荐技术栈
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(analysis.tech_stack).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 uppercase">{key}</div>
                          <div className="font-medium">{value as string}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 功能特性 */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">主要功能</h3>
                    <ul className="space-y-1">
                      {analysis.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 项目信息 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs text-blue-600 uppercase">复杂度</div>
                      <div className="font-medium">{analysis.complexity}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs text-green-600 uppercase">预估时间</div>
                      <div className="font-medium">{analysis.estimated_time}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 功能说明 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            为什么选择 KidVibe？
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Wand2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI 驱动</h3>
              <p className="text-gray-600 text-sm">
                基于先进的 AI 模型，智能分析需求并生成代码
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">快速开发</h3>
              <p className="text-gray-600 text-sm">
                从需求到代码，大幅缩短开发周期
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">全栈支持</h3>
              <p className="text-gray-600 text-sm">
                前端、后端、数据库，一站式解决方案
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 