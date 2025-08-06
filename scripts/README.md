# KidVibe 启动脚本使用说明

## 概述

KidVibe 项目提供了多个启动脚本，支持不同的部署方式和环境需求。

## 脚本列表

### 1. `start.sh` - 完整启动脚本

功能最全面的启动脚本，支持多种启动模式。

**用法：**
```bash
# 启动开发环境（默认）
./scripts/start.sh dev

# 启动生产环境
./scripts/start.sh prod

# 使用 Docker 启动
./scripts/start.sh docker

# 仅启动后端服务
./scripts/start.sh backend

# 仅启动前端服务
./scripts/start.sh frontend

# 安装所有依赖
./scripts/start.sh install

# 初始化项目环境
./scripts/start.sh setup

# 显示帮助信息
./scripts/start.sh help
```

**特性：**
- ✅ 彩色输出和状态提示
- ✅ 自动环境检查和依赖安装
- ✅ 支持多种启动模式
- ✅ 优雅的服务关闭
- ✅ 错误处理和回滚

### 2. `quick-start.sh` - 快速启动脚本

简化的一键启动脚本，适合快速开发。

**用法：**
```bash
./scripts/quick-start.sh
```

**特性：**
- ✅ 一键启动开发环境
- ✅ 自动创建 conda 环境
- ✅ 自动安装依赖
- ✅ 同时启动前后端服务

### 3. `start-dev.sh` - 开发环境脚本

原有的开发环境启动脚本。

**用法：**
```bash
./scripts/start-dev.sh
```

## 环境要求

### 系统要求
- macOS / Linux / Windows (WSL)
- Bash shell
- Git

### 必需工具
- **Conda**: Python 环境管理
- **Node.js**: 前端开发环境
- **npm**: 包管理器
- **Docker**: 容器化部署（可选）
- **Docker Compose**: 容器编排（可选）

### 安装必需工具

#### macOS
```bash
# 安装 Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Conda
brew install --cask anaconda

# 安装 Node.js
brew install node

# 安装 Docker
brew install --cask docker
```

#### Ubuntu/Debian
```bash
# 安装 Conda
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 Docker
sudo apt-get update
sudo apt-get install docker.io docker-compose
```

## 使用流程

### 首次使用

1. **克隆项目**
```bash
git clone <repository-url>
cd kidvibe
```

2. **初始化环境**
```bash
./scripts/start.sh setup
```

3. **配置环境变量**
```bash
# 编辑后端环境变量
nano backend/.env

# 编辑前端环境变量
nano frontend/.env.local
```

4. **启动开发环境**
```bash
./scripts/start.sh dev
```

### 日常开发

**快速启动：**
```bash
./scripts/quick-start.sh
```

**完整启动：**
```bash
./scripts/start.sh dev
```

**仅启动后端：**
```bash
./scripts/start.sh backend
```

**仅启动前端：**
```bash
./scripts/start.sh frontend
```

### 生产部署

**使用 Docker：**
```bash
./scripts/start.sh docker
```

**本地生产环境：**
```bash
./scripts/start.sh prod
```

## 环境变量配置

### 后端环境变量 (backend/.env)

```bash
# 数据库配置
DATABASE_URL=sqlite:///./kidvibe.db

# 安全配置
SECRET_KEY=your-secret-key-change-in-production

# AI 模型 API 密钥
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key

# Ollama 配置
OLLAMA_BASE_URL=http://localhost:11434

# 其他配置
DEBUG=True
LOG_LEVEL=INFO
```

### 前端环境变量 (frontend/.env.local)

```bash
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=KidVibe

# 其他配置
NEXT_PUBLIC_DEBUG=true
```

## 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端 | 3000 | Next.js 开发服务器 |
| 后端 | 8000 | FastAPI 应用服务器 |
| API 文档 | 8000/docs | Swagger UI 文档 |
| Ollama | 11434 | 本地 AI 模型服务 |
| Redis | 6379 | 缓存服务 |
| Nginx | 80/443 | 反向代理 |

## 故障排除

### 常见问题

1. **Conda 环境问题**
```bash
# 重新创建环境
conda remove -n py3.11 --all
conda create -n py3.11 python=3.11 -y
```

2. **端口被占用**
```bash
# 查看端口占用
lsof -i :3000
lsof -i :8000

# 杀死进程
kill -9 <PID>
```

3. **依赖安装失败**
```bash
# 清理缓存
npm cache clean --force
pip cache purge

# 重新安装
./scripts/start.sh install
```

4. **数据库迁移问题**
```bash
cd backend
alembic upgrade head
```

### 日志查看

**后端日志：**
```bash
tail -f backend/logs/app.log
```

**前端日志：**
```bash
# 在浏览器开发者工具中查看
```

**Docker 日志：**
```bash
docker-compose logs -f
```

## 性能优化

### 开发环境优化

1. **使用快速启动脚本**
```bash
./scripts/quick-start.sh
```

2. **仅启动需要的服务**
```bash
./scripts/start.sh backend  # 仅后端
./scripts/start.sh frontend # 仅前端
```

3. **使用 Docker 开发**
```bash
./scripts/start.sh docker
```

### 生产环境优化

1. **使用生产模式**
```bash
./scripts/start.sh prod
```

2. **Docker 部署**
```bash
./scripts/start.sh docker
```

3. **性能监控**
```bash
# 监控系统资源
htop
# 监控网络
iftop
```

## 安全注意事项

1. **环境变量安全**
   - 不要在代码中硬编码敏感信息
   - 使用环境变量管理密钥
   - 生产环境使用强密钥

2. **网络安全**
   - 使用 HTTPS 生产环境
   - 配置防火墙规则
   - 定期更新依赖

3. **数据安全**
   - 定期备份数据库
   - 加密敏感数据
   - 实施访问控制

## 贡献指南

### 添加新脚本

1. 在 `scripts/` 目录创建新脚本
2. 添加执行权限：`chmod +x scripts/new-script.sh`
3. 更新此文档
4. 提交 Pull Request

### 脚本规范

- 使用 Bash 语法
- 添加错误处理
- 提供帮助信息
- 使用彩色输出
- 支持优雅关闭

## 更新日志

### v1.0.0
- 初始版本
- 支持开发和生产环境
- 支持 Docker 部署
- 完整的错误处理

### v1.1.0
- 添加快速启动脚本
- 改进环境检查
- 优化用户体验
- 添加详细文档 