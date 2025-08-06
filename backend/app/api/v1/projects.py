from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.project import Project, ProjectFile
from app.schemas.project import (
    Project as ProjectSchema,
    ProjectCreate,
    ProjectUpdate,
    ProjectFile as ProjectFileSchema,
    ProjectFileCreate,
    ProjectFileUpdate
)

router = APIRouter()


@router.post("/", response_model=ProjectSchema)
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """创建新项目"""
    db_project = Project(
        name=project.name,
        description=project.description,
        initial_prompt=project.initial_prompt,
        tech_stack=project.tech_stack.dict() if project.tech_stack else None,
        owner_id=current_user.id
    )
    
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    return db_project


@router.get("/", response_model=List[ProjectSchema])
async def get_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取用户的项目列表"""
    projects = db.query(Project).filter(
        Project.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return projects


@router.get("/{project_id}", response_model=ProjectSchema)
async def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取特定项目"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project


@router.put("/{project_id}", response_model=ProjectSchema)
async def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """更新项目"""
    db_project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # 更新字段
    update_data = project_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "tech_stack" and value:
            setattr(db_project, field, value.dict())
        else:
            setattr(db_project, field, value)
    
    db.commit()
    db.refresh(db_project)
    
    return db_project


@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """删除项目"""
    db_project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    db.delete(db_project)
    db.commit()
    
    return {"message": "Project deleted successfully"}


# 项目文件相关路由
@router.post("/{project_id}/files", response_model=ProjectFileSchema)
async def create_project_file(
    project_id: int,
    file: ProjectFileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """创建项目文件"""
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
    
    db_file = ProjectFile(
        project_id=project_id,
        file_path=file.file_path,
        file_name=file.file_name,
        content=file.content,
        file_type=file.file_type,
        language=file.language
    )
    
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    
    return db_file


@router.get("/{project_id}/files", response_model=List[ProjectFileSchema])
async def get_project_files(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取项目文件列表"""
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
    
    files = db.query(ProjectFile).filter(
        ProjectFile.project_id == project_id
    ).all()
    
    return files


@router.put("/{project_id}/files/{file_id}", response_model=ProjectFileSchema)
async def update_project_file(
    project_id: int,
    file_id: int,
    file_update: ProjectFileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """更新项目文件"""
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
    
    # 查找文件
    db_file = db.query(ProjectFile).filter(
        ProjectFile.id == file_id,
        ProjectFile.project_id == project_id
    ).first()
    
    if not db_file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    # 更新字段
    update_data = file_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_file, field, value)
    
    db.commit()
    db.refresh(db_file)
    
    return db_file 


@router.post("/analyze")
async def analyze_project_requirements(
    request: dict,
    current_user: User = Depends(get_current_active_user)
):
    """分析项目需求"""
    from app.core.ai.factory import AIClientFactory
    
    try:
        description = request.get("description", "")
        if not description:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Description is required"
            )
        
        # 使用 AI 客户端分析需求
        ai_client = AIClientFactory.get_default_client()
        analysis = await ai_client.analyze_requirements(description)
        
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        ) 