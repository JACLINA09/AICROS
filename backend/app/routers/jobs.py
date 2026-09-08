from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.job import Job
from app.models.job_required_skill import JobRequiredSkill
from app.models.job_application import JobApplication
from app.models.resume import Resume
from app.models.resume_skill import ResumeSkill
from app.schemas.job import JobOut, JobApplicationCreate, JobApplicationOut
from app.services.career_opportunities.skill_matcher import calculate_compatibility
from app.schemas.job import JobCreate, ApplicantOut, StatusUpdate
from app.models.student import Student


router = APIRouter(prefix="/jobs", tags=["jobs"])


def _get_student_skills(db: Session, student_id: int) -> list[str]:
    resume = db.query(Resume).filter(Resume.student_id == student_id, Resume.is_latest == True).first()
    if not resume:
        return []
    skills = db.query(ResumeSkill).filter(ResumeSkill.resume_id == resume.resume_id).all()
    return [s.skill_name for s in skills]


@router.get("", response_model=list[JobOut])
def list_jobs(student_id: int, db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    student_skills = _get_student_skills(db, student_id)

    results = []
    for job in jobs:
        required = db.query(JobRequiredSkill).filter(JobRequiredSkill.job_id == job.job_id).all()
        required_names = [r.skill_name for r in required]

        match = calculate_compatibility(student_skills, required_names)

        results.append({
            "job_id": job.job_id,
            "job_title": job.job_title,
            "job_description": job.job_description,
            "responsibilities": job.responsibilities,
            "location": job.location,
            "salary": job.salary,
            "job_type": job.job_type,
            "required_skills": [{"skill_name": r.skill_name, "proficiency_level": r.proficiency_level} for r in required],
            "compatibility_score": match["compatibility_score"],
            "matched_skills": match["matched_skills"],
            "missing_skills": match["missing_skills"],
        })

    results.sort(key=lambda j: j["compatibility_score"], reverse=True)
    return results


@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, student_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    required = db.query(JobRequiredSkill).filter(JobRequiredSkill.job_id == job.job_id).all()
    required_names = [r.skill_name for r in required]
    student_skills = _get_student_skills(db, student_id)
    match = calculate_compatibility(student_skills, required_names)

    return {
        "job_id": job.job_id,
        "job_title": job.job_title,
        "job_description": job.job_description,
        "responsibilities": job.responsibilities,
        "location": job.location,
        "salary": job.salary,
        "job_type": job.job_type,
        "required_skills": [{"skill_name": r.skill_name, "proficiency_level": r.proficiency_level} for r in required],
        "compatibility_score": match["compatibility_score"],
        "matched_skills": match["matched_skills"],
        "missing_skills": match["missing_skills"],
    }


@router.post("/apply", response_model=JobApplicationOut)
def apply_to_job(data: JobApplicationCreate, db: Session = Depends(get_db)):
    existing = db.query(JobApplication).filter(
        JobApplication.student_id == data.student_id,
        JobApplication.job_id == data.job_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied to this job.")

    application = JobApplication(
        student_id=data.student_id,
        resume_id=data.resume_id,
        job_id=data.job_id,
        application_status="Pending",
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

@router.get("/applications/{student_id}", response_model=list[JobApplicationOut])
def get_my_applications(student_id: int, db: Session = Depends(get_db)):
    applications = db.query(JobApplication).filter(JobApplication.student_id == student_id).all()

    results = []
    for app in applications:
        job = db.query(Job).filter(Job.job_id == app.job_id).first()
        results.append({
            "application_id": app.application_id,
            "student_id": app.student_id,
            "resume_id": app.resume_id,
            "job_id": app.job_id,
            "job_title": job.job_title if job else None,
            "application_status": app.application_status,
        })
    return results


@router.post("", response_model=JobOut)
def create_job(data: JobCreate, db: Session = Depends(get_db)):
    job = Job(
        industry_id=data.industry_id,
        job_title=data.job_title,
        job_description=data.job_description,
        responsibilities=data.responsibilities,
        location=data.location,
        salary=data.salary,
        job_type=data.job_type,
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    for skill in data.required_skills:
        db.add(JobRequiredSkill(job_id=job.job_id, skill_name=skill.skill_name, proficiency_level=skill.proficiency_level))
    db.commit()

    return {
        "job_id": job.job_id,
        "job_title": job.job_title,
        "job_description": job.job_description,
        "responsibilities": job.responsibilities,
        "location": job.location,
        "salary": job.salary,
        "job_type": job.job_type,
        "required_skills": [{"skill_name": s.skill_name, "proficiency_level": s.proficiency_level} for s in data.required_skills],
        "compatibility_score": None,
        "matched_skills": [],
        "missing_skills": [],
    }


@router.get("/industry/{industry_id}", response_model=list[JobOut])
def get_jobs_by_industry(industry_id: int, db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.industry_id == industry_id).all()
    results = []
    for job in jobs:
        required = db.query(JobRequiredSkill).filter(JobRequiredSkill.job_id == job.job_id).all()
        results.append({
            "job_id": job.job_id,
            "job_title": job.job_title,
            "job_description": job.job_description,
            "responsibilities": job.responsibilities,
            "location": job.location,
            "salary": job.salary,
            "job_type": job.job_type,
            "required_skills": [{"skill_name": r.skill_name, "proficiency_level": r.proficiency_level} for r in required],
            "compatibility_score": None,
            "matched_skills": [],
            "missing_skills": [],
        })
    return results


@router.get("/industry/{industry_id}/applicants", response_model=list[ApplicantOut])
def get_applicants(industry_id: int, db: Session = Depends(get_db)):
    job_ids = [j.job_id for j in db.query(Job).filter(Job.industry_id == industry_id).all()]
    if not job_ids:
        return []

    applications = db.query(JobApplication).filter(JobApplication.job_id.in_(job_ids)).all()

    results = []
    for app in applications:
        student = db.query(Student).filter(Student.student_id == app.student_id).first()
        job = db.query(Job).filter(Job.job_id == app.job_id).first()
        results.append({
            "application_id": app.application_id,
            "student_id": app.student_id,
            "student_name": student.fullname if student else "Unknown",
            "job_id": app.job_id,
            "job_title": job.job_title if job else "Unknown",
            "application_status": app.application_status,
        })
    return results


@router.put("/applications/{application_id}/status", response_model=JobApplicationOut)
def update_application_status(application_id: int, data: StatusUpdate, db: Session = Depends(get_db)):
    application = db.query(JobApplication).filter(JobApplication.application_id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    application.application_status = data.application_status
    db.commit()
    db.refresh(application)

    job = db.query(Job).filter(Job.job_id == application.job_id).first()
    return {
        "application_id": application.application_id,
        "student_id": application.student_id,
        "resume_id": application.resume_id,
        "job_id": application.job_id,
        "job_title": job.job_title if job else None,
        "application_status": application.application_status,
    }