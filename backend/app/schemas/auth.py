from pydantic import BaseModel, EmailStr
from typing import Optional


class StudentRegisterRequest(BaseModel):
    matric_number: Optional[str] = None
    fullname: str
    email: EmailStr
    password: str
    phone_number: Optional[str] = None
    programme: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class StudentOut(BaseModel):
    student_id: int
    matric_number: Optional[str]
    fullname: str
    email: str
    phone_number: Optional[str]
    programme: Optional[str]
    linkedin_url: Optional[str]
    github_url: Optional[str]

    class Config:
        from_attributes = True


class IndustryRegisterRequest(BaseModel):
    company_name: str
    contact_person: Optional[str] = None
    email: EmailStr
    password: str


class IndustryOut(BaseModel):
    industry_id: int
    company_name: str
    contact_person: Optional[str]
    email: str
    verification_status: str

    class Config:
        from_attributes = True

class AdminOut(BaseModel):
    admin_id: int
    username: str
    email: str

    class Config:
        from_attributes = True