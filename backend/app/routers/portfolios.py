from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.career_portfolio import CareerPortfolio
from app.models.resume import Resume
from app.models.resume_skill import ResumeSkill
from app.models.job import Job
from app.models.job_required_skill import JobRequiredSkill
from app.models.simulation_attempt import StudentSimulationAttempt
from app.schemas.portfolio import CareerPortfolioOut
from app.services.career_opportunities.skill_matcher import calculate_compatibility
from app.services.career_opportunities.compatibility_calculator import calculate_career_readiness

router = APIRouter(prefix="/portfolios", tags=["portfolios"])


@router.get("/{student_id}/{job_id}", response_model=CareerPortfolioOut)
def get_or_create_portfolio(student_id: int, job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    resume = db.query(Resume).filter(Resume.student_id == student_id, Resume.is_latest == True).first()
    if not resume:
        raise HTTPException(status_code=400, detail="Upload a resume before viewing your portfolio.")

    attempt = (
        db.query(StudentSimulationAttempt)
        .filter(
            StudentSimulationAttempt.student_id == student_id,
            StudentSimulationAttempt.job_id == job_id,
            StudentSimulationAttempt.attempt_status == "Completed",
        )
        .order_by(StudentSimulationAttempt.completed_at.desc())
        .first()
    )

    student_skills = [s.skill_name for s in db.query(ResumeSkill).filter(ResumeSkill.resume_id == resume.resume_id).all()]
    job_required_skills = [r.skill_name for r in db.query(JobRequiredSkill).filter(JobRequiredSkill.job_id == job_id).all()]
    match = calculate_compatibility(student_skills, job_required_skills)

    resume_quality_score = resume.resume_quality_score or 0
    ats_score = resume.ats_compatibility_score or 0
    skill_match_score = match["compatibility_score"]
    simulation_score = attempt.simulation_score if attempt else 0

    readiness_score = calculate_career_readiness(
        resume_quality_score, ats_score, skill_match_score, simulation_score
    )

    portfolio = db.query(CareerPortfolio).filter(
        CareerPortfolio.student_id == student_id, CareerPortfolio.job_id == job_id
    ).first()

    if portfolio:
        portfolio.resume_id = resume.resume_id
        portfolio.attempt_id = attempt.attempt_id if attempt else None
        portfolio.resume_quality_score = resume_quality_score
        portfolio.ats_compatibiltiy_score = ats_score
        portfolio.skill_match_score = skill_match_score
        portfolio.simulation_score = simulation_score
        portfolio.career_readiness_score = readiness_score
    else:
        portfolio = CareerPortfolio(
            student_id=student_id,
            job_id=job_id,
            resume_id=resume.resume_id,
            attempt_id=attempt.attempt_id if attempt else None,
            resume_quality_score=resume_quality_score,
            ats_compatibiltiy_score=ats_score,
            skill_match_score=skill_match_score,
            simulation_score=simulation_score,
            career_readiness_score=readiness_score,
            portfolio_status="Generated",
        )
        db.add(portfolio)

    db.commit()
    db.refresh(portfolio)

    return {
        "portfolio_id": portfolio.portfolio_id,
        "student_id": portfolio.student_id,
        "job_id": portfolio.job_id,
        "job_title": job.job_title,
        "resume_quality_score": portfolio.resume_quality_score,
        "ats_compatibiltiy_score": portfolio.ats_compatibiltiy_score,
        "skill_match_score": portfolio.skill_match_score,
        "simulation_score": portfolio.simulation_score,
        "career_readiness_score": portfolio.career_readiness_score,
        "portfolio_status": portfolio.portfolio_status,
    }