from pydantic import BaseModel, EmailStr, Field, HttpUrl
from typing import Optional


class StudentRegisterRequest(BaseModel):
    matric_number: str = Field(..., min_length=1, max_length=30)
    fullname: str = Field(..., min_length=2, max_length=200)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    phone_number: Optional[str] = Field(None, max_length=50)
    programme: Optional[str] = Field(None, max_length=100)
    linkedin_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None


class StudentResponse(BaseModel):
    student_id: int
    matric_number: str
    fullname: str
    email: EmailStr
    phone_number: Optional[str] = None
    programme: Optional[str] = None
    linkedin_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None
    email_verified: bool


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
    industry_sector: Optional[str] = None
    website_url: Optional[str] = None
    contact_person: Optional[str] = None
    phone_number: Optional[str] = None
    email: EmailStr
    password: str
    logo_url: Optional[str] = None


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