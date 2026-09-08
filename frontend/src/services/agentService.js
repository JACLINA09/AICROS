const API_BASE_URL = "http://localhost:8000";

export async function sendAgentMessage(studentId, message, history, activeJobId = null) {
  const res = await fetch(`${API_BASE_URL}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: studentId,
      message,
      history,
      active_job_id: activeJobId,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "The advisor is temporarily unavailable.");
  }
  return res.json();
}