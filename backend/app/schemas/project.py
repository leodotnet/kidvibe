from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel


class TechStack(BaseModel):
    """技术栈配置"""
    frontend: str = "nextjs"
    backend: str = "fastapi"
    database: str = "sqlite"
    styling: str = "tailwind"


class ProjectBase(BaseModel):
    """项目基础模式"""
    name: str
    description: Optional[str] = None
    initial_prompt: str
    tech_stack: Optional[TechStack] = None


class ProjectCreate(ProjectBase):
    """创建项目模式"""
    pass


class ProjectUpdate(BaseModel):
    """更新项目模式"""
    name: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[TechStack] = None
    status: Optional[str] = None


class ProjectInDB(ProjectBase):
    """数据库中的项目模式"""
    id: int
    owner_id: int
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class Project(ProjectInDB):
    """项目响应模式"""
    pass


class ProjectFileBase(BaseModel):
    """项目文件基础模式"""
    file_path: str
    file_name: str
    content: Optional[str] = None
    file_type: Optional[str] = None
    language: Optional[str] = None


class ProjectFileCreate(ProjectFileBase):
    """创建项目文件模式"""
    project_id: int


class ProjectFileUpdate(BaseModel):
    """更新项目文件模式"""
    content: Optional[str] = None
    file_type: Optional[str] = None
    language: Optional[str] = None


class ProjectFileInDB(ProjectFileBase):
    """数据库中的项目文件模式"""
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProjectFile(ProjectFileInDB):
    """项目文件响应模式"""
    pass 