#!/bin/bash

# KidVibe 开发环境启动脚本

echo "🚀 启动 KidVibe 开发环境..."

# 检查 conda 环境
if ! conda info --envs | grep -q "py3.11"; then
    echo "❌ 未找到 py3.11 conda 环境，请先创建环境"
    exit 1
fi

# 激活 conda 环境
echo "📦 激活 conda 环境..."
conda activate py3.11

# 检查后端依赖
echo "🔧 检查后端依赖..."
cd backend
if [ ! -f "requirements.txt" ]; then
    echo "❌ 未找到 requirements.txt"
    exit 1
fi

# 安装后端依赖
echo "📥 安装后端依赖..."
pip install -r requirements.txt

# 创建环境变量文件
if [ ! -f ".env" ]; then
    echo "📝 创建环境变量文件..."
    cp env.example .env
    echo "⚠️  请编辑 .env 文件配置必要的环境变量"
fi

# 启动后端服务
echo "🔧 启动后端服务..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 检查前端依赖
echo "🔧 检查前端依赖..."
cd ../frontend
if [ ! -f "package.json" ]; then
    echo "❌ 未找到 package.json"
    exit 1
fi

# 安装前端依赖
echo "📥 安装前端依赖..."
npm install

# 启动前端服务
echo "🎨 启动前端服务..."
npm run dev &
FRONTEND_PID=$!

echo "✅ KidVibe 开发环境已启动！"
echo "📱 前端: http://localhost:3000"
echo "🔧 后端: http://localhost:8000"
echo "📚 API 文档: http://localhost:8000/docs"

# 等待用户中断
trap "echo '🛑 正在关闭服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 