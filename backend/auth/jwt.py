from datetime import datetime, timedelta, timezone
from typing import Union
from dotenv import load_dotenv
import os
import jwt

# 環境変数ファイル読み込み
load_dotenv()
# 署名作成に使用する秘密鍵
# 下記コマンドで作成:
# $ openssl rand -hex 32
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
#署名作成時のアルゴリズム
ALGORITHM = os.getenv("JWT_ALGORITHM")
# 日本標準時タイムゾーン(+9h)
JST = timezone(timedelta(hours=9))
# JWTトークン生成
def create_token(data: dict, expires_delta: Union[timedelta, None] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc).astimezone(JST) + expires_delta
    else:
        expire = datetime.now(timezone.utc).astimezone(JST) + timedelta(minutes=60)
    # 有効期限を更新
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt