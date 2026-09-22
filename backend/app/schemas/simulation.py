from pydantic import BaseModel
from typing import Optional, List


class SimulationTaskOut(BaseModel):
    task_id: int
    job_id: int
    job_title: Optional[str] = None
    task_title: str
    task_scenario: Optional[str]
    instructions: Optional[str]
    question_type: str
    time_limit_minutes: Optional[int]
    task_level: Optional[str] = None

    class Config:
        from_attributes = True


class StartAttemptRequest(BaseModel):
    student_id: int
    job_id: int


class StartAttemptOut(BaseModel):
    attempt_id: int
    job_id: int
    tasks: List[SimulationTaskOut]


class SubmitAnswerRequest(BaseModel):
    attempt_id: int
    task_id: int
    text_answer: str


class SubmitAnswerOut(BaseModel):
    task_score: int
    ai_feedback: str


class FinishAttemptOut(BaseModel):
    attempt_id: int
    simulation_score: int
    submissions: List[SubmitAnswerOut]

class SimulationTaskCreate(BaseModel):
    industry_id: int
    job_id: int
    task_title: str
    task_scenario: Optional[str] = None
    instructions: Optional[str] = None
    question_type: str  # "Objective" or "Open-Ended"
    correct_answer: Optional[str] = None
    evaluation_guide: Optional[str] = None
    task_level: Optional[str] = None
    time_limit_minutes: int = 10