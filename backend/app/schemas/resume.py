from pydantic import BaseModel
from typing import Optional, List


class ResumeEvaluationOut(BaseModel):
    resume_quality_score: int = 0
    ats_compatibility_score: int = 0
    resume_score_breakdown: dict = {}
    ats_score_breakdown: dict = {}
    missing_sections: List[str] = []
    detected_issues: List[str] = []
    improvement_suggestions: str = ""


class SkillOut(BaseModel):
    skill_name: str
    skill_category: str
    confidence_score: int


class ResumeOut(BaseModel):
    resume_id: int
    student_id: int
    file_name: str
    file_type: str
    resume_quality_score: Optional[int]
    ats_compatibility_score: Optional[int]
    extraction_status: str
    evaluation: Optional[ResumeEvaluationOut] = None
    skills: List[SkillOut] = []

    class Config:
        from_attributes = True

0