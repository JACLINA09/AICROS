from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.simulation_task import SimulationTask
from app.models.simulation_attempt import StudentSimulationAttempt
from app.models.student_task_submission import StudentTaskSubmission
from app.models.job import Job
from app.schemas.simulation import (
    StartAttemptRequest, StartAttemptOut,
    SubmitAnswerRequest, SubmitAnswerOut,
    FinishAttemptOut, SimulationTaskOut, SimulationTaskCreate,
)
from app.services.ai.gemini_service import grade_open_ended_with_ai
from app.services.simulation.simulation_evaluator import grade_objective, grade_open_ended
from app.schemas.simulation import SimulationTaskCreate

router = APIRouter(prefix="/simulations", tags=["simulations"])


@router.get("/tasks", response_model=list[SimulationTaskOut])
def list_published_tasks(db: Session = Depends(get_db)):
    tasks = db.query(SimulationTask).filter(SimulationTask.task_status == "Published").all()
    return [
        {
            "task_id": task.task_id,
            "job_id": task.job_id,
            "job_title": job.job_title if job else "Career simulation",
            "task_title": task.task_title,
            "task_scenario": task.task_scenario,
            "instructions": task.instructions,
            "question_type": task.question_type,
            "time_limit_minutes": task.time_limit_minutes,
            "task_level": task.task_level,
        }
        for task in tasks
        for job in [db.query(Job).filter(Job.job_id == task.job_id).first()]
    ]


@router.post("/start", response_model=StartAttemptOut)
def start_attempt(data: StartAttemptRequest, db: Session = Depends(get_db)):
    tasks = db.query(SimulationTask).filter(
        SimulationTask.job_id == data.job_id,
        SimulationTask.task_status == "Published",
    ).all()
    if not tasks:
        raise HTTPException(status_code=404, detail="No simulation tasks found for this job.")

    previous_attempts = db.query(StudentSimulationAttempt).filter(
        StudentSimulationAttempt.student_id == data.student_id,
        StudentSimulationAttempt.job_id == data.job_id,
    ).count()

    attempt = StudentSimulationAttempt(
        student_id=data.student_id,
        job_id=data.job_id,
        attempt_number=previous_attempts + 1,
        attempt_status="Inprogress",
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return {"attempt_id": attempt.attempt_id, "job_id": data.job_id, "tasks": tasks}


@router.post("/submit", response_model=SubmitAnswerOut)
def submit_answer(data: SubmitAnswerRequest, db: Session = Depends(get_db)):
    task = db.query(SimulationTask).filter(SimulationTask.task_id == data.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    if task.question_type == "Objective":
        result = grade_objective(data.text_answer, task.correct_answer)
    else:
        try:
            result = grade_open_ended_with_ai(task.instructions, task.evaluation_guide or "", data.text_answer)
        except Exception as e:
            print(f"[GEMINI ERROR - simulation]: {e}")
            result = grade_open_ended(data.text_answer, task.evaluation_guide or "")  # fallback

    submission = StudentTaskSubmission(
        attempt_id=data.attempt_id,
        task_id=data.task_id,
        text_answer=data.text_answer,
        task_score=result["task_score"],
        ai_feedback=result["ai_feedback"],
    )
    db.add(submission)
    db.commit()

    return result


@router.post("/finish/{attempt_id}", response_model=FinishAttemptOut)
def finish_attempt(attempt_id: int, db: Session = Depends(get_db)):
    attempt = db.query(StudentSimulationAttempt).filter(StudentSimulationAttempt.attempt_id == attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found.")

    submissions = db.query(StudentTaskSubmission).filter(StudentTaskSubmission.attempt_id == attempt_id).all()
    if not submissions:
        raise HTTPException(status_code=400, detail="No answers submitted for this attempt yet.")

    overall_score = round(sum(s.task_score for s in submissions) / len(submissions))

    attempt.simulation_score = overall_score
    attempt.attempt_status = "Completed"
    db.commit()

    return {
        "attempt_id": attempt_id,
        "simulation_score": overall_score,
        "submissions": [{"task_score": s.task_score, "ai_feedback": s.ai_feedback} for s in submissions],
    }

@router.post("/tasks", response_model=SimulationTaskOut)
def create_task(data: SimulationTaskCreate, db: Session = Depends(get_db)):
    task = SimulationTask(
        industry_id=data.industry_id,
        job_id=data.job_id,
        task_title=data.task_title,
        task_scenario=data.task_scenario,
        instructions=data.instructions,
        question_type=data.question_type,
        correct_answer=data.correct_answer,
        evaluation_guide=data.evaluation_guide,
        task_level=data.task_level,
        time_limit_minutes=data.time_limit_minutes,
        task_status="Published",
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task