#!/bin/bash

# KidVibe Python 缓存清理脚本

echo "🧹 清理 Python 缓存文件..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# 检查是否在项目根目录
if [ ! -f "README.md" ]; then
    print_error "请在项目根目录运行此脚本"
    exit 1
fi

# 统计清理前的文件数量
print_info "统计清理前的 Python 缓存文件..."

PYCACHE_DIRS=$(find . -type d -name "__pycache__" 2>/dev/null | wc -l)
PYC_FILES=$(find . -name "*.pyc" 2>/dev/null | wc -l)
PYO_FILES=$(find . -name "*.pyo" 2>/dev/null | wc -l)

echo "发现:"
echo "  - __pycache__ 目录: $PYCACHE_DIRS 个"
echo "  - .pyc 文件: $PYC_FILES 个"
echo "  - .pyo 文件: $PYO_FILES 个"

if [ $PYCACHE_DIRS -eq 0 ] && [ $PYC_FILES -eq 0 ] && [ $PYO_FILES -eq 0 ]; then
    print_success "没有发现 Python 缓存文件，无需清理"
    exit 0
fi

# 确认清理
echo ""
read -p "是否继续清理这些文件？(y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "取消清理操作"
    exit 0
fi

# 清理 __pycache__ 目录
print_info "清理 __pycache__ 目录..."
if find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null; then
    print_success "已清理 __pycache__ 目录"
else
    print_error "清理 __pycache__ 目录时出错"
fi

# 清理 .pyc 文件
print_info "清理 .pyc 文件..."
if find . -name "*.pyc" -delete 2>/dev/null; then
    print_success "已清理 .pyc 文件"
else
    print_error "清理 .pyc 文件时出错"
fi

# 清理 .pyo 文件
print_info "清理 .pyo 文件..."
if find . -name "*.pyo" -delete 2>/dev/null; then
    print_success "已清理 .pyo 文件"
else
    print_error "清理 .pyo 文件时出错"
fi

# 清理 .py[cod] 文件
print_info "清理 .py[cod] 文件..."
if find . -name "*.pyc" -o -name "*.pyo" -o -name "*.pyd" | xargs rm -f 2>/dev/null; then
    print_success "已清理 .py[cod] 文件"
else
    print_error "清理 .py[cod] 文件时出错"
fi

# 验证清理结果
print_info "验证清理结果..."

REMAINING_PYCACHE=$(find . -type d -name "__pycache__" 2>/dev/null | wc -l)
REMAINING_PYC=$(find . -name "*.pyc" 2>/dev/null | wc -l)
REMAINING_PYO=$(find . -name "*.pyo" 2>/dev/null | wc -l)

if [ $REMAINING_PYCACHE -eq 0 ] && [ $REMAINING_PYC -eq 0 ] && [ $REMAINING_PYO -eq 0 ]; then
    print_success "Python 缓存文件清理完成！"
else
    print_warning "仍有部分文件未清理:"
    if [ $REMAINING_PYCACHE -gt 0 ]; then
        echo "  - __pycache__ 目录: $REMAINING_PYCACHE 个"
    fi
    if [ $REMAINING_PYC -gt 0 ]; then
        echo "  - .pyc 文件: $REMAINING_PYC 个"
    fi
    if [ $REMAINING_PYO -gt 0 ]; then
        echo "  - .pyo 文件: $REMAINING_PYO 个"
    fi
fi

# 显示清理统计
echo ""
echo "📊 清理统计:"
echo "  - 清理的 __pycache__ 目录: $PYCACHE_DIRS 个"
echo "  - 清理的 .pyc 文件: $PYC_FILES 个"
echo "  - 清理的 .pyo 文件: $PYO_FILES 个"

# 提示重新生成缓存（可选）
echo ""
print_info "提示: 如果需要重新生成 Python 缓存，可以运行:"
echo "  python -Bc \"import compileall; compileall.compile_dir('.', force=True)\""

print_success "清理操作完成！" 