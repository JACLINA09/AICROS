"""
Career readiness calculator — combines all four score inputs into one
final compatibility score, using the weighting:

    Resume Quality  x 0.15
  + ATS Compatibility x 0.10
  + Skill Match       x 0.25
  + Simulation Score  x 0.50
  = Career Readiness Score
"""

WEIGHTS = {
    "resume_quality": 0.15,
    "ats_compatibility": 0.10,
    "skill_match": 0.25,
    "simulation": 0.50,
}


def calculate_career_readiness(resume_quality_score: int, ats_compatibility_score: int,
                                 skill_match_score: int, simulation_score: int) -> int:
    weighted_total = (
        resume_quality_score * WEIGHTS["resume_quality"]
        + ats_compatibility_score * WEIGHTS["ats_compatibility"]
        + skill_match_score * WEIGHTS["skill_match"]
        + simulation_score * WEIGHTS["simulation"]
    )
    return round(weighted_total)