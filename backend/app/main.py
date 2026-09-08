from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import auth, resumes, jobs, simulations, portfolios, upskilling, agent
from app.models import (
    student, industry, admin,
    resume, resume_evaluation, resume_skill,
    job, job_required_skill, job_application,
    simulation_task, simulation_attempt, student_task_submission,
    career_portfolio, upskilling_course
) 

app = FastAPI(title="AICROS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(resumes.router)
app.include_router(jobs.router)
app.include_router(simulations.router)
app.include_router(portfolios.router)
app.include_router(upskilling.router)
app.include_router(agent.router)


@app.get("/")
def root():
    return {"status": "AICROS API is running"}