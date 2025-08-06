#!/bin/bash

# KidVibe 快速启动脚本
# 一键启动开发环境

echo "🚀 KidVibe 快速启动..."

# 检查是否在项目根目录
if [ ! -f "README.md" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 检查 conda 环境
if ! conda info --envs | grep -q "py3.11"; then
    echo "📦 创建 conda 环境..."
    conda create -n py3.11 python=3.11 -y
fi

# 激活环境
echo "🔧 激活 conda 环境..."
conda activate py3.11

# 启动后端
echo "🔧 启动后端服务..."
cd backend
if [ ! -f ".env" ] && [ -f "env.example" ]; then
    cp env.example .env
    echo "⚠️  请编辑 backend/.env 文件配置环境变量"
fi

# 安装后端依赖
pip install -r requirements.txt

# 启动后端
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ..

# 等待后端启动
sleep 3

# 启动前端
echo "🎨 启动前端服务..."
cd frontend

# 安装前端依赖
npm install

# 启动前端
npm run dev &
FRONTEND_PID=$!

cd ..

echo "✅ KidVibe 启动完成！"
echo ""
echo "📱 前端: http://localhost:3000"
echo "🔧 后端: http://localhost:8000"
echo "📚 API 文档: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
trap "echo '🛑 正在关闭服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait 