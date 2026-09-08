"""
The AI Career Advisor agent — uses Gemini's automatic function calling to
decide which tool(s) to call based on the student's question, execute them,
and produce a grounded, evidence-based answer.

The agent never invents scores itself — it only reports numbers that came
back from a tool call, which are the same calculated values shown elsewhere
in the app (resume evaluation, career portfolio, etc.).
"""

import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
import time 

from app.services.ai.agent_tools import (
    get_resume_analysis, get_student_skills, get_job_recommendations,
    get_skill_gap, get_simulation_results, get_readiness_score,
    get_learning_resources, get_job_details,
)
from app.services.ai.gemini_service import sanitize_input

load_dotenv()

#Setup and Tools Importing
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_NAME = "gemini-flash-latest"

TOOLS = [
    get_resume_analysis, get_student_skills, get_job_recommendations,
    get_skill_gap, get_simulation_results, get_readiness_score,
    get_learning_resources, get_job_details,
] #standard python function imported from application


SYSTEM_INSTRUCTION_TEMPLATE = """You are the AI-CROS Career Advisor, helping a university student
understand and improve their job readiness.

Rules:
- The current student's student_id is {student_id}. Always use this exact
  student_id when calling any tool that requires one.
- {job_context}
- NEVER invent or guess a score. Always call the relevant tool to get real,
  calculated data before answering any question involving a score, skill,
  or readiness level.
- After calling tools, explain the results in plain, encouraging, specific
  language — reference the actual numbers and skill names returned.
- If a tool reports the student has no resume yet, tell them to upload one first.
- You do not autonomously apply to jobs on the student's behalf — only the
  student can do that.
- Keep answers concise (2-5 sentences) unless the student asks for a detailed plan.
"""


def chat_with_agent(student_id: int, message: str, history: list[dict], active_job_id: int | None = None) -> str:
    safe_message, _ = sanitize_input(message)

    job_context = (
        f"The student's currently selected job_id is {active_job_id} — use this "
        f"if the student refers to 'this job' or doesn't specify one."
        if active_job_id else
        "No specific job is currently selected — if the student asks about "
        "readiness or skill gap for a specific role without naming one, call "
        "get_job_recommendations first to find a relevant job."
    )
    system_instruction = SYSTEM_INSTRUCTION_TEMPLATE.format(student_id=student_id, job_context=job_context)

    contents = []
    for turn in history:
        role = "user" if turn["role"] == "user" else "model"
        contents.append(types.Content(role=role, parts=[types.Part(text=turn["content"])]))
    contents.append(types.Content(role="user", parts=[types.Part(text=safe_message)]))

    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        tools=TOOLS,
        temperature=0.4,
    )

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(model=MODEL_NAME, contents=contents, config=config)
            return response.text
        except Exception as e:
            is_last_attempt = attempt == max_retries - 1
            if "503" in str(e) or "UNAVAILABLE" in str(e):
                if is_last_attempt:
                    raise Exception("The AI service is experiencing high demand right now. Please try again in a moment.")
                time.sleep(2 * (attempt + 1))  # wait 2s, then 4s, then 6s between retries
            else:
                raise  # a different error — don't retry, surface it immediately