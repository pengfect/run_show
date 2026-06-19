"""Flask API应用 / Flask API Application"""

from flask import Flask, jsonify, request
from scraper import DigitalZhixinScraper
from database import LocalDatabase
from config import config, DevelopmentConfig
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

# 初始化数据库 / Initialize Database
db = LocalDatabase()

@app.route('/api/health', methods=['GET'])
def health():
    """健康检查 / Health Check"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/scrape', methods=['POST'])
def scrape():
    """爬取数据 / Scrape Data
    
    请求体 / Request body:
    {
        "username": "用户名",
        "password": "密码"
    }
    """
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({
                'success': False,
                'message': '用户名和密码不能为空 / Username and password are required'
            }), 400
        
        logger.info(f"开始爬取用户数据: {username} / Starting scrape for user: {username}")
        
        scraper = DigitalZhixinScraper(username, password)
        result = scraper.scrape_all()
        
        if result:
            # 保存到数据库 / Save to database
            user_data = {
                'username': username,
                'data': result,
                'last_updated': datetime.now().isoformat()
            }
            db.add_user(user_data)
            
            return jsonify({
                'success': True,
                'message': '数据爬取成功 / Data scraped successfully',
                'data': result
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': '爬取失败，请检查账号密码 / Scraping failed, please check username and password'
            }), 401
    
    except Exception as e:
        logger.error(f"爬取异常 / Scraping error: {e}")
        return jsonify({
            'success': False,
            'message': f'服务器错误 / Server error: {str(e)}'
        }), 500

@app.route('/api/stats/<username>', methods=['GET'])
def get_stats(username):
    """获取用户统计 / Get User Statistics"""
    try:
        data = db.load_data()
        user = next((u for u in data['users'] if u['username'] == username), None)
        
        if not user:
            return jsonify({
                'success': False,
                'message': '用户不存在 / User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': user
        }), 200
    
    except Exception as e:
        logger.error(f"获取统计失败 / Failed to get stats: {e}")
        return jsonify({
            'success': False,
            'message': f'服务器错误 / Server error: {str(e)}'
        }), 500

@app.route('/api/runs/<username>', methods=['GET'])
def get_runs(username):
    """获取用户跑步记录 / Get User Running Records"""
    try:
        data = db.load_data()
        runs = [r for r in data['runs'] if r.get('username') == username]
        
        return jsonify({
            'success': True,
            'count': len(runs),
            'data': runs
        }), 200
    
    except Exception as e:
        logger.error(f"获取跑步记录失败 / Failed to get runs: {e}")
        return jsonify({
            'success': False,
            'message': f'服务器错误 / Server error: {str(e)}'
        }), 500

@app.route('/api/cities/<username>', methods=['GET'])
def get_cities(username):
    """获取用户跑过的城市 / Get Cities User Has Visited"""
    try:
        data = db.load_data()
        runs = [r for r in data['runs'] if r.get('username') == username]
        
        # 提取唯一城市及其坐标
        cities = {}
        for run in runs:
            city = run.get('city')
            if city and city not in cities:
                cities[city] = {
                    'name': city,
                    'latitude': run.get('latitude'),
                    'longitude': run.get('longitude'),
                    'runs_count': 1
                }
            elif city:
                cities[city]['runs_count'] += 1
        
        return jsonify({
            'success': True,
            'count': len(cities),
            'data': list(cities.values())
        }), 200
    
    except Exception as e:
        logger.error(f"获取城市列表失败 / Failed to get cities: {e}")
        return jsonify({
            'success': False,
            'message': f'服务器错误 / Server error: {str(e)}'
        }), 500

@app.errorhandler(404)
def not_found(error):
    """处理404错误 / Handle 404 errors"""
    return jsonify({
        'success': False,
        'message': '接口不存在 / Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """处理500错误 / Handle 500 errors"""
    return jsonify({
        'success': False,
        'message': '服务器内部错误 / Internal server error'
    }), 500

if __name__ == '__main__':
    logger.info("启动Flask应用 / Starting Flask application")
    app.run(host='0.0.0.0', port=5000, debug=True)
