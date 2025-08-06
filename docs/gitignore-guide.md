# KidVibe .gitignore 使用指南

## 概述

KidVibe 项目提供了两个版本的 `.gitignore` 文件：

1. **`.gitignore`** - 完整版本，包含所有可能的忽略规则
2. **`.gitignore.simple`** - 简化版本，只包含核心忽略规则

## 文件说明

### 完整版 .gitignore

**适用场景：**
- 大型团队项目
- 需要严格的文件管理
- 多平台开发环境
- 复杂的部署流程

**包含内容：**
- ✅ 系统文件（macOS、Windows、Linux）
- ✅ 编辑器文件（VSCode、IntelliJ、Vim、Emacs）
- ✅ 开发工具（Git、Docker、云服务）
- ✅ 安全相关（密钥、证书、密码文件）
- ✅ 性能监控和调试文件
- ✅ 测试和文档生成文件
- ✅ 备份和归档文件

### 简化版 .gitignore.simple

**适用场景：**
- 小型团队或个人项目
- 快速开发环境
- 简单的部署流程
- 专注于核心功能

**包含内容：**
- ✅ 核心系统文件
- ✅ 主要编辑器文件
- ✅ Python 和 Node.js 基础忽略
- ✅ 数据库和环境变量文件
- ✅ 构建和部署文件
- ✅ 项目特定文件

## 使用方法

### 选择版本

**使用完整版（推荐）：**
```bash
# 确保使用完整版
cp .gitignore .gitignore.backup
```

**使用简化版：**
```bash
# 替换为简化版
cp .gitignore.simple .gitignore
```

### 自定义配置

如果需要添加项目特定的忽略规则，可以在 `.gitignore` 文件末尾添加：

```bash
# ===== 项目特定规则 =====
# 自定义忽略规则
my-custom-file.txt
custom-directory/
```

## 重要文件说明

### Python 缓存文件

**忽略的文件：**
```
__pycache__/
*/__pycache__/
**/__pycache__/
*.py[cod]
*$py.class
*.pyc
```

**说明：**
- `__pycache__/` - 根目录的 Python 缓存
- `*/__pycache__/` - 一级子目录的 Python 缓存
- `**/__pycache__/` - 所有层级的 Python 缓存
- `*.pyc` - Python 编译文件
- `*.py[cod]` - Python 编译文件（兼容性）

**原因：**
- Python 缓存文件是自动生成的
- 不同 Python 版本可能生成不同的缓存
- 缓存文件较大，影响仓库大小
- 可以通过重新运行 Python 代码重新生成

### 环境变量文件

**忽略的文件：**
```
.env
.env.local
.env.development
.env.test
.env.production
```

**保留的文件：**
```
env.example
.env.template
```

### 数据库文件

**忽略的文件：**
```
*.db
*.sqlite
*.sqlite3
backend/kidvibe.db*
```

**原因：**
- 数据库文件通常包含敏感数据
- 文件较大，不适合版本控制
- 每个环境应该有独立的数据库

### 构建文件

**忽略的文件：**
```
dist/
build/
.next/
out/
```

**原因：**
- 构建文件可以重新生成
- 文件较大，影响仓库大小
- 不同环境需要不同的构建产物

### 依赖文件

**忽略的文件：**
```
node_modules/
__pycache__/
*.egg-info/
```

**原因：**
- 可以通过包管理器重新安装
- 文件数量庞大
- 不同平台可能有差异

## 常见问题

### 1. 文件仍然被跟踪

**问题：** 添加 `.gitignore` 规则后，文件仍然被 Git 跟踪。

**解决方案：**
```bash
# 从 Git 缓存中移除文件
git rm --cached <file-name>

# 移除整个目录
git rm -r --cached <directory-name>

# 提交更改
git add .gitignore
git commit -m "更新 .gitignore"
```

### 2. 需要保留被忽略的文件

**问题：** 某些被忽略的文件需要保留在仓库中。

**解决方案：**
```bash
# 在 .gitignore 中添加例外规则
!important-file.txt
!important-directory/
```

### 3. 不同环境的环境变量

**问题：** 不同环境需要不同的环境变量配置。

**解决方案：**
```bash
# 创建环境特定的模板文件
cp .env.example .env.local
cp .env.example .env.development
cp .env.example .env.production

# 在 .gitignore 中忽略实际的环境变量文件
.env.local
.env.development
.env.production
```

### 4. Python 缓存文件清理

**问题：** 如何清理所有 Python 缓存文件。

**解决方案：**
```bash
# 查找所有 Python 缓存文件
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -name "*.pyc" -delete

# 或者使用 Python 命令
python -Bc "import compileall; compileall.compile_dir('.', force=True)"
```

## 最佳实践

### 1. 定期更新

- 定期检查是否有新的文件类型需要忽略
- 更新依赖包后检查是否需要新的忽略规则
- 添加新工具时更新相应的忽略规则

### 2. 团队协作

- 在团队中统一使用相同的 `.gitignore` 文件
- 在项目文档中说明忽略规则的原因
- 定期审查忽略规则的必要性

### 3. 安全考虑

- 确保敏感信息不会被意外提交
- 定期检查是否有敏感文件被跟踪
- 使用环境变量管理敏感配置

### 4. 性能优化

- 避免忽略不必要的文件类型
- 定期清理大型文件
- 使用 `.gitignore` 而不是手动删除文件

### 5. Python 项目特定

- 定期清理 `__pycache__` 目录
- 使用虚拟环境避免全局 Python 缓存
- 在 CI/CD 中忽略 Python 缓存文件

## 检查工具

### 检查被忽略的文件

```bash
# 查看被忽略的文件
git status --ignored

# 查看特定文件的忽略状态
git check-ignore <file-name>

# 查看 Python 缓存文件
find . -name "__pycache__" -type d
find . -name "*.pyc" -type f
```

### 检查仓库大小

```bash
# 查看仓库大小
git count-objects -vH

# 查看最大的文件
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sed -n 's/^blob //p' | sort -nr -k 2 | head -10
```

## 更新日志

### v1.0.0
- 初始版本
- 包含完整版和简化版
- 涵盖 Python 和 Node.js 项目
- 包含安全相关规则

### v1.1.0
- 添加项目特定规则
- 改进 AI 模型文件忽略
- 优化性能监控规则
- 添加详细使用说明

### v1.2.0
- 增强 Python 缓存文件忽略规则
- 添加子目录 `__pycache__` 忽略
- 添加 `*.pyc` 文件忽略
- 更新测试脚本和文档

## 贡献指南

### 添加新规则

1. 确定规则的必要性
2. 在适当的分组中添加规则
3. 添加注释说明原因
4. 更新此文档
5. 提交 Pull Request

### 规则规范

- 使用清晰的分组和注释
- 按字母顺序排列规则
- 使用通配符而不是具体文件名
- 考虑跨平台兼容性

## 相关链接

- [Git 官方 .gitignore 模板](https://github.com/github/gitignore)
- [Python .gitignore 最佳实践](https://docs.python-guide.org/writing/gitignore/)
- [Node.js .gitignore 指南](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/) 