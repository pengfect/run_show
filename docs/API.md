# API 文档 / API Documentation

## 基础信息 / Base Information

**基础URL / Base URL:** `http://localhost:5000/api`

所有响应都是 JSON 格式。
All responses are in JSON format.

---

## 接口列表 / API Endpoints

### 1. 健康检查 / Health Check

```
GET /health
```

**响应 / Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00"
}
```

---

### 2. 爬取数据 / Scrape Data

从数字心动平台爬取用户数据。
Scrape user data from Digital Zhixin platform.

```
POST /scrape
```

**请求体 / Request Body:**
```json
{
  "username": "your_digital_zhixin_username",
  "password": "your_password"
}
```

**成功响应 / Success Response (200):**
```json
{
  "success": true,
  "message": "数据爬取成功 / Data scraped successfully",
  "data": {
    "stats": {
      "total_distance": 1234.5,
      "total_runs": 156,
      "cities": 24,
      "marathons": 5,
      "marathon_pb": 10800,
      "itra_score": 45
    },
    "marathons": [
      {
        "name": "北京马拉松",
        "date": "2023-10-01",
        "time": 10800,
        "pace": "5:11"
      }
    ],
    "runs": [...]
  }
}
```

**失败响应 / Failure Response (401):**
```json
{
  "success": false,
  "message": "爬取失败，请检查账号密码 / Login failed, please check credentials"
}
```

---

### 3. 获取用户统计 / Get User Statistics

获取已保存用户的统计信息。
Get statistics for a saved user.

```
GET /stats/<username>
```

**参数 / Parameters:**
- `username` (string, required): 用户名 / Username

**成功响应 / Success Response (200):**
```json
{
  "success": true,
  "data": {
    "username": "test_user",
    "data": {
      "stats": {
        "total_distance": 1234.5,
        "total_runs": 156,
        "cities": 24,
        "marathons": 5,
        "marathon_pb": 10800,
        "itra_score": 45
      }
    },
    "last_updated": "2024-01-01T12:00:00"
  }
}
```

**失败响应 / Failure Response (404):**
```json
{
  "success": false,
  "message": "用户不存在 / User not found"
}
```

---

### 4. 获取跑步记录 / Get Running Records

获取用户的所有跑步记录。
Get all running records for a user.

```
GET /runs/<username>
```

**参数 / Parameters:**
- `username` (string, required): 用户名 / Username

**成功响应 / Success Response (200):**
```json
{
  "success": true,
  "count": 156,
  "data": [
    {
      "date": "2024-01-01",
      "distance": 10.5,
      "time": 3600,
      "pace": "5:43",
      "city": "北京",
      "latitude": 39.904,
      "longitude": 116.407
    },
    ...
  ]
}
```

---

### 5. 获取城市列表 / Get Cities List

获取用户跑过的所有城市及其坐标。
Get all cities visited by the user with coordinates.

```
GET /cities/<username>
```

**参数 / Parameters:**
- `username` (string, required): 用户名 / Username

**成功响应 / Success Response (200):**
```json
{
  "success": true,
  "count": 24,
  "data": [
    {
      "name": "北京",
      "latitude": 39.904,
      "longitude": 116.407,
      "runs_count": 45
    },
    {
      "name": "上海",
      "latitude": 31.230,
      "longitude": 121.473,
      "runs_count": 12
    },
    ...
  ]
}
```

---

## 错误处理 / Error Handling

### 常见错误码 / Common Error Codes

| 状态码 / Status | 说明 / Description |
|---|---|
| 200 | 成功 / Success |
| 400 | 请求参数错误 / Bad request |
| 401 | 未授权（登录失败）/ Unauthorized |
| 404 | 资源不存在 / Not found |
| 500 | 服务器错误 / Internal server error |

### 错误响应格式 / Error Response Format

```json
{
  "success": false,
  "message": "错误信息 / Error message"
}
```

---

## 数据格式 / Data Formats

### 统计数据 / Statistics

```json
{
  "total_distance": 1234.5,          // 公里 / kilometers
  "total_runs": 156,                 // 跑步次数 / number of runs
  "cities": 24,                      // 城市数 / number of cities
  "marathons": 5,                    // 马拉松场次 / number of marathons
  "marathon_pb": 10800,              // 全马PB（秒）/ marathon PB in seconds
  "itra_score": 45                   // ITRA积分 / ITRA score
}
```

### 跑步记录 / Running Record

```json
{
  "date": "2024-01-01",              // 日期 / date (YYYY-MM-DD)
  "distance": 10.5,                  // 距离（公里）/ distance in km
  "time": 3600,                      // 用时（秒）/ duration in seconds
  "pace": "5:43",                    // 配速 / pace (MM:SS per km)
  "city": "北京",                     // 城市 / city name
  "latitude": 39.904,                // 纬度 / latitude
  "longitude": 116.407,              // 经度 / longitude
  "is_marathon": false               // 是否马拉松 / is marathon
}
```

### 城市信息 / City Information

```json
{
  "name": "北京",                     // 城市名 / city name
  "latitude": 39.904,                // 纬度 / latitude
  "longitude": 116.407,              // 经度 / longitude
  "runs_count": 45                   // 在此城市的跑步次数 / number of runs in this city
}
```

---

## 使用示例 / Usage Examples

### cURL

```bash
# 爬取数据 / Scrape data
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "username": "myusername",
    "password": "mypassword"
  }'

# 获取统计 / Get stats
curl http://localhost:5000/api/stats/myusername

# 获取城市 / Get cities
curl http://localhost:5000/api/cities/myusername
```

### JavaScript (fetch)

```javascript
// 爬取数据 / Scrape data
fetch('http://localhost:5000/api/scrape', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'myusername',
    password: 'mypassword'
  })
})
.then(res => res.json())
.then(data => console.log(data));

// 获取统计 / Get stats
fetch('http://localhost:5000/api/stats/myusername')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Python

```python
import requests
import json

# 爬取数据 / Scrape data
response = requests.post('http://localhost:5000/api/scrape', json={
    'username': 'myusername',
    'password': 'mypassword'
})
print(response.json())

# 获取统计 / Get stats
response = requests.get('http://localhost:5000/api/stats/myusername')
print(response.json())
```

---

## 速率限制 / Rate Limiting

目前没有实现速率限制。生产环境建议添加。
Currently no rate limiting. Recommended to add in production.

---

## 版本历史 / Version History

### v1.0 (2024-01-01)
- 初始版本 / Initial release
- 基础爬虫和API / Basic scraper and API

