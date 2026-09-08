from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import StudentRegisterRequest, LoginRequest, StudentOut
from app.services.auth_service import register_student, authenticate_student
from app.schemas.auth import IndustryRegisterRequest, IndustryOut
from app.services.auth_service import register_industry, authenticate_industry
from app.schemas.auth import AdminOut
from app.services.auth_service import authenticate_admin
from app.models.industry import IndustryRepresentative


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=StudentOut)
def register(data: StudentRegisterRequest, db: Session = Depends(get_db)):
    try:
        student = register_student(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return student


@router.post("/login", response_model=StudentOut)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    student = authenticate_student(db, data.email, data.password)
    if not student:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return student


@router.post("/industry/register", response_model=IndustryOut)
def industry_register(data: IndustryRegisterRequest, db: Session = Depends(get_db)):
    try:
        industry = register_industry(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return industry


@router.post("/industry/login", response_model=IndustryOut)
def industry_login(data: LoginRequest, db: Session = Depends(get_db)):
    try:
        industry = authenticate_industry(db, data.email, data.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    return industry


@router.post("/admin/login", response_model=AdminOut)
def admin_login(data: LoginRequest, db: Session = Depends(get_db)):
    try:
        admin = authenticate_admin(db, data.email, data.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    return admin


@router.get("/admin/{admin_id}/industry-accounts", response_model=list[IndustryOut])
def get_industry_accounts(admin_id: int, db: Session = Depends(get_db)):
    return db.query(IndustryRepresentative).all()


@router.put("/admin/industry-accounts/{industry_id}/approve", response_model=IndustryOut)
def approve_industry(industry_id: int, admin_id: int, db: Session = Depends(get_db)):
    industry = db.query(IndustryRepresentative).filter(IndustryRepresentative.industry_id == industry_id).first()
    if not industry:
        raise HTTPException(status_code=404, detail="Industry account not found.")

    from datetime import datetime
    industry.verification_status = "Approved"
    industry.approved_by = admin_id
    industry.approved_at = datetime.utcnow()
    db.commit()
    db.refresh(industry)
    return industry


@router.put("/admin/industry-accounts/{industry_id}/reject", response_model=IndustryOut)
def reject_industry(industry_id: int, db: Session = Depends(get_db)):
    industry = db.query(IndustryRepresentative).filter(IndustryRepresentative.industry_id == industry_id).first()
    if not industry:
        raise HTTPException(status_code=404, detail="Industry account not found.")

    industry.verification_status = "Rejected"
    db.commit()
    db.refresh(industry)
    return industry