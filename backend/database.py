"""数据库操作模块 / Database Module"""

import json
import os
from datetime import datetime

class LocalDatabase:
    """本地JSON数据库（用于测试） / Local JSON Database for Testing"""
    
    def __init__(self, db_file="data.json"):
        self.db_file = db_file
        self.init_db()
    
    def init_db(self):
        """初始化数据库 / Initialize Database"""
        if not os.path.exists(self.db_file):
            initial_data = {
                "users": [],
                "runs": [],
                "marathons": [],
                "cities": []
            }
            self.save_data(initial_data)
    
    def load_data(self):
        """加载数据 / Load Data"""
        try:
            with open(self.db_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return None
    
    def save_data(self, data):
        """保存数据 / Save Data"""
        with open(self.db_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    def add_user(self, user_data):
        """添加用户 / Add User"""
        data = self.load_data()
        user_data['created_at'] = datetime.now().isoformat()
        data['users'].append(user_data)
        self.save_data(data)
        return user_data
    
    def add_run(self, run_data):
        """添加跑步记录 / Add Running Record"""
        data = self.load_data()
        run_data['created_at'] = datetime.now().isoformat()
        data['runs'].append(run_data)
        self.save_data(data)
        return run_data
    
    def get_user_stats(self, user_id):
        """获取用户统计 / Get User Statistics"""
        data = self.load_data()
        runs = [r for r in data['runs'] if r.get('user_id') == user_id]
        
        stats = {
            'total_distance': sum([r.get('distance', 0) for r in runs]),
            'total_runs': len(runs),
            'cities': len(set([r.get('city') for r in runs if r.get('city')])),
            'marathons': len([r for r in runs if r.get('is_marathon', False)]),
            'marathon_pb': min([r.get('time') for r in runs if r.get('is_marathon', False)], default=None),
            'itra_score': None  # 需要从爬虫获取
        }
        return stats
