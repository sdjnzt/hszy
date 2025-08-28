# 华颂置业智慧社区平台 - GitHub Pages 部署指南

## 部署前准备

### 1. 修改 package.json 中的 homepage
将 `package.json` 中的 `homepage` 字段修改为您的GitHub Pages地址：
```json
"homepage": "https://[YOUR_GITHUB_USERNAME].github.io/[YOUR_REPO_NAME]"
```

例如：
```json
"homepage": "https://john-doe.github.io/huasong-smart-community"
```

### 2. 安装 gh-pages 依赖
```bash
npm install --save-dev gh-pages
```

## 部署步骤

### 方法1：使用 GitHub Actions（推荐）

1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "准备部署到GitHub Pages"
   git push origin main
   ```

2. **启用GitHub Pages**
   - 进入GitHub仓库设置
   - 找到 "Pages" 选项
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "gh-pages" 分支
   - 点击 "Save"

3. **自动部署**
   - 每次推送到 `main` 分支时，GitHub Actions 会自动构建并部署
   - 部署完成后，您的应用将在 `https://[USERNAME].github.io/[REPO-NAME]` 上运行

### 方法2：手动部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **部署到GitHub Pages**
   ```bash
   npm run deploy
   ```

## 重要配置说明

### 路由配置
- 已将 `HashRouter` 改为 `BrowserRouter` 以支持GitHub Pages
- 创建了 `404.html` 页面以处理SPA路由

### 构建配置
- 添加了 `predeploy` 和 `deploy` 脚本
- 配置了GitHub Actions工作流

## 常见问题解决

### 1. 页面刷新404错误
- 确保 `404.html` 文件已正确创建
- 检查GitHub Pages设置是否正确

### 2. 资源路径错误
- 确保 `homepage` 字段设置正确
- 检查构建后的文件路径

### 3. 部署失败
- 检查GitHub Actions日志
- 确保仓库有正确的权限设置

## 访问地址

部署成功后，您的应用将在以下地址运行：
```
https://[YOUR_GITHUB_USERNAME].github.io/[YOUR_REPO_NAME]
```

## 更新部署

每次更新代码后，只需推送到 `main` 分支，GitHub Actions 会自动重新部署。 