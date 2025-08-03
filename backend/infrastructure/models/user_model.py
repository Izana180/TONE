from sqlalchemy import String, Date, DateTime
from sqlalchemy.sql import text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import date, datetime
from db import Base

# DB定義 usersテーブル
class User(Base):
    __tablename__ = "users"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, comment="ユーザーID")
    name: Mapped[str] = mapped_column(String(255), comment="ユーザー名")
    email: Mapped[str] = mapped_column(String(255), unique=True, comment="メールアドレス")
    password: Mapped[str] = mapped_column(String)
    birth_date: Mapped[date] = mapped_column(Date, nullable=True)
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("NOW()"), comment="作成日時")
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("NOW()"), onupdate=text("NOW()"), comment="更新日時")