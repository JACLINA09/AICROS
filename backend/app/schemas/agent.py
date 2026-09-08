from pydantic import BaseModel
from typing import Optional, List


class ChatMessage(BaseModel):
    role: str  # "user" or "model"
    content: str


class AgentChatRequest(BaseModel):
    student_id: int
    message: str
    history: List[ChatMessage] = []
    active_job_id: Optional[int] = None


class AgentChatResponse(BaseModel):
    reply: str