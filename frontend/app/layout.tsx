import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KidVibe - AI 驱动的 Web 应用构建平台',
  description: '通过自然语言描述和聊天交互来创建、改进和部署 Web 应用程序',
  keywords: ['AI', 'Web开发', '代码生成', '聊天编程'],
  authors: [{ name: 'KidVibe Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
} 