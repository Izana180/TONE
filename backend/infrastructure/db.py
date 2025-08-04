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

Session = sessionmaker(autoflush=False, bind=engine)

# テーブル作成（ローカル開発用）
def create_tables():
    Base.metadata.create_all(engine)
    
def get_db():
    # ローカル開発用
    create_tables()
    db = Session()
    try:
        yield db
    finally:
        db.close()