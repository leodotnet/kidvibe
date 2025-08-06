from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.project import Project
from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat import (
    ChatSession as ChatSessionSchema,
    ChatSessionCreate,
    ChatSessionUpdate,
    ChatMessage as ChatMessageSchema,
    ChatMessageCreate,
    ChatRequest,
    ChatResponse
)

router = APIRouter()


@router.post("/sessions", response_model=ChatSessionSchema)
async def create_chat_session(
    session: ChatSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """创建聊天会话"""
    # 验证项目所有权
    project = db.query(Project).filter(
        Project.id == session.project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    db_session = ChatSession(
        project_id=session.project_id,
        user_id=current_user.id,
        title=session.title,
        context=session.context
    )
    
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    return db_session


@router.get("/sessions", response_model=List[ChatSessionSchema])
async def get_chat_sessions(
    project_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取聊天会话列表"""
    query = db.query(ChatSession).filter(ChatSession.user_id == current_user.id)
    
    if project_id:
        # 验证项目所有权
        project = db.query(Project).filter(
            Project.id == project_id,
            Project.owner_id == current_user.id
        ).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        query = query.filter(ChatSession.project_id == project_id)
    
    sessions = query.all()
    return sessions


@router.get("/sessions/{session_id}", response_model=ChatSessionSchema)
async def get_chat_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取特定聊天会话"""
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    return session


@router.put("/sessions/{session_id}", response_model=ChatSessionSchema)
async def update_chat_session(
    session_id: int,
    session_update: ChatSessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """更新聊天会话"""
    db_session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not db_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    # 更新字段
    update_data = session_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_session, field, value)
    
    db.commit()
    db.refresh(db_session)
    
    return db_session


@router.delete("/sessions/{session_id}")
async def delete_chat_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """删除聊天会话"""
    db_session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not db_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    db.delete(db_session)
    db.commit()
    
    return {"message": "Chat session deleted successfully"}


@router.post("/messages", response_model=ChatMessageSchema)
async def create_chat_message(
    message: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """创建聊天消息"""
    # 验证会话所有权
    session = db.query(ChatSession).filter(
        ChatSession.id == message.session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    db_message = ChatMessage(
        session_id=message.session_id,
        role=message.role,
        content=message.content,
        metadata=message.metadata
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    return db_message


@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageSchema])
async def get_chat_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取聊天消息列表"""
    # 验证会话所有权
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.created_at).all()
    
    return messages


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    chat_request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """与 AI 聊天"""
    from app.core.ai.factory import AIClientFactory
    
    if chat_request.session_id:
        # 验证会话所有权
        session = db.query(ChatSession).filter(
            ChatSession.id == chat_request.session_id,
            ChatSession.user_id == current_user.id
        ).first()
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat session not found"
            )
    else:
        # 创建新会话
        session = ChatSession(
            project_id=1,  # 默认项目ID，实际应该从请求中获取
            user_id=current_user.id,
            title="新对话"
        )
        db.add(session)
        db.commit()
        db.refresh(session)
    
    # 获取聊天历史
    history = []
    if chat_request.session_id:
        messages = db.query(ChatMessage).filter(
            ChatMessage.session_id == session.id
        ).order_by(ChatMessage.created_at).limit(10).all()
        
        for msg in messages:
            history.append({
                "role": msg.role,
                "content": msg.content
            })
    
    # 保存用户消息
    user_message = ChatMessage(
        session_id=session.id,
        role="user",
        content=chat_request.message
    )
    db.add(user_message)
    
    try:
        # 使用 AI 客户端生成响应
        ai_client = AIClientFactory.get_default_client()
        ai_response = await ai_client.chat(chat_request.message, history)
    except Exception as e:
        ai_response = f"AI 响应生成失败：{str(e)}"
    
    # 保存 AI 消息
    ai_message = ChatMessage(
        session_id=session.id,
        role="assistant",
        content=ai_response
    )
    db.add(ai_message)
    
    db.commit()
    db.refresh(ai_message)
    
    return ChatResponse(
        message=ai_message,
        session_id=session.id,
        suggestions=["您可以尝试...", "我建议..."],
        code_changes=[]
    ) 