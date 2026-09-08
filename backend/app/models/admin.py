from sqlalchemy import Column, BigInteger, String
from app.database import Base


class Admin(Base):
    __tablename__ = "admin"

    admin_id = Column(BigInteger, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)