from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base  # Adjust to your application's base import path

class IndustryRepresentative(Base):
    __tablename__ = "industry_representatives"

    industry_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_name = Column(String(255), nullable=False)
    logo_url = Column(String(255), nullable=True)
    industry_sector = Column(String(100), default="Technology & Enterprise")
    website_url = Column(String(255), nullable=True)
    contact_person = Column(String(255), nullable=False)
    phone_number = Column(String(50), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    verification_status = Column(String(50), default="Pending")
    approved_by = Column(String(255), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())