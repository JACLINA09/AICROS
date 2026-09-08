from fastapi import APIRouter, HTTPException
from app.schemas.agent import AgentChatRequest, AgentChatResponse
from app.services.ai.career_advisor_agent import chat_with_agent

router = APIRouter(prefix="/agent", tags=["agent"])


@router.post("/chat", response_model=AgentChatResponse)
def chat(data: AgentChatRequest):
    try:
        history_dicts = [{"role": m.role, "content": m.content} for m in data.history]
        reply = chat_with_agent(data.student_id, data.message, history_dicts, data.active_job_id)
        return {"reply": reply}
    except Exception as e:
        print(f"[AGENT ERROR]: {e}")
        raise HTTPException(status_code=500, detail="The career advisor is temporarily unavailable. Please try again.")