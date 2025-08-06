// 聊天消息类型
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    codeChanges?: CodeChange[]
    suggestions?: string[]
    errors?: string[]
  }
}

// 聊天会话
export interface ChatSession {
  id: string
  projectId: string
  messages: ChatMessage[]
  context: ProjectContext
  createdAt: Date
  updatedAt: Date
}

// 项目信息
export interface Project {
  id: string
  name: string
  description: string
  initialPrompt: string
  techStack: TechStack
  status: 'building' | 'ready' | 'error'
  createdAt: Date
  updatedAt: Date
}

// 技术栈配置
export interface TechStack {
  frontend: 'nextjs' | 'react' | 'vue' | 'angular'
  backend: 'fastapi' | 'express' | 'django' | 'flask'
  database: 'sqlite' | 'postgresql' | 'mongodb'
  styling: 'tailwind' | 'bootstrap' | 'material-ui'
}

// 代码变更
export interface CodeChange {
  filePath: string
  changeType: 'add' | 'modify' | 'delete'
  content: string
  lineStart?: number
  lineEnd?: number
}

// 项目上下文
export interface ProjectContext {
  currentFile?: string
  selectedCode?: string
  cursorPosition?: {
    line: number
    column: number
  }
  projectStructure?: ProjectStructure
}

// 项目结构
export interface ProjectStructure {
  files: ProjectFile[]
  directories: ProjectDirectory[]
}

// 项目文件
export interface ProjectFile {
  path: string
  name: string
  type: 'file'
  content?: string
  language?: string
}

// 项目目录
export interface ProjectDirectory {
  path: string
  name: string
  type: 'directory'
  children: (ProjectFile | ProjectDirectory)[]
}

// 用户信息
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 文件树节点
export interface FileTreeNode {
  id: string
  name: string
  type: 'file' | 'directory'
  path: string
  children?: FileTreeNode[]
  isOpen?: boolean
  isSelected?: boolean
}

// 编辑器配置
export interface EditorConfig {
  theme: 'vs-dark' | 'vs-light'
  language: string
  fontSize: number
  wordWrap: 'on' | 'off'
  minimap: boolean
}

// 预览配置
export interface PreviewConfig {
  device: 'desktop' | 'tablet' | 'mobile'
  width: number
  height: number
  scale: number
} 