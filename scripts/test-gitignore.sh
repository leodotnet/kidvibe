#!/bin/bash

# KidVibe .gitignore 测试脚本

echo "🧪 测试 .gitignore 文件..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 测试结果
TESTS_PASSED=0
TESTS_FAILED=0

# 测试函数
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "${BLUE}测试: $test_name${NC}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 通过${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ 失败${NC}"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# 检查 .gitignore 文件是否存在
run_test "检查 .gitignore 文件是否存在" "test -f .gitignore"
run_test "检查 .gitignore.simple 文件是否存在" "test -f .gitignore.simple"

# 检查应该被忽略的文件
run_test "检查 Python 缓存文件被忽略" "git check-ignore backend/app/__pycache__/ > /dev/null 2>&1"
run_test "检查子目录 Python 缓存文件被忽略" "git check-ignore backend/app/api/__pycache__/ > /dev/null 2>&1"
run_test "检查深层子目录 Python 缓存文件被忽略" "git check-ignore backend/app/api/v1/__pycache__/ > /dev/null 2>&1"
run_test "检查 Python 编译文件被忽略" "git check-ignore backend/app/main.pyc > /dev/null 2>&1"
run_test "检查数据库文件被忽略" "git check-ignore backend/kidvibe.db > /dev/null 2>&1"
run_test "检查环境变量文件被忽略" "git check-ignore backend/.env > /dev/null 2>&1"
run_test "检查 Node.js 依赖被忽略" "git check-ignore frontend/node_modules/ > /dev/null 2>&1"
run_test "检查 Next.js 构建文件被忽略" "git check-ignore frontend/.next/ > /dev/null 2>&1"

# 检查系统文件被忽略
run_test "检查 macOS 系统文件被忽略" "git check-ignore .DS_Store > /dev/null 2>&1"
run_test "检查 Windows 系统文件被忽略" "git check-ignore Thumbs.db > /dev/null 2>&1"

# 检查编辑器文件被忽略
run_test "检查 VSCode 文件被忽略" "git check-ignore .vscode/ > /dev/null 2>&1"
run_test "检查 IntelliJ 文件被忽略" "git check-ignore .idea/ > /dev/null 2>&1"

# 检查日志文件被忽略
run_test "检查日志文件被忽略" "git check-ignore *.log > /dev/null 2>&1"

# 检查临时文件被忽略
run_test "检查临时文件被忽略" "git check-ignore *.tmp > /dev/null 2>&1"
run_test "检查备份文件被忽略" "git check-ignore *.bak > /dev/null 2>&1"

# 检查密钥文件被忽略
run_test "检查密钥文件被忽略" "git check-ignore *.key > /dev/null 2>&1"
run_test "检查证书文件被忽略" "git check-ignore *.pem > /dev/null 2>&1"

# 检查构建文件被忽略
run_test "检查构建目录被忽略" "git check-ignore dist/ > /dev/null 2>&1"
run_test "检查构建目录被忽略" "git check-ignore build/ > /dev/null 2>&1"

# 检查压缩文件被忽略
run_test "检查压缩文件被忽略" "git check-ignore *.zip > /dev/null 2>&1"
run_test "检查压缩文件被忽略" "git check-ignore *.tar.gz > /dev/null 2>&1"

# 检查 AI 模型文件被忽略
run_test "检查 AI 模型文件被忽略" "git check-ignore *.bin > /dev/null 2>&1"
run_test "检查 AI 模型文件被忽略" "git check-ignore *.gguf > /dev/null 2>&1"

# 检查项目特定文件被忽略
run_test "检查项目特定目录被忽略" "git check-ignore models/ > /dev/null 2>&1"
run_test "检查项目特定目录被忽略" "git check-ignore cache/ > /dev/null 2>&1"
run_test "检查项目特定目录被忽略" "git check-ignore tmp/ > /dev/null 2>&1"

# 检查应该保留的文件
run_test "检查 README 文件不被忽略" "! git check-ignore README.md > /dev/null 2>&1"
run_test "检查 package.json 文件不被忽略" "! git check-ignore frontend/package.json > /dev/null 2>&1"
run_test "检查 requirements.txt 文件不被忽略" "! git check-ignore backend/requirements.txt > /dev/null 2>&1"

# 输出测试结果
echo "📊 测试结果汇总:"
echo -e "${GREEN}通过: $TESTS_PASSED${NC}"
echo -e "${RED}失败: $TESTS_FAILED${NC}"
echo -e "总计: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 所有测试通过！.gitignore 文件工作正常${NC}"
    exit 0
else
    echo -e "${RED}⚠️  有 $TESTS_FAILED 个测试失败，请检查 .gitignore 配置${NC}"
    exit 1
fi 