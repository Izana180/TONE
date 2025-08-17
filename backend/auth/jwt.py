from datetime import datetime, timedelta, timezone
from typing import Union
from config import jwt_secret_key, jwt_algorithm
import jwt

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
    encoded_jwt = jwt.encode(to_encode, jwt_secret_key, algorithm=jwt_algorithm)
    return encoded_jwt