from pydantic import BaseModel
from typing import List, Optional


class JobRequiredSkillOut(BaseModel):
    skill_name: str
    proficiency_level: Optional[str]


class JobOut(BaseModel):
    job_id: int
    job_title: str
    job_description: Optional[str]
    responsibilities: Optional[str]
    location: Optional[str]
    salary: Optional[str]
    job_type: Optional[str]
    required_skills: List[JobRequiredSkillOut] = []
    compatibility_score: Optional[int] = None
    matched_skills: List[str] = []
    missing_skills: List[str] = []

    class Config:
        from_attributes = True


class JobApplicationCreate(BaseModel):
    student_id: int
    resume_id: int
    job_id: int


class JobApplicationOut(BaseModel):
    application_id: int
    student_id: int
    resume_id: int
    job_id: int
    job_title: Optional[str] = None
    application_status: str

    class Config:
        from_attributes = True

class RequiredSkillInput(BaseModel):
    skill_name: str
    proficiency_level: Optional[str] = None


class JobCreate(BaseModel):
    industry_id: int
    job_title: str
    job_description: Optional[str] = None
    responsibilities: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    job_type: Optional[str] = None
    required_skills: List[RequiredSkillInput] = []


class ApplicantOut(BaseModel):
    application_id: int
    student_id: int
    student_name: str
    job_id: int
    job_title: str
    application_status: str

    class Config:
        from_attributes = True


class StatusUpdate(BaseModel):
    application_status: str