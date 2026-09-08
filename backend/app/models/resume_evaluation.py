from sqlalchemy import Column, BigInteger, Integer, Text, JSON, TIMESTAMP, Enum, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class ResumeEvaluation(Base):
    __tablename__ = "resume_evaluations"

    evaluation_id = Column(BigInteger, primary_key=True, autoincrement=True)
    resume_id = Column(BigInteger, ForeignKey("resumes.resume_id"), nullable=False)
    resume_quality_score = Column(Integer)
    ats_compatibility_score = Column(Integer)
    resume_score_breakdown = Column(JSON)
    ats_score_breakdown = Column(JSON)
    missing_sections = Column(JSON)
    detected_issues = Column(JSON)
    improvement_suggestions = Column(Text)
    evaluation_status = Column(Enum("Pending", "Completed", "Failed"), default="Pending")
    evaluated_at = Column(TIMESTAMP, server_default=func.now())