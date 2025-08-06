#!/bin/bash

# KidVibe 服务启动脚本
# 支持开发环境、生产环境和 Docker 启动

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 显示帮助信息
show_help() {
    echo "KidVibe 服务启动脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  dev         启动开发环境 (默认)"
    echo "  prod        启动生产环境"
    echo "  docker      使用 Docker 启动"
    echo "  backend     仅启动后端服务"
    echo "  frontend    仅启动前端服务"
    echo "  install     安装所有依赖"
    echo "  setup       初始化项目环境"
    echo "  help        显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 dev       # 启动开发环境"
    echo "  $0 prod      # 启动生产环境"
    echo "  $0 docker    # 使用 Docker 启动"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 未安装，请先安装 $1"
        exit 1
    fi
}

# 检查 conda 环境
check_conda_env() {
    if ! conda info --envs | grep -q "py3.11"; then
        print_warning "未找到 py3.11 conda 环境，正在创建..."
        conda create -n py3.11 python=3.11 -y
    fi
    conda activate py3.11
}

# 安装后端依赖
install_backend_deps() {
    print_info "安装后端依赖..."
    cd backend
    
    if [ ! -f "requirements.txt" ]; then
        print_error "未找到 requirements.txt"
        exit 1
    fi
    
    pip install -r requirements.txt
    print_success "后端依赖安装完成"
    cd ..
}

# 安装前端依赖
install_frontend_deps() {
    print_info "安装前端依赖..."
    cd frontend
    
    if [ ! -f "package.json" ]; then
        print_error "未找到 package.json"
        exit 1
    fi
    
    npm install
    print_success "前端依赖安装完成"
    cd ..
}

# 初始化环境变量
setup_env() {
    print_info "初始化环境变量..."
    
    # 后端环境变量
    cd backend
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env
            print_warning "已创建 .env 文件，请编辑配置必要的环境变量"
        else
            print_warning "未找到 env.example，请手动创建 .env 文件"
        fi
    fi
    cd ..
    
    # 前端环境变量
    cd frontend
    if [ ! -f ".env.local" ]; then
        cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=KidVibe
EOF
        print_success "已创建前端环境变量文件"
    fi
    cd ..
}

# 启动后端服务
start_backend() {
    print_info "启动后端服务..."
    cd backend
    
    # 检查数据库迁移
    if command -v alembic &> /dev/null; then
        print_info "运行数据库迁移..."
        alembic upgrade head
    fi
    
    # 启动服务
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    print_success "后端服务已启动 (PID: $BACKEND_PID)"
    cd ..
}

# 启动前端服务
start_frontend() {
    print_info "启动前端服务..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    print_success "前端服务已启动 (PID: $FRONTEND_PID)"
    cd ..
}

# 启动开发环境
start_dev() {
    print_info "启动开发环境..."
    
    # 检查必要工具
    check_command "conda"
    check_command "node"
    check_command "npm"
    
    # 检查并激活 conda 环境
    check_conda_env
    
    # 安装依赖
    install_backend_deps
    install_frontend_deps
    
    # 设置环境变量
    setup_env
    
    # 启动服务
    start_backend
    
    # 等待后端启动
    sleep 3
    
    start_frontend
    
    print_success "开发环境启动完成！"
    echo ""
    echo "📱 前端: http://localhost:3000"
    echo "🔧 后端: http://localhost:8000"
    echo "📚 API 文档: http://localhost:8000/docs"
    echo ""
    echo "按 Ctrl+C 停止服务"
    
    # 等待用户中断
    trap "cleanup" INT
    wait
}

# 启动生产环境
start_prod() {
    print_info "启动生产环境..."
    
    # 检查必要工具
    check_command "conda"
    check_command "node"
    check_command "npm"
    
    # 检查并激活 conda 环境
    check_conda_env
    
    # 构建前端
    print_info "构建前端..."
    cd frontend
    npm run build
    cd ..
    
    # 启动后端
    start_backend
    
    # 启动前端生产服务
    print_info "启动前端生产服务..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    print_success "前端生产服务已启动 (PID: $FRONTEND_PID)"
    cd ..
    
    print_success "生产环境启动完成！"
    echo ""
    echo "📱 前端: http://localhost:3000"
    echo "🔧 后端: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务"
    
    # 等待用户中断
    trap "cleanup" INT
    wait
}

# 使用 Docker 启动
start_docker() {
    print_info "使用 Docker 启动..."
    
    check_command "docker"
    check_command "docker-compose"
    
    if [ ! -f "docker-compose.yml" ]; then
        print_error "未找到 docker-compose.yml 文件"
        exit 1
    fi
    
    docker-compose up -d
    
    print_success "Docker 服务启动完成！"
    echo ""
    echo "📱 前端: http://localhost:3000"
    echo "🔧 后端: http://localhost:8000"
    echo ""
    echo "使用 'docker-compose down' 停止服务"
}

# 清理函数
cleanup() {
    print_info "正在关闭服务..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    print_success "服务已关闭"
    exit 0
}

# 安装所有依赖
install_all() {
    print_info "安装所有依赖..."
    
    check_conda_env
    install_backend_deps
    install_frontend_deps
    
    print_success "所有依赖安装完成"
}

# 初始化项目环境
setup_project() {
    print_info "初始化项目环境..."
    
    # 检查必要工具
    check_command "conda"
    check_command "node"
    check_command "npm"
    check_command "git"
    
    # 创建 conda 环境
    check_conda_env
    
    # 安装依赖
    install_all
    
    # 设置环境变量
    setup_env
    
    # 初始化数据库
    cd backend
    if command -v alembic &> /dev/null; then
        print_info "初始化数据库..."
        alembic upgrade head
    fi
    cd ..
    
    print_success "项目环境初始化完成！"
}

# 主函数
main() {
    case "${1:-dev}" in
        "dev")
            start_dev
            ;;
        "prod")
            start_prod
            ;;
        "docker")
            start_docker
            ;;
        "backend")
            check_conda_env
            install_backend_deps
            setup_env
            start_backend
            print_success "后端服务已启动！"
            echo "🔧 后端: http://localhost:8000"
            echo "📚 API 文档: http://localhost:8000/docs"
            trap "cleanup" INT
            wait
            ;;
        "frontend")
            install_frontend_deps
            setup_env
            start_frontend
            print_success "前端服务已启动！"
            echo "📱 前端: http://localhost:3000"
            trap "cleanup" INT
            wait
            ;;
        "install")
            install_all
            ;;
        "setup")
            setup_project
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@" 