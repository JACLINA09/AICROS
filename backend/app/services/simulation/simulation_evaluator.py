"""
Simulation grading service.

Objective questions: exact-match (case-insensitive, whitespace-trimmed) against
correct_answer. Open-Ended questions: keyword-overlap scoring against the
evaluation_guide — a lightweight stand-in for a real AI-graded rubric, same
approach as the resume scoring service. Swappable for a Gemini-based grader
later without changing the API shape.
"""

import re


def grade_objective(student_answer: str, correct_answer: str) -> dict:
    is_correct = student_answer.strip().lower() == correct_answer.strip().lower()
    return {
        "task_score": 100 if is_correct else 0,
        "ai_feedback": "Correct!" if is_correct else f"Incorrect. The correct answer was: {correct_answer}",
    }


def grade_open_ended(student_answer: str, evaluation_guide: str) -> dict:
    if not student_answer or len(student_answer.strip().split()) < 5:
        return {
            "task_score": 0,
            "ai_feedback": "Answer is too short to evaluate. Please provide a more detailed explanation.",
        }

    guide_keywords = set(re.findall(r"[a-zA-Z]{4,}", evaluation_guide.lower()))
    answer_words = set(re.findall(r"[a-zA-Z]{4,}", student_answer.lower()))

    matched = guide_keywords & answer_words
    score = round((len(matched) / len(guide_keywords)) * 100) if guide_keywords else 50
    score = min(score, 100)

    if score >= 70:
        feedback = "Strong answer — you covered most of the key concepts expected."
    elif score >= 40:
        feedback = "Reasonable answer, but missing some key concepts. Consider being more specific."
    else:
        feedback = "Your answer is missing several key concepts expected for this question."

    return {"task_score": score, "ai_feedback": feedback}