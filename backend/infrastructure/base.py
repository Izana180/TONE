from sqlalchemy.orm import DeclarativeBase

# 基底クラス
# テーブル定義を追加する際は、このクラスを継承する
class Base(DeclarativeBase):
    pass