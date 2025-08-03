from datetime import date, datetime
from pydantic import BaseModel, field_validator
from typing import Optional

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
    def validate_password(cls, v):
        if(len(v) < 6):
            raise ValueError("パスワードは6文字以上で入力してください")
        return v
    
# ユーザー情報
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    birthDate: Optional[date] = None
    createdAt: datetime
    
# ユーザー新規作成レスポンス
class CreatedUserResponse(BaseModel):
    user: UserResponse
    token: str
    
# トークン
class Token(BaseModel):
    token: str
    token_typp: str = "bearer"