import google.generativeai as genai
from typing import Dict, Any, List
import asyncio
from .base import BaseAIClient
from app.config import settings


class GeminiClient(BaseAIClient):
    """Gemini AI 客户端"""
    
    def __init__(self):
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY 未配置")
        
        genai.configure(api_key=settings.gemini_api_key)
        # 使用正确的模型名称
        self.model = genai.GenerativeModel('gemini-1.5-pro')
    
    async def generate_code(self, prompt: str, context: Dict[str, Any]) -> str:
        """生成代码"""
        try:
            # 构建完整的提示
            full_prompt = f"""
            请根据以下需求生成代码：
            
            需求：{prompt}
            
            上下文信息：
            - 技术栈：{context.get('tech_stack', 'Next.js + FastAPI')}
            - 项目类型：{context.get('project_type', 'Web应用')}
            - 文件路径：{context.get('file_path', '')}
            
            请生成完整、可运行的代码，并添加必要的注释。
            """
            
            response = await asyncio.to_thread(
                self.model.generate_content,
                full_prompt
            )
            
            return response.text
        except Exception as e:
            return f"代码生成失败：{str(e)}"
    
    async def analyze_requirements(self, description: str) -> Dict[str, Any]:
        """分析需求"""
        try:
            prompt = f"""
            请分析以下项目需求，并提供技术栈建议：
            
            需求描述：{description}
            
            请以 JSON 格式返回分析结果，包含：
            - tech_stack: 推荐的技术栈
            - features: 主要功能列表
            - complexity: 复杂度评估（简单/中等/复杂）
            - estimated_time: 预估开发时间
            """
            
            response = await asyncio.to_thread(
                self.model.generate_content,
                prompt
            )
            
            # 这里应该解析 JSON 响应
            # 暂时返回模拟数据
            return {
                "tech_stack": {
                    "frontend": "nextjs",
                    "backend": "fastapi",
                    "database": "sqlite",
                    "styling": "tailwind"
                },
                "features": ["用户认证", "项目管理", "聊天功能"],
                "complexity": "中等",
                "estimated_time": "2-3周"
            }
        except Exception as e:
            return {
                "error": f"需求分析失败：{str(e)}",
                "tech_stack": {"frontend": "nextjs", "backend": "fastapi"},
                "features": [],
                "complexity": "未知"
            }
    
    async def suggest_improvements(self, code: str, feedback: str) -> List[str]:
        """建议改进"""
        try:
            prompt = f"""
            请分析以下代码并提供改进建议：
            
            代码：
            {code}
            
            反馈：
            {feedback}
            
            请提供具体的改进建议。
            """
            
            response = await asyncio.to_thread(
                self.model.generate_content,
                prompt
            )
            
            # 将响应分割成建议列表
            suggestions = response.text.split('\n')
            return [s.strip() for s in suggestions if s.strip()]
        except Exception as e:
            return [f"改进建议生成失败：{str(e)}"]
    
    async def chat(self, message: str, history: List[Dict[str, str]]) -> str:
        """聊天对话"""
        try:
            # 构建对话历史
            chat_history = []
            for msg in history:
                if msg['role'] == 'user':
                    chat_history.append(f"用户：{msg['content']}")
                else:
                    chat_history.append(f"助手：{msg['content']}")
            
            # 构建完整提示
            history_text = '\n'.join(chat_history)
            full_prompt = f"""
            对话历史：
            {history_text}
            
            用户新消息：{message}
            
            请作为 AI 编程助手回复，帮助用户解决编程问题。
            """
            
            response = await asyncio.to_thread(
                self.model.generate_content,
                full_prompt
            )
            
            return response.text
        except Exception as e:
            return f"聊天回复失败：{str(e)}" 