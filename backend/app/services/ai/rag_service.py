"""
RAG retrieval for upskilling course recommendations.

Retrieval: find the top-k most semantically similar courses to a query.
Generation: the caller (e.g. the AI Career Advisor) uses these retrieved
courses as grounded context when generating its recommendation — this
combination is what makes it genuinely RAG, not just a database lookup.
"""

from sqlalchemy.orm import Session
from app.models.upskilling_course import UpskillingCourse
from app.services.ai.embedding_service import generate_embedding, cosine_similarity


def find_relevant_courses(db: Session, query_text: str, top_k: int = 3) -> list[dict]:
    query_embedding = generate_embedding(query_text)

    courses = db.query(UpskillingCourse).filter(UpskillingCourse.embedding.isnot(None)).all()

    scored = []
    for course in courses:
        similarity = cosine_similarity(query_embedding, course.embedding)
        scored.append((similarity, course))

    scored.sort(key=lambda x: x[0], reverse=True)

    return [
        {
            "course_title": c.course_title,
            "provider": c.provider,
            "course_url": c.course_url,
            "target_skill": c.target_skill,
            "relevance_score": round(similarity, 3),
        }
        for similarity, c in scored[:top_k]
    ]