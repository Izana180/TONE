from dotenv import load_dotenv
import os

# 参照するenvファイルを指定(デフォルトは.env.dev)
env_file = os.getenv("ENV_FILE", ".env.dev")
load_dotenv(env_file)

database_url = os.getenv("DATABASE_URL")
# JWTトークン署名作成に使用する秘密鍵
# 下記コマンドで作成:
# $ openssl rand -hex 32
jwt_secret_key = os.getenv("JWT_SECRET_KEY")
# JWTトークン署名作成時のアルゴリズム
jwt_algorithm = os.getenv("JWT_ALGORITHM")