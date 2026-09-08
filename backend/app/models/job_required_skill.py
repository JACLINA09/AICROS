from sqlalchemy import Column, BigInteger, String, ForeignKey
from app.database import Base


class JobRequiredSkill(Base):
    __tablename__ = "job_required_skills"

    job_skill_id = Column(BigInteger, primary_key=True, autoincrement=True)
    job_id = Column(BigInteger, ForeignKey("jobs.job_id"), nullable=False)
    skill_name = Column(String(150))
    proficiency_level = Column(String(150))