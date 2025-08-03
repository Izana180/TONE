from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

# .envファイルの読み込み
load_dotenv()

# DB接続文字列
DB_URL = os.getenv("DATABASE_URL")
#　基底クラス
class Base(DeclarativeBase):
    pass

# DBエンジン定義
engine = create_engine(str(DB_URL))

# テーブル作成（初回のみ）
def create_tables():
    Base.metadata.create_all(engine)
# DBセッション作成・取得
def session():
    create_tables()
    SessionClass = sessionmaker(engine)
    session = SessionClass()
    return session