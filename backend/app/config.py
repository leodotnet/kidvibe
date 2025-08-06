from typing import Optional, List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """应用配置类"""
    
    # 应用基础配置
    app_name: str = "KidVibe"
    app_version: str = "0.1.0"
    debug: bool = Field(default=False, env="DEBUG")
    
    # 数据库配置
    database_url: str = Field(default="sqlite:///./kidvibe.db", env="DATABASE_URL")
    
    # 安全配置
    secret_key: str = Field(env="SECRET_KEY")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS 配置 - 使用简单的字符串列表
    cors_origins: List[str] = ["http://localhost:3000"]
    
    # AI 模型配置
    openai_api_key: Optional[str] = Field(default=None, env="OPENAI_API_KEY")
    gemini_api_key: Optional[str] = Field(default=None, env="GEMINI_API_KEY")
    ollama_base_url: str = Field(default="http://localhost:11434", env="OLLAMA_BASE_URL")
    
    # Redis 配置
    redis_url: str = Field(default="redis://localhost:6379", env="REDIS_URL")
    
    # 文件存储配置
    upload_dir: str = Field(default="./uploads", env="UPLOAD_DIR")
    max_file_size: int = Field(default=10 * 1024 * 1024, env="MAX_FILE_SIZE")  # 10MB
    
    # 日志配置
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# 创建全局配置实例
settings = Settings() 