from typing import Optional
from .base import BaseAIClient
from .gemini import GeminiClient
from app.config import settings


class AIClientFactory:
    """AI 客户端工厂"""
    
    @staticmethod
    def get_client(model_type: str = "gemini") -> BaseAIClient:
        """获取 AI 客户端"""
        if model_type == "gemini":
            return GeminiClient()
        elif model_type == "openai":
            # TODO: 实现 OpenAI 客户端
            raise NotImplementedError("OpenAI 客户端尚未实现")
        elif model_type == "ollama":
            # TODO: 实现 Ollama 客户端
            raise NotImplementedError("Ollama 客户端尚未实现")
        else:
            raise ValueError(f"不支持的模型类型：{model_type}")
    
    @staticmethod
    def get_default_client() -> BaseAIClient:
        """获取默认 AI 客户端"""
        # 优先使用 Gemini
        if settings.gemini_api_key:
            return GeminiClient()
        elif settings.openai_api_key:
            # TODO: 返回 OpenAI 客户端
            raise NotImplementedError("OpenAI 客户端尚未实现")
        else:
            raise ValueError("未配置任何 AI API 密钥") 