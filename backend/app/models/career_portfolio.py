from sqlalchemy import Column, BigInteger, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class CareerPortfolio(Base):
    __tablename__ = "career_portfolios"

    portfolio_id = Column(BigInteger, primary_key=True, autoincrement=True)
    student_id = Column(BigInteger, ForeignKey("students.student_id"), nullable=False)
    job_id = Column(BigInteger, ForeignKey("jobs.job_id"), nullable=False)
    resume_id = Column(BigInteger, nullable=True)
    evaluation_id = Column(BigInteger, nullable=True)
    match_id = Column(BigInteger, nullable=True)
    attempt_id = Column(BigInteger, nullable=True)
    resume_quality_score = Column(Integer)
    ats_compatibiltiy_score = Column(Integer)  # matches thesis spelling exactly
    simulation_score = Column(Integer)
    skill_match_score = Column(Integer)
    career_readiness_score = Column(Integer)
    portfolio_status = Column(String(50), default="Generated")
    created_at = Column(TIMESTAMP, server_default=func.now())