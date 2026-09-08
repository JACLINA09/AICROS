from sqlalchemy import Column, BigInteger, String, Integer, Text, TIMESTAMP, Boolean, Enum, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    resume_id = Column(BigInteger, primary_key=True, autoincrement=True)
    student_id = Column(BigInteger, ForeignKey("students.student_id"), nullable=False)
    file_path = Column(String(200))
    resume_quality_score = Column(Integer)
    ats_compatibility_score = Column(Integer)
    extracted_text = Column(Text)
    extraction_status = Column(Enum("Pending", "Completed", "Failed"), default="Pending")
    file_name = Column(String(255))
    file_type = Column(Enum("PDF", "DOCX"))
    is_latest = Column(Boolean, default=True)
    uploaded_at = Column(TIMESTAMP, server_default=func.now())