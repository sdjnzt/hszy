@echo off
echo 开始部署到GitHub Pages...

echo 1. 构建项目...
call npm run build

echo 2. 检查构建结果...
if not exist "build" (
    echo 构建失败！请检查错误信息
    pause
    exit /b 1
)

echo 3. 创建gh-pages分支...
git checkout --orphan gh-pages

echo 4. 删除所有文件...
git rm -rf .

echo 5. 复制构建文件...
xcopy "build\*" "." /E /I /Y

echo 6. 添加所有文件...
git add .

echo 7. 提交更改...
git commit -m "Deploy to GitHub Pages"

echo 8. 推送到远程gh-pages分支...
git push origin gh-pages --force

echo 9. 切换回main分支...
git checkout main

echo 部署完成！
echo 请确保在GitHub仓库设置中启用了GitHub Pages，并选择gh-pages分支作为源。
echo 等待几分钟让部署生效。
pause
