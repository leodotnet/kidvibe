from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional


class BaseAIClient(ABC):
    """AI 客户端基础接口"""
    
    @abstractmethod
    async def generate_code(self, prompt: str, context: Dict[str, Any]) -> str:
        """生成代码"""
        pass
    
    @abstractmethod
    async def analyze_requirements(self, description: str) -> Dict[str, Any]:
        """分析需求"""
        pass
    
    @abstractmethod
    async def suggest_improvements(self, code: str, feedback: str) -> List[str]:
        """建议改进"""
        pass
    
    @abstractmethod
    async def chat(self, message: str, history: List[Dict[str, str]]) -> str:
        """聊天对话"""
        pass


class Requirements:
    """需求分析结果"""
    def __init__(self, tech_stack: Dict[str, str], features: List[str], complexity: str):
        self.tech_stack = tech_stack
        self.features = features
        self.complexity = complexity


class ValidationResult:
    """代码验证结果"""
    def __init__(self, is_valid: bool, errors: List[str], warnings: List[str]):
        self.is_valid = is_valid
        self.errors = errors
        self.warnings = warnings 