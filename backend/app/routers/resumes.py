import os
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.resume import Resume
from app.models.resume_evaluation import ResumeEvaluation
from app.models.resume_skill import ResumeSkill
from app.models.student import Student
from app.schemas.resume import ResumeOut
from app.services.resume.resume_parser import extract_text, score_resume
from app.services.resume.skill_extractor import extract_skills
from app.services.resume.report_generator import generate_resume_report
from app.services.ai.gemini_service import grade_resume_with_ai

router = APIRouter(prefix="/resumes", tags=["resumes"])

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload/{student_id}", response_model=ResumeOut)
async def upload_resume(student_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    filename = file.filename
    ext = filename.split(".")[-1].upper()
    if ext not in ("PDF", "DOCX"):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    file_bytes = await file.read()

    db.query(Resume).filter(Resume.student_id == student_id, Resume.is_latest == True).update({"is_latest": False})

    file_path = os.path.join(UPLOAD_DIR, f"{student_id}_{filename}")
    with open(file_path, "wb") as f:
        f.write(file_bytes)

    try:
        extracted = extract_text(file_bytes, ext)
        try:
            result = grade_resume_with_ai(extracted)
            print(f"[GEMINI SUCCESS - resume]: {result}")
        except Exception as e:
            print(f"[GEMINI ERROR - resume]: {e}")
            result = score_resume(extracted)
        extraction_status = "Completed"
    except Exception as e:
        print(f"[EXTRACTION ERROR]: {e}")
        extracted = ""
        result = None
        extraction_status = "Failed"

    resume = Resume(
        student_id=student_id,
        file_path=file_path,
        file_name=filename,
        file_type=ext,
        extracted_text=extracted,
        extraction_status=extraction_status,
        resume_quality_score=result.get("resume_quality_score", 0) if result else None,
        ats_compatibility_score=result.get("ats_compatibility_score", 0) if result else None,
        is_latest=True,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    evaluation = None
    if result:
        evaluation = ResumeEvaluation(
            resume_id=resume.resume_id,
            resume_quality_score=result.get("resume_quality_score", 0),
            ats_compatibility_score=result.get("ats_compatibility_score", 0),
            resume_score_breakdown=result.get("resume_score_breakdown", {}),
            ats_score_breakdown=result.get("ats_score_breakdown", {}),
            missing_sections=result.get("missing_sections", []),
            detected_issues=result.get("detected_issues", []),
            improvement_suggestions=result.get("improvement_suggestions", ""),
            evaluation_status="Completed",
        )
        db.add(evaluation)
        db.commit()

    skills_found = []
    if extracted:
        skills_found = extract_skills(extracted)
        for skill in skills_found:
            db.add(ResumeSkill(resume_id=resume.resume_id, **skill))
        db.commit()

    return {
        "resume_id": resume.resume_id,
        "student_id": resume.student_id,
        "file_name": resume.file_name,
        "file_type": resume.file_type,
        "resume_quality_score": resume.resume_quality_score,
        "ats_compatibility_score": resume.ats_compatibility_score,
        "extraction_status": resume.extraction_status,
        "evaluation": result,
        "skills": skills_found,
    }


@router.get("/latest/{student_id}", response_model=ResumeOut)
def get_latest_resume(student_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.student_id == student_id, Resume.is_latest == True).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found for this student.")

    evaluation = (
        db.query(ResumeEvaluation)
        .filter(ResumeEvaluation.resume_id == resume.resume_id)
        .order_by(ResumeEvaluation.evaluated_at.desc())
        .first()
    )

    eval_data = None
    if evaluation:
        eval_data = {
            "resume_quality_score": evaluation.resume_quality_score,
            "ats_compatibility_score": evaluation.ats_compatibility_score,
            "resume_score_breakdown": evaluation.resume_score_breakdown,
            "ats_score_breakdown": evaluation.ats_score_breakdown,
            "missing_sections": evaluation.missing_sections,
            "detected_issues": evaluation.detected_issues,
            "improvement_suggestions": evaluation.improvement_suggestions,
        }

    skill_rows = db.query(ResumeSkill).filter(ResumeSkill.resume_id == resume.resume_id).all()
    skills = [
        {
            "skill_name": s.skill_name,
            "skill_category": s.skill_category,
            "confidence_score": s.confidence_score,
        }
        for s in skill_rows
    ]

    return {
        "resume_id": resume.resume_id,
        "student_id": resume.student_id,
        "file_name": resume.file_name,
        "file_type": resume.file_type,
        "resume_quality_score": resume.resume_quality_score,
        "ats_compatibility_score": resume.ats_compatibility_score,
        "extraction_status": resume.extraction_status,
        "evaluation": eval_data,
        "skills": skills,
    }


@router.get("/{resume_id}/report")
def download_resume_report(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.resume_id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    student = db.query(Student).filter(Student.student_id == resume.student_id).first()
    evaluation = (
        db.query(ResumeEvaluation)
        .filter(ResumeEvaluation.resume_id == resume_id)
        .order_by(ResumeEvaluation.evaluated_at.desc())
        .first()
    )
    skill_rows = db.query(ResumeSkill).filter(ResumeSkill.resume_id == resume_id).all()
    skills = [{"skill_name": s.skill_name} for s in skill_rows]

    pdf_buffer = generate_resume_report(
        student_name=student.fullname if student else "Unknown",
        file_name=resume.file_name,
        resume_quality_score=resume.resume_quality_score or 0,
        ats_compatibility_score=resume.ats_compatibility_score or 0,
        missing_sections=evaluation.missing_sections if evaluation else [],
        detected_issues=evaluation.detected_issues if evaluation else [],
        improvement_suggestions=evaluation.improvement_suggestions if evaluation else "",
        skills=skills,
    )

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=resume_report_{resume_id}.pdf"},
    )