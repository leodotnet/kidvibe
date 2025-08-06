#!/bin/bash

# KidVibe 启动脚本测试

echo "🧪 测试 KidVibe 启动脚本..."

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

# 检查脚本是否存在
run_test "检查启动脚本是否存在" "test -f scripts/start.sh"
run_test "检查快速启动脚本是否存在" "test -f scripts/quick-start.sh"
run_test "检查开发启动脚本是否存在" "test -f scripts/start-dev.sh"

# 检查脚本权限
run_test "检查启动脚本权限" "test -x scripts/start.sh"
run_test "检查快速启动脚本权限" "test -x scripts/quick-start.sh"
run_test "检查开发启动脚本权限" "test -x scripts/start-dev.sh"

# 检查项目结构
run_test "检查后端目录" "test -d backend"
run_test "检查前端目录" "test -d frontend"
run_test "检查后端 requirements.txt" "test -f backend/requirements.txt"
run_test "检查前端 package.json" "test -f frontend/package.json"

# 检查 Docker 配置
run_test "检查 Docker Compose 配置" "test -f docker-compose.yml"
run_test "检查后端 Dockerfile" "test -f backend/Dockerfile"
run_test "检查前端 Dockerfile" "test -f frontend/Dockerfile"

# 检查环境变量模板
run_test "检查后端环境变量模板" "test -f backend/env.example"

# 测试脚本帮助功能
run_test "测试启动脚本帮助" "scripts/start.sh help > /dev/null 2>&1"

# 检查必需工具
run_test "检查 conda 命令" "command -v conda > /dev/null"
run_test "检查 node 命令" "command -v node > /dev/null"
run_test "检查 npm 命令" "command -v npm > /dev/null"

# 检查 conda 环境
if conda info --envs | grep -q "py3.11"; then
    run_test "检查 conda 环境存在" "true"
else
    run_test "检查 conda 环境存在" "false"
fi

# 输出测试结果
echo "📊 测试结果汇总:"
echo -e "${GREEN}通过: $TESTS_PASSED${NC}"
echo -e "${RED}失败: $TESTS_FAILED${NC}"
echo -e "总计: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 所有测试通过！${NC}"
    exit 0
else
    echo -e "${RED}⚠️  有 $TESTS_FAILED 个测试失败${NC}"
    exit 1
fi 