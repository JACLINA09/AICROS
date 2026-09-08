from sqlalchemy import Column, BigInteger, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class JobApplication(Base):
    __tablename__ = "job_applications"

    application_id = Column(BigInteger, primary_key=True, autoincrement=True)
    student_id = Column(BigInteger, ForeignKey("students.student_id"), nullable=False)
    resume_id = Column(BigInteger, ForeignKey("resumes.resume_id"), nullable=False)
    job_id = Column(BigInteger, ForeignKey("jobs.job_id"), nullable=False)
    portfolio_id = Column(BigInteger, nullable=True)
    application_status = Column(String(50), default="Pending")
    applied_at = Column(TIMESTAMP, server_default=func.now())