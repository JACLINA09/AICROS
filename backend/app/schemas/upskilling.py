from pydantic import BaseModel
from typing import Optional


class UpskillingCourseCreate(BaseModel):
    admin_id: int
    target_skill: str
    course_title: str
    provider: Optional[str] = None
    course_url: Optional[str] = None
    course_description: Optional[str] = None


class UpskillingCourseOut(BaseModel):
    course_id: int
    target_skill: str
    course_title: str
    provider: Optional[str]
    course_url: Optional[str]
    course_description: Optional[str]

    class Config:
        from_attributes = True