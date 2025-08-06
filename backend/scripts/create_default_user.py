#!/usr/bin/env python3
"""
创建默认用户的脚本
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db
from app.models.user import User
from app.api.deps import get_password_hash


def create_default_user():
    """创建默认用户"""
    db = SessionLocal()
    try:
        # 检查是否已存在默认用户
        existing_user = db.query(User).filter(User.email == "admin@kidvibe.com").first()
        if existing_user:
            print("默认用户已存在")
            return
        
        # 创建默认用户
        default_user = User(
            email="admin@kidvibe.com",
            username="admin",
            full_name="管理员",
            hashed_password=get_password_hash("admin123"),
            is_active=True,
            is_superuser=True
        )
        
        db.add(default_user)
        db.commit()
        db.refresh(default_user)
        
        print("默认用户创建成功！")
        print("邮箱: admin@kidvibe.com")
        print("密码: admin123")
        
    except Exception as e:
        print(f"创建默认用户失败: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("初始化数据库...")
    init_db()
    print("创建默认用户...")
    create_default_user() 