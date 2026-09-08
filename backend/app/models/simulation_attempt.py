from sqlalchemy import Column, BigInteger, Integer, Enum, TIMESTAMP, ForeignKey
from app.database import Base


class StudentSimulationAttempt(Base):
    __tablename__ = "student_simulation_attempts"

    attempt_id = Column(BigInteger, primary_key=True, autoincrement=True)
    student_id = Column(BigInteger, ForeignKey("students.student_id"), nullable=False)
    job_id = Column(BigInteger, ForeignKey("jobs.job_id"), nullable=False)
    attempt_number = Column(Integer, default=1)
    simulation_score = Column(Integer, nullable=True)
    time_taken = Column(Integer, nullable=True)
    attempt_status = Column(Enum("Inprogress", "Completed", "Exit"), default="Inprogress")
    completed_at = Column(TIMESTAMP, nullable=True)

    