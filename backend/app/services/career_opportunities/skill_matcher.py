"""
Skill matching / compatibility calculator.

Compares a student's extracted resume skills against a job's required
skills, using simple case-insensitive matching.
"""


def calculate_compatibility(resume_skills: list[str], job_required_skills: list[str]) -> dict:
    resume_set = {s.strip().lower() for s in resume_skills}
    job_set = {s.strip().lower() for s in job_required_skills}

    if not job_set:
        return {"compatibility_score": 0, "matched_skills": [], "missing_skills": []}

    matched = job_set & resume_set
    missing = job_set - resume_set

    compatibility_score = round((len(matched) / len(job_set)) * 100)

    return {
        "compatibility_score": compatibility_score,
        "matched_skills": sorted(matched),
        "missing_skills": sorted(missing),
    }