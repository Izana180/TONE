from fastapi import status
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
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
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={
                "code": "USER_ALREADY_EXISTS",
                "error": {
                    "message": "このメールアドレスは既に登録されています"        
                }
            }
        )
    # パスワード暗号化(SHA-256でハッシュ化)
    hashed_password = pbkdf2_sha256.hash(user.password)
    # 新規ユーザーオブジェクトを作成
    new_user = User(
        name=user.name, 
        email=user.email,
        password=hashed_password,
        birth_date=user.birth_date,
    )
    # ユーザーをINSERT
    session.add(new_user)
    session.commit()
    # 登録されたユーザを取得
    created_user = session.query(User).\
        filter(User.email == user.email).all()
    # JWTトークン生成
    new_token = create_token({"sub": str(created_user[0].id)})
    # 登録されたユーザー情報、JWTトークンをレスポンスにセット
    new_user_info = CreatedUserResponse(
        user = UserResponse(
            id=str(created_user[0].id),
            username=created_user[0].name,
            email=created_user[0].email,
            birthDate=created_user[0].birth_date,
            createdAt=created_user[0].createdAt
        ),
        token = Token(
            token=new_token,
        )
    )
    return new_user_info