from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.models.student import Student
from app.models.industry import IndustryRepresentative
from app.models.admin import Admin

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def register_student(db: Session, data) -> Student:
    existing = db.query(Student).filter(Student.email == data.email).first()
    if existing:
        raise ValueError("An account with this email already exists.")

    new_student = Student(
        matric_number=data.matric_number,
        fullname=data.fullname,
        email=data.email,
        password=hash_password(data.password),
        phone_number=data.phone_number,
        programme=data.programme,
        linkedin_url=data.linkedin_url,
        github_url=data.github_url,
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student


def authenticate_student(db: Session, email: str, password: str) -> Student | None:
    student = db.query(Student).filter(Student.email == email).first()
    if not student:
        return None
    if not verify_password(password, student.password):
        return None
    return student

def register_industry(db: Session, data) -> IndustryRepresentative:
    existing = db.query(IndustryRepresentative).filter(IndustryRepresentative.email == data.email).first()
    if existing:
        raise ValueError("An account with this email already exists.")

    new_industry = IndustryRepresentative(
        company_name=data.company_name,
        contact_person=data.contact_person,
        email=data.email,
        password=hash_password(data.password),
        verification_status="Pending",
    )
    db.add(new_industry)
    db.commit()
    db.refresh(new_industry)
    return new_industry


def authenticate_industry(db: Session, email: str, password: str) -> IndustryRepresentative:
    industry = db.query(IndustryRepresentative).filter(IndustryRepresentative.email == email).first()
    if not industry or not verify_password(password, industry.password):
        raise ValueError("Invalid email or password.")
    if industry.verification_status != "Approved":
        raise ValueError("Your account is pending admin approval.")
    return industry

from app.models.admin import Admin


def authenticate_admin(db: Session, email: str, password: str) -> Admin:
    admin = db.query(Admin).filter(Admin.email == email).first()
    if not admin or not verify_password(password, admin.password):
        raise ValueError("Invalid email or password.")
    return admin