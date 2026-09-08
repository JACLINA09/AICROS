from sqlalchemy import Column, BigInteger, String, Text, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base


class Job(Base):
    __tablename__ = "jobs"

    job_id = Column(BigInteger, primary_key=True, autoincrement=True)
    industry_id = Column(BigInteger, nullable=True)
    job_title = Column(String(100))
    job_description = Column(Text)
    responsibilities = Column(String(255))
    skills_required = Column(Text)
    location = Column(String(100))
    salary = Column(String(100))
    job_type = Column(String(100))
    posted_at = Column(TIMESTAMP, server_default=func.now())