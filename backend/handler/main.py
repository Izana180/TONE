from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, status, Request, Depends, HTTPException
from handler import code
from contextlib import asynccontextmanager
from database import get_db
from sqlalchemy.orm import Session
from fastapi.exceptions import RequestValidationError
from usecase.user.create import create_new_user
from models import UserCreate
from database import get_db, engine
from infrastructure.base import Base
from auth import jwt
from passlib.hash import pbkdf2_sha256
from ..models import LoginRequest

# 開発用：FastAPI起動時、Baseクラスを継承しているテーブルを作成する
# (既に作成されているテーブルは作成されない)
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    yield
    
app = FastAPI(title="TONE API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    # localhost:{任意のポート}からのアクセスを許可
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "TONE API is running"}

# 新規登録バリデーションエラーカスタムレスポンス
@app.exception_handler(RequestValidationError)
def validation_exception_handler(request: LoginRequest, exc: RequestValidationError):
    err_details = {}
    for err in exc.errors():
        field = err["loc"][-1]
        msg = str(err["msg"])
        # Value error, プレフィックスを削除
        if msg.startswith("Value error, "):
            msg = msg.removeprefix("Value error, ")
        err_details[field] = msg
        
    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail={
            "error": {
                "code": code.VALIDATION_ERROR,
                "message": "入力内容にエラーがあります",
                "reasons": err_details
            }
        }
    )

# ユーザー新規登録
@app.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, session: Session = Depends(get_db)):
    return create_new_user(user=user, session=session)

##ユーザーログイン機能

##パスワード確認機能
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pbkdf2_sha256.verify(plain_password, hashed_password)