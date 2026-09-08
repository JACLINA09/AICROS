"""
Tool functions for the AI Career Advisor agent.

Each function is a thin wrapper around logic that already exists elsewhere
in the app (resume scoring, skill matching, simulation results, readiness
calculation). They open their own DB session since they're called directly
by the Gemini SDK's automatic function-calling loop, outside a normal
FastAPI request's Depends(get_db) flow.

Docstrings matter here — Gemini reads them to decide when and how to call
each tool, so keep them clear and specific.
"""

from app.database import SessionLocal
from app.models.resume import Resume
from app.models.resume_evaluation import ResumeEvaluation
from app.models.resume_skill import ResumeSkill
from app.models.job import Job
from app.models.job_required_skill import JobRequiredSkill
from app.models.simulation_attempt import StudentSimulationAttempt
from app.models.upskilling_course import UpskillingCourse
from app.services.career_opportunities.skill_matcher import calculate_compatibility
from app.services.career_opportunities.compatibility_calculator import calculate_career_readiness


def get_resume_analysis(student_id: int) -> dict:
    """Get the student's latest resume quality score, ATS compatibility score,
    missing sections, detected issues, and improvement suggestions.
    Use this when the student asks about their resume, its quality, or ATS score.
    """
    db = SessionLocal()
    try:
        resume = db.query(Resume).filter(Resume.student_id == student_id, Resume.is_latest == True).first()
        if not resume:
            return {"status": "no_resume", "message": "This student has not uploaded a resume yet."}

        evaluation = (
            db.query(ResumeEvaluation)
            .filter(ResumeEvaluation.resume_id == resume.resume_id)
            .order_by(ResumeEvaluation.evaluated_at.desc())
            .first()
        )
        return {
            "resume_quality_score": resume.resume_quality_score,
            "ats_compatibility_score": resume.ats_compatibility_score,
            "missing_sections": evaluation.missing_sections if evaluation else [],
            "detected_issues": evaluation.detected_issues if evaluation else [],
            "improvement_suggestions": evaluation.improvement_suggestions if evaluation else "",
        }
    finally:
        db.close()


def get_student_skills(student_id: int) -> dict:
    """Get the list of skills extracted from the student's latest resume,
    grouped by category. Use this when the student asks what skills they have."""
    db = SessionLocal()
    try:
        resume = db.query(Resume).filter(Resume.student_id == student_id, Resume.is_latest == True).first()
        if not resume:
            return {"status": "no_resume", "message": "This student has not uploaded a resume yet."}

        skills = db.query(ResumeSkill).filter(ResumeSkill.resume_id == resume.resume_id).all()
        return {"skills": [{"skill_name": s.skill_name, "category": s.skill_category} for s in skills]}
    finally:
        db.close()


def get_job_recommendations(student_id: int) -> dict:
    """Get a ranked list of available jobs with each job's compatibility score
    for this student, based on their extracted resume skills. Use this when the
    student asks what careers or jobs suit them, or wants job recommendations."""
    db = SessionLocal()
    try:
        resume = db.query(Resume).filter(Resume.student_id == student_id, Resume.is_latest == True).first()
        if not resume:
            return {"status": "no_resume", "message": "This student has not uploaded a resume yet."}

        student_skills = [s.skill_name for s in db.query(ResumeSkill).filter(ResumeSkill.resume_id == resume.resume_id).all()]
        jobs = db.query(Job).all()

        results = []
        for job in jobs:
            required = [r.skill_name for r in db.query(JobRequiredSkill).filter(JobRequiredSkill.job_id == job.job_id).all()]
            match = calculate_compatibility(student_skills, required)
            results.append({
                "job_id": job.job_id,
                "job_title": job.job_title,
                "compatibility_score": match["compatibility_score"],
                "matched_skills": match["matched_skills"],
                "missing_skills": match["missing_skills"],
            })
        results.sort(key=lambda j: j["compatibility_score"], reverse=True)
        return {"jobs": results}
    finally:
        db.close()


def get_skill_gap(student_id: int, job_id: int) -> dict:
    """Get the specific skill gap between a student and a particular job —
    which required skills they have and which they're missing. Use this when
    the student asks about a specific job's requirements or their readiness for it."""
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.job_id == job_id).first()
        if not job:
            return {"status": "not_found", "message": "Job not found."}

        resume = db.query(Resume).filter(Resume.student_id == student_id, Resume.is_latest == True).first()
        if not resume:
            return {"status": "no_resume", "message": "This student has not uploaded a resume yet."}

        student_skills = [s.skill_name for s in db.query(ResumeSkill).filter(ResumeSkill.resume_id == resume.resume_id).all()]
        required = [r.skill_name for r in db.query(JobRequiredSkill).filter(JobRequiredSkill.job_id == job_id).all()]
        match = calculate_compatibility(student_skills, required)

        return {"job_title": job.job_title, **match}
    finally:
        db.close()


def get_simulation_results(student_id: int, job_id: int) -> dict:
    """Get the student's most recent completed career simulation results for a
    specific job, including their overall score. Use this when the student asks
    about their simulation performance or practice test results."""
    db = SessionLocal()
    try:
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
        if not attempt:
            return {"status": "not_taken", "message": "This student has not completed a simulation for this job yet."}

        return {"simulation_score": attempt.simulation_score, "attempt_number": attempt.attempt_number}
    finally:
        db.close()


def get_readiness_score(student_id: int, job_id: int) -> dict:
    """Get the student's overall calculated career readiness score for a specific
    job — a weighted combination of resume quality, ATS score, skill match, and
    simulation score. Use this when the student asks how ready they are for a job,
    or asks about their overall readiness/compatibility score."""
    db = SessionLocal()
    try:
        resume = db.query(Resume).filter(Resume.student_id == student_id, Resume.is_latest == True).first()
        if not resume:
            return {"status": "no_resume", "message": "This student has not uploaded a resume yet."}

        skill_gap = get_skill_gap(student_id, job_id)
        if skill_gap.get("status") == "not_found":
            return skill_gap

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
        simulation_score = attempt.simulation_score if attempt else 0

        readiness = calculate_career_readiness(
            resume.resume_quality_score or 0,
            resume.ats_compatibility_score or 0,
            skill_gap["compatibility_score"],
            simulation_score,
        )

        return {
            "career_readiness_score": readiness,
            "resume_quality_score": resume.resume_quality_score,
            "ats_compatibility_score": resume.ats_compatibility_score,
            "skill_match_score": skill_gap["compatibility_score"],
            "simulation_score": simulation_score,
            "simulation_taken": attempt is not None,
        }
    finally:
        db.close()


def get_learning_resources(target_skill: str) -> dict:
    """Get recommended upskilling courses relevant to a skill gap, using semantic
    search — this finds conceptually related courses even if the wording doesn't
    exactly match the skill name. Use this when the student asks what to learn,
    how to close a skill gap, or wants course recommendations."""
    from app.services.ai.rag_service import find_relevant_courses

    db = SessionLocal()
    try:
        results = find_relevant_courses(db, target_skill, top_k=3)
        if not results:
            return {"courses": [], "message": "No matching courses found yet."}
        return {"courses": results}
    finally:
        db.close()


def get_job_details(job_id: int) -> dict:
    """Get full details of a specific job listing, including description,
    responsibilities, location, salary, and type. Use this when the student
    asks about a specific job's details."""
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.job_id == job_id).first()
        if not job:
            return {"status": "not_found", "message": "Job not found."}

        return {
            "job_title": job.job_title,
            "job_description": job.job_description,
            "responsibilities": job.responsibilities,
            "location": job.location,
            "salary": job.salary,
            "job_type": job.job_type,
        }
    finally:
        db.close()