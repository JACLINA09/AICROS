from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.upskilling_course import UpskillingCourse
from app.schemas.upskilling import UpskillingCourseCreate, UpskillingCourseOut
from app.services.ai.embedding_service import generate_embedding
from app.services.ai.rag_service import find_relevant_courses   

router = APIRouter(prefix="/upskilling", tags=["upskilling"])


@router.post("", response_model=UpskillingCourseOut)
def create_course(data: UpskillingCourseCreate, db: Session = Depends(get_db)):
    course = UpskillingCourse(**data.dict())

    embedding_text = f"{data.course_title}. Skill: {data.target_skill}. {data.course_description or ''}"
    try:
        course.embedding = generate_embedding(embedding_text)
    except Exception as e:
        print(f"[EMBEDDING ERROR]: {e}")
        course.embedding = None

    db.add(course)
    db.commit()
    db.refresh(course)
    return course

@router.get("", response_model=list[UpskillingCourseOut])
def list_courses(db: Session = Depends(get_db)):
    return db.query(UpskillingCourse).all()


@router.get("/semantic-search")
def semantic_search(query: str, top_k: int = 3, db: Session = Depends(get_db)):
    try:
        results = find_relevant_courses(db, query, top_k)
        return {"results": results}
    except Exception as e:
        print(f"[RAG SEARCH ERROR]: {e}")
        # fallback to simple keyword search if embeddings fail
        courses = db.query(UpskillingCourse).filter(UpskillingCourse.target_skill.ilike(f"%{query}%")).limit(top_k).all()
        return {"results": [{"course_title": c.course_title, "provider": c.provider, "course_url": c.course_url, "target_skill": c.target_skill, "relevance_score": None} for c in courses]}

@router.delete("/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(UpskillingCourse).filter(UpskillingCourse.course_id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")
    db.delete(course)
    db.commit()
    return {"status": "deleted"}

@router.post("/backfill-embeddings")
def backfill_embeddings(db: Session = Depends(get_db)):
    courses = db.query(UpskillingCourse).filter(UpskillingCourse.embedding.is_(None)).all()
    updated = 0
    for course in courses:
        embedding_text = f"{course.course_title}. Skill: {course.target_skill}. {course.course_description or ''}"
        try:
            course.embedding = generate_embedding(embedding_text)
            updated += 1
        except Exception as e:
            print(f"[BACKFILL ERROR for course {course.course_id}]: {e}")
    db.commit()
    return {"updated": updated, "total_missing": len(courses)}