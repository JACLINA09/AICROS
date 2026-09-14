from sqlalchemy import BigInteger, Boolean, Column, String, TIMESTAMP, func
from app.database import Base


class Student(Base):
    __tablename__ = "students"

    student_id = Column(BigInteger, primary_key=True, autoincrement=True)
    matric_number = Column(String(30), nullable=True)
    fullname = Column(String(200), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone_number = Column(String(50), nullable=True)
    programme = Column(String(100), nullable=True)
    linkedin_url = Column(String(200), nullable=True)
    github_url = Column(String(200), nullable=True)
    # Email verification
    email_verified = Column(Boolean, nullable=False, default=False)
    verification_token = Column(String(255), nullable=True)
    verification_token_expires = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())