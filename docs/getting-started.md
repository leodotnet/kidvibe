# KidVibe 项目启动指南

## 环境要求

### 系统要求
- macOS / Linux / Windows
- Python 3.11+
- Node.js 18+
- Git

### 必需软件
- Conda (推荐) 或 Python 虚拟环境
- npm 或 yarn
- Docker (可选，用于生产环境)

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd kidvibe
```

### 2. 设置 Python 环境
```bash
# 创建 conda 环境
conda create -n py3.11 python=3.11
conda activate py3.11

# 或者使用 Python 虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/macOS
# 或
venv\Scripts\activate  # Windows
```

### 3. 后端设置
```bash
cd backend

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp env.example .env
# 编辑 .env 文件，配置必要的环境变量

# 初始化数据库
python -c "from app.database import init_db; init_db()"

# 启动后端服务
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. 前端设置
```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 5. 使用启动脚本 (推荐)
```bash
# 给脚本执行权限
chmod +x scripts/start-dev.sh

# 启动开发环境
./scripts/start-dev.sh
```

## 环境变量配置

### 后端环境变量 (.env)
```bash
# 应用配置
DEBUG=true
SECRET_KEY=your-secret-key-here-change-in-production

# 数据库配置
DATABASE_URL=sqlite:///./kidvibe.db

# CORS 配置
CORS_ORIGINS=["http://localhost:3000"]

# AI 模型配置 (可选)
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
OLLAMA_BASE_URL=http://localhost:11434

# Redis 配置 (可选)
REDIS_URL=redis://localhost:6379

# 文件存储配置
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# 日志配置
LOG_LEVEL=INFO
```

### 前端环境变量 (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=KidVibe
```

## 访问应用

启动成功后，可以通过以下地址访问：

- **前端应用**: http://localhost:3000
- **后端 API**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/health

## 开发工具

### 代码格式化
```bash
# 后端
cd backend
black .
isort .

# 前端
cd frontend
npm run format
```

### 代码检查
```bash
# 后端
cd backend
flake8 .
mypy .

# 前端
cd frontend
npm run lint
npm run type-check
```

### 测试
```bash
# 后端
cd backend
pytest

# 前端
cd frontend
npm test
```

## 数据库管理

### 使用 SQLite (开发环境)
```bash
cd backend
# 数据库文件会自动创建在 kidvibe.db
```

### 使用 PostgreSQL (生产环境)
```bash
# 安装 PostgreSQL
# 创建数据库
createdb kidvibe

# 更新环境变量
DATABASE_URL=postgresql://username:password@localhost:5432/kidvibe
```

## Docker 部署

### 开发环境
```bash
cd docker
docker-compose up -d
```

### 生产环境
```bash
# 构建镜像
docker-compose -f docker-compose.prod.yml build

# 启动服务
docker-compose -f docker-compose.prod.yml up -d
```

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查找占用端口的进程
   lsof -i :8000
   lsof -i :3000
   
   # 杀死进程
   kill -9 <PID>
   ```

2. **依赖安装失败**
   ```bash
   # 清理缓存
   pip cache purge
   npm cache clean --force
   
   # 重新安装
   pip install -r requirements.txt
   npm install
   ```

3. **数据库连接错误**
   ```bash
   # 检查数据库文件权限
   ls -la kidvibe.db
   
   # 重新初始化数据库
   python -c "from app.database import init_db; init_db()"
   ```

### 日志查看
```bash
# 后端日志
tail -f backend/logs/app.log

# 前端日志
# 在浏览器开发者工具中查看
```

## 下一步

1. 阅读 [API 文档](http://localhost:8000/docs)
2. 查看 [项目架构文档](architecture.md)
3. 了解 [开发规范](development-guidelines.md)
4. 参与 [贡献指南](contributing.md)

## 获取帮助

- 查看 [常见问题](faq.md)
- 提交 [Issue](../../issues)
- 加入 [讨论区](../../discussions) 