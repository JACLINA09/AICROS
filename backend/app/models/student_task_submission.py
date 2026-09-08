from sqlalchemy import Column, BigInteger, Text, String, DECIMAL, Integer, ForeignKey
from app.database import Base


class StudentTaskSubmission(Base):
    __tablename__ = "student_task_submissions"

    submission_id = Column(BigInteger, primary_key=True, autoincrement=True)
    attempt_id = Column(BigInteger, ForeignKey("student_simulation_attempts.attempt_id"), nullable=False)
    task_id = Column(BigInteger, ForeignKey("simulation_tasks.task_id"), nullable=False)
    text_answer = Column(Text)
    file_upload_path = Column(String(255), nullable=True)
    rubric_score_breakdown = Column(DECIMAL(5, 2), nullable=True)
    ai_feedback = Column(Text)
    task_score = Column(Integer)