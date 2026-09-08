from pydantic import BaseModel
from typing import Optional


class CareerPortfolioOut(BaseModel):
    portfolio_id: int
    student_id: int
    job_id: int
    job_title: Optional[str] = None
    resume_quality_score: Optional[int]
    ats_compatibiltiy_score: Optional[int]
    skill_match_score: Optional[int]
    simulation_score: Optional[int]
    career_readiness_score: Optional[int]
    portfolio_status: str

    class Config:
        from_attributes = True