from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, status, Request, Depends
from  infrastructure.db import get_db
from sqlalchemy.orm import Session
from fastapi.exceptions import RequestValidationError
from usecase.user.create import create_new_user
from models import UserCreate
from fastapi.responses import JSONResponse

app = FastAPI(title="TONE API")

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
def validation_exception_handler(request: Request, exc: RequestValidationError):
    err_details = {}
    for err in exc.errors():
        field = err["loc"][-1]
        msg = str(err["msg"])
        # Value error, プレフィックスを削除
        if msg.startswith("Value error, "):
            msg = msg.removeprefix("Value error, ")
        err_details[field] = msg
        
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "入力内容にエラーがあります",
                "details": err_details
            }
        }
    )

# ユーザー新規登録
@app.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, session: Session = Depends(get_db)):
    return create_new_user(user=user, session=session)