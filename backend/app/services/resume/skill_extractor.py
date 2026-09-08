"""
Skill extraction service.

This is a keyword-matching approach — it checks the resume text against a
known skill taxonomy list. This is a simpler, faster-to-build stand-in for
the spaCy-based NLP approach mentioned in the thesis; it can be swapped for
real NLP later without changing anything else in the pipeline (the output
shape stays identical).
"""

import re

SKILL_TAXONOMY = {
    "Programming Languages": ["Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "PHP", "Go", "Ruby", "Swift", "Kotlin"],
    "Web & Frameworks": ["React", "React.js", "Vue", "Angular", "Node.js", "Express", "Django", "Flask", "FastAPI", "Laravel", "Spring Boot", "Next.js"],
    "Databases": ["MySQL", "PostgreSQL", "MongoDB", "SQLite", "Redis", "Oracle", "SQL"],
    "Cloud & DevOps": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Git", "GitHub"],
    "Data & AI": ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas", "NumPy", "spaCy", "NLP", "Data Analysis"],
    "Tools & Other": ["REST API", "GraphQL", "Agile", "Scrum", "Figma", "Postman", "Linux", "HTML", "CSS"],
}


def extract_skills(text: str) -> list[dict]:
    found = []
    lower_text = text.lower()

    for category, skills in SKILL_TAXONOMY.items():
        for skill in skills:
            pattern = r"\b" + re.escape(skill.lower()) + r"\b"
            match = re.search(pattern, lower_text)
            if match:
                start = max(0, match.start() - 30)
                end = min(len(text), match.end() + 30)
                found.append({
                    "skill_name": skill,
                    "skill_category": category,
                    "confidence_score": 90,  # keyword match = high confidence; NLP version could vary this
                    "source_text": text[start:end].strip().replace("\n", " "),
                })

    return found