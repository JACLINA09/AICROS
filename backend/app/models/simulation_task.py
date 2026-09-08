from sqlalchemy import Column, BigInteger, String, Text, JSON, DECIMAL, Integer, Enum, ForeignKey
from app.database import Base


class SimulationTask(Base):
    __tablename__ = "simulation_tasks"

    task_id = Column(BigInteger, primary_key=True, autoincrement=True)
    industry_id = Column(BigInteger, nullable=True)
    job_id = Column(BigInteger, ForeignKey("jobs.job_id"), nullable=False)
    task_title = Column(String(255))
    task_scenario = Column(Text)
    instructions = Column(Text)
    question_type = Column(Enum("Objective", "Open-Ended"))
    correct_answer = Column(Text)
    evaluation_guide = Column(Text)
    scoring_rubric = Column(JSON)
    maximum_mark = Column(DECIMAL(6, 2), default=100)
    task_level = Column(String(255))
    time_limit_minutes = Column(Integer, default=10)
    task_status = Column(Enum("Draft", "Published", "Closed"), default="Published")