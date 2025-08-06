from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class ChatMessageBase(BaseModel):
    """聊天消息基础模式"""
    role: str  # user, assistant, system
    content: str
    metadata: Optional[Dict[str, Any]] = None


class ChatMessageCreate(ChatMessageBase):
    """创建聊天消息模式"""
    session_id: int


class ChatMessageInDB(ChatMessageBase):
    """数据库中的聊天消息模式"""
    id: int
    session_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ChatMessage(ChatMessageInDB):
    """聊天消息响应模式"""
    pass


class ChatSessionBase(BaseModel):
    """聊天会话基础模式"""
    title: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


class ChatSessionCreate(ChatSessionBase):
    """创建聊天会话模式"""
    project_id: int


class ChatSessionUpdate(BaseModel):
    """更新聊天会话模式"""
    title: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


class ChatSessionInDB(ChatSessionBase):
    """数据库中的聊天会话模式"""
    id: int
    project_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ChatSession(ChatSessionInDB):
    """聊天会话响应模式"""
    messages: List[ChatMessage] = []


class ChatRequest(BaseModel):
    """聊天请求模式"""
    message: str
    session_id: Optional[int] = None
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    """聊天响应模式"""
    message: ChatMessage
    session_id: int
    suggestions: Optional[List[str]] = None
    code_changes: Optional[List[Dict[str, Any]]] = None 