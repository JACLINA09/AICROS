"""
Resume parsing + scoring service.

This is a simplified, rule-based first version — it extracts real text from
PDF/DOCX and checks for real structural signals (sections, bullet points,
contact info, length). It does not yet use spaCy for NLP skill extraction —
that is a natural next refinement once this base pipeline is working end to end.
"""

import fitz  # PyMuPDF
import docx
import re


def extract_text(file_bytes: bytes, file_type: str) -> str:
    if file_type == "PDF":
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = "\n".join(page.get_text() for page in doc)
        doc.close()
        return text

    if file_type == "DOCX":
        import io
        document = docx.Document(io.BytesIO(file_bytes))
        return "\n".join(p.text for p in document.paragraphs)

    raise ValueError(f"Unsupported file type: {file_type}")


SECTION_KEYWORDS = {
    "contact": ["email", "phone", "linkedin"],
    "education": ["education", "university", "degree", "bachelor", "diploma"],
    "experience": ["experience", "internship", "work history"],
    "skills": ["skills", "technical skills", "competencies"],
}


def detect_missing_sections(text: str) -> list[str]:
    lower_text = text.lower()
    missing = []
    for section, keywords in SECTION_KEYWORDS.items():
        if not any(keyword in lower_text for keyword in keywords):
            missing.append(section)
    return missing


def score_resume(text: str) -> dict:
    lower_text = text.lower()
    word_count = len(text.split())
    missing_sections = detect_missing_sections(text)
    has_bullets = bool(re.search(r"[•\-\*]\s", text))
    has_email = bool(re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text))
    has_phone = bool(re.search(r"(\+?\d[\d\s\-]{7,}\d)", text))

    # --- Resume quality score (content/writing quality signals) ---
    quality_breakdown = {
        "has_reasonable_length": 20 if 150 <= word_count <= 1200 else 5,
        "uses_bullet_points": 20 if has_bullets else 0,
        "sections_present": 20 * (len(SECTION_KEYWORDS) - len(missing_sections)) // len(SECTION_KEYWORDS),
        "has_contact_info": 20 if (has_email and has_phone) else 10 if (has_email or has_phone) else 0,
        "no_excessive_length": 20 if word_count <= 1500 else 5,
    }
    resume_quality_score = sum(quality_breakdown.values())

    # --- ATS compatibility score (structural/parseability signals) ---
    ats_breakdown = {
        "text_extractable": 30 if word_count > 30 else 0,  # if we got almost no text, ATS likely can't parse it either
        "standard_sections_detected": 30 * (len(SECTION_KEYWORDS) - len(missing_sections)) // len(SECTION_KEYWORDS),
        "contact_info_findable": 20 if has_email else 0,
        "reasonable_structure": 20 if has_bullets else 5,
    }
    ats_compatibility_score = sum(ats_breakdown.values())

    detected_issues = []
    if not has_email:
        detected_issues.append("No email address detected — recruiters may not be able to contact you.")
    if not has_bullets:
        detected_issues.append("No bullet points detected — ATS systems and recruiters scan bullet-formatted experience faster.")
    if word_count < 150:
        detected_issues.append("Resume content seems very short — consider adding more detail to your experience.")

    suggestions = []
    if missing_sections:
        suggestions.append(f"Consider adding a clear {', '.join(missing_sections)} section.")
    if not has_bullets:
        suggestions.append("Use bullet points to list responsibilities and achievements.")
    if word_count > 1200:
        suggestions.append("Your resume may be too long — aim for 1-2 pages of concise content.")
    if not suggestions:
        suggestions.append("Your resume covers the key structural basics well — consider quantifying achievements with numbers where possible.")

    return {
        "resume_quality_score": min(resume_quality_score, 100),
        "ats_compatibility_score": min(ats_compatibility_score, 100),
        "resume_score_breakdown": quality_breakdown,
        "ats_score_breakdown": ats_breakdown,
        "missing_sections": missing_sections,
        "detected_issues": detected_issues,
        "improvement_suggestions": " ".join(suggestions),
    }