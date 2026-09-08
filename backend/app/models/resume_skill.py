from sqlalchemy import Column, BigInteger, String, Integer, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class ResumeSkill(Base):
    __tablename__ = "resume_skills"

    resume_skill_id = Column(BigInteger, primary_key=True, autoincrement=True)
    resume_id = Column(BigInteger, ForeignKey("resumes.resume_id"), nullable=False)
    skill_name = Column(String(100))
    skill_category = Column(String(100))
    confidence_score = Column(Integer)
    source_text = Column(String(255))
    extracted_at = Column(TIMESTAMP, server_default=func.now())