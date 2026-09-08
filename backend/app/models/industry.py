from sqlalchemy import Column, BigInteger, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class IndustryRepresentative(Base):
    __tablename__ = "industry_representatives"

    industry_id = Column(BigInteger, primary_key=True, autoincrement=True)
    company_name = Column(String(100), nullable=False)
    contact_person = Column(String(80), nullable=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    verification_status = Column(String(50), default="Pending")
    approved_by = Column(BigInteger, ForeignKey("admin.admin_id"), nullable=True)
    approved_at = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())