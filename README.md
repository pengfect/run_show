# Run Show - 跑步爱好者信息展示平台

一个微信小程序，用于展示跑步爱好者的跑步信息。

## 功能特性 / Features

- 📊 跑步数据统计（总里程、城市数、马拉松场次、ITRA积分、全马PB）
- 🗺️ 地图展示跑过的城市
- 🔄 自动从数字心动平台抓取数据
- ☁️ 微信小程序云开发（免费）

## 快速开始 / Quick Start

### 1. 后端设置 / Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 2. 小程序开发 / Mini-app Development
```bash
cd miniprogram
# 用微信开发者工具打开此文件夹
```

## 项目结构 / Project Structure

```
run_show/
├── backend/          # Python后端爬虫 + API
├── miniprogram/      # 微信小程序代码
└── docs/             # 文档
```

## 详细文档 / Documentation

- [部署指南 / Setup Guide](./docs/SETUP.md)
- [API文档 / API Docs](./docs/API.md)

## 技术栈 / Tech Stack

- **后端**: Python + Flask
- **爬虫**: Selenium (浏览器自动化)
- **小程序**: WeChat Mini-app
- **地图**: Tencent Map SDK
- **数据库**: WeChat Cloud DB

## 注意事项 / Important Notes

⚠️ 请确保遵守数字心动平台的服务条款
⚠️ 此爬虫仅供个人使用
