import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """基础配置 / Base Configuration"""
    DEBUG = True
    JSON_SORT_KEYS = False
    JSONIFY_PRETTYPRINT_REGULAR = True

class DevelopmentConfig(Config):
    """开发环境配置 / Development Configuration"""
    DEBUG = True
    FLASK_ENV = "development"

class ProductionConfig(Config):
    """生产环境配置 / Production Configuration"""
    DEBUG = False
    FLASK_ENV = "production"

# 数字心动爬虫配置 / Digital Zhixin Scraper Config
DIGITAL_ZHIXIN_CONFIG = {
    "base_url": "https://www.datazhixin.com",
    "login_url": "https://www.datazhixin.com/login",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
}

# 默认配置 / Default Config
config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig
}
