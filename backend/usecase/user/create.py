from fastapi import status, HTTPException
from handler import code
from sqlalchemy.orm import Session
from passlib.hash import pbkdf2_sha256
from auth.jwt import create_token
from infrastructure.models.user_model import User
from models import UserCreate, CreatedUserResponse, UserResponse, Token

def create_new_user(user: UserCreate, session: Session):
    """
    ユーザー新規登録
    """
    # 入力されたemailを持つユーザを取得
    users = session.query(User).\
        filter(User.email == user.email).\
        all()
    # ユーザー重複検証
    if users:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": code.USER_ALREADY_EXISTS,
                "error": {
                    "message": "このメールアドレスは既に登録されています"   
                }
            }
        )
    # パスワード暗号化(SHA-256でハッシュ化)
    hashed_password = pbkdf2_sha256.hash(user.password)
    # 新規ユーザーインスタンスを作成
    new_user = User(
        name=user.name, 
        email=user.email,
        password=hashed_password,
        birth_date=user.birth_date,
    )
    # ユーザーをINSERT
    session.add(new_user)
    session.commit()
    # JWTトークン生成
    new_token = create_token({"sub": str(new_user.id)})
    # 登録されたユーザー情報、JWTトークンをレスポンスにセット
    new_user_info = CreatedUserResponse(
        user = UserResponse(
            id=str(new_user.id),
            username=new_user.name,
            email=new_user.email,
            birthDate=new_user.birth_date,
            createdAt=new_user.createdAt
        ),
        token = Token(
            token=new_token,
        )
    )
    return new_user_info