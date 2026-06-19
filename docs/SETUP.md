# 部署指南 / Setup Guide

## 目录 / Table of Contents

1. [系统要求 / System Requirements](#系统要求)
2. [后端部署 / Backend Deployment](#后端部署)
3. [小程序配置 / Mini-app Configuration](#小程序配置)
4. [爬虫配置 / Scraper Configuration](#爬虫配置)
5. [测试 / Testing](#测试)

---

## 系统要求 / System Requirements

### 电脑要求 / Computer Requirements
- Python 3.8+
- Node.js 14+ (用于微信开发者工具)
- Chrome 浏览器 (用于爬虫)

### 账号要求 / Account Requirements
- 微信开发者账号 (申请微信小程序)
- 数字心动账号 (用于爬取数据)
- 微信云开发账号 (可选，用于云数据库)

---

## 后端部署 / Backend Deployment

### 第一步：安装依赖 / Step 1: Install Dependencies

```bash
# 进入后端目录 / Enter backend directory
cd backend

# 创建虚拟环境 / Create virtual environment
python -m venv venv

# 激活虚拟环境 / Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 安装依赖 / Install dependencies
pip install -r requirements.txt
```

### 第二步：配置环境变量 / Step 2: Configure Environment Variables

创建 `.env` 文件在 `backend` 目录下：

```bash
# backend/.env

# 数字心动账号信息（可选，也可以通过API提供）
# DIGITAL_ZHIXIN_USERNAME=your_username
# DIGITAL_ZHIXIN_PASSWORD=your_password

# Flask配置
FLASK_ENV=development
FLASK_DEBUG=True
```

### 第三步：下载 chromedriver / Step 3: Download ChromeDriver

爬虫使用 Selenium 需要 chromedriver：

1. 访问 [ChromeDriver 官网](https://chromedriver.chromium.org/)
2. 下载与你的 Chrome 浏览器版本相同的 chromedriver
3. 将 chromedriver 放在 `backend` 目录或 PATH 中

### 第四步：启动后端服务 / Step 4: Start Backend Service

```bash
# 确保在 backend 目录下且虚拟环境已激活
python app.py
```

你会看到类似的输出：
```
 * Running on http://0.0.0.0:5000
```

---

## 小程序配置 / Mini-app Configuration

### 第一步：申请微信小程序 / Step 1: Register WeChat Mini-app

1. 访问 [微信公众平台](https://mp.weixin.qq.com)
2. 注册账号并申请小程序
3. 获取 AppID 和 AppSecret

### 第二步：下载微信开发者工具 / Step 2: Download WeChat Developer Tools

访问 [微信开发者工具官网](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 下载安装。

### 第三步：导入项目 / Step 3: Import Project

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择 `miniprogram` 文件夹
4. 输入你的 AppID
5. 点击"导入"

### 第四步：配置API地址 / Step 4: Configure API URL

编辑 `miniprogram/app.js`，修改 `apiBaseUrl`：

```javascript
// 开发环境
globalData: {
  apiBaseUrl: 'http://localhost:5000/api'  // 本地测试
  // apiBaseUrl: 'https://your-server.com/api'  // 生产环境
}
```

### 第五步：配置合法域名 / Step 5: Configure Valid Domains

在微信小程序后台配置合法域名：
- 小程序管理后台 → 开发 → 开发设置 → 服务器域名
- 添加你的后端服务器域名

---

## 爬虫配置 / Scraper Configuration

### 确认数字心动网站结构 / Verify Digital Zhixin Website Structure

爬虫需要根据实际网站结构调整选择器。请按照以下步骤：

1. 在浏览器中打开数字心动平台
2. 打开开发者工具 (F12)
3. 检查网页元素结构
4. 更新 `scraper.py` 中的选择器

### 爬虫工作流程 / Scraper Workflow

```
1. 用户输入用户名和密码 → 小程序
2. 小程序发送到后端 API → /api/scrape
3. 后端启动 Selenium + Chrome
4. 自动化登录数字心动
5. 爬取统计数据、马拉松记录、跑步记录
6. 解析 HTML 提取数据
7. 保存到数据库
8. 返回给小程序
```

---

## 测试 / Testing

### 测试后端API / Test Backend API

```bash
# 测试健康检查 / Test health check
curl http://localhost:5000/api/health

# 测试爬虫 / Test scraper (replace with actual credentials)
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"username": "test_user", "password": "test_password"}'

# 获取用户统计 / Get user stats
curl http://localhost:5000/api/stats/test_user

# 获取城市列表 / Get cities list
curl http://localhost:5000/api/cities/test_user
```

### 测试小程序 / Test Mini-app

1. 在微信开发者工具中点击"编译"
2. 等待编译完成
3. 在模拟器中测试各个页面
4. 确保可以成功调用后端API

---

## 生产部署 / Production Deployment

### 后端部署到云服务器 / Deploy Backend to Cloud Server

推荐使用：
- Heroku (免费，但可能不稳定)
- DigitalOcean
- Aliyun (阿里云)
- Tencent Cloud (腾讯云)

示例 (Heroku)：

```bash
# 创建 Procfile
echo "web: gunicorn app:app" > Procfile

# 部署到 Heroku
heroku create your-app-name
git push heroku main
```

### 小程序发布 / Publish Mini-app

1. 在微信开发者工具中点击"上传"
2. 输入版本号和备注
3. 在微信小程序后台审核并发布

---

## 常见问题 / FAQ

### Q: 爬虫无法登录？
A: 检查数字心动网站是否有登录页面变化，更新选择器

### Q: 小程序无法连接后端？
A: 检查后端服务是否运行，检查防火墙设置

### Q: 如何更新数据？
A: 重新在导入页面输入账号密码，或定期自动运行爬虫

---

## 获取帮助 / Get Help

遇到问题？
1. 检查错误日志
2. 搜索相关 GitHub issues
3. 提交新的 issue

