from datetime import date, datetime
from pydantic import BaseModel, field_validator
from typing import Optional
import re

# ユーザー新規作成リクエスト
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    birth_date: Optional[date] = None
    # バリデーター
    @field_validator("name")
    def validate_name(cls, v):
        if(len(v) < 3):
            raise ValueError("ユーザー名は3文字以上で入力してください")
        
        return v
    @field_validator("password")
    def validate_password(cls, value):
        if(len(value) < 10):
            raise ValueError("パスワードは10文字以上で入力してください")
        elif not re.search(r'[A-Z]', value):
            raise ValueError("パスワードには英大文字を含めてください")
        elif not re.search(r'[a-z]', value):
            raise ValueError("パスワードには英小文字を含めてください")
        elif not re.search(r'\d', value):
            raise ValueError("パスワードには数字を含めてください")
        elif not re.search(r'[!@#$%^&*()_+\-=\[\]{};\'\\:"|,<.>/?]', value):
            raise ValueError("パスワードには記号を1つ以上含めてください")
        return value
    
# ユーザー情報
class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    birth_date: Optional[date] = None
    created_at: datetime

# トークン
class Token(BaseModel):
    token: str
    token_type: str = "bearer"

# ユーザー新規作成レスポンス
class CreatedUserResponse(BaseModel):
    user: UserResponse
    token: Token
    