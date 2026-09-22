const API_BASE_URL = "http://localhost:8000";

export async function getPublishedTasks() {
  const res = await fetch(`${API_BASE_URL}/simulations/tasks`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to load simulation tasks.");
  }
  return res.json();
}

export async function startAttempt(studentId, jobId) {
  const res = await fetch(`${API_BASE_URL}/simulations/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId, job_id: jobId }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to start simulation.");
  }
  return res.json();
}

export async function submitAnswer(attemptId, taskId, textAnswer) {
  const res = await fetch(`${API_BASE_URL}/simulations/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attempt_id: attemptId, task_id: taskId, text_answer: textAnswer }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to submit answer.");
  }
  return res.json();
}

export async function finishAttempt(attemptId) {
  const res = await fetch(`${API_BASE_URL}/simulations/finish/${attemptId}`, {
    method: "POST",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to finish simulation.");
  }
  return res.json();
}