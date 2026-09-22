const API_BASE_URL = "http://localhost:8000";

export async function getJobs(studentId) {
  const res = await fetch(`${API_BASE_URL}/jobs?student_id=${studentId}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to load jobs.");
  }
  return res.json();
}

export async function getJobDetail(jobId, studentId) {
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}?student_id=${studentId}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to load job.");
  }
  return res.json();
}

export async function applyToJob(studentId, resumeId, jobId) {
  const res = await fetch(`${API_BASE_URL}/jobs/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId, resume_id: resumeId, job_id: jobId }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to apply.");
  }
  return res.json();
}

export async function getMyApplications(studentId) {
  const res = await fetch(`${API_BASE_URL}/jobs/applications/${studentId}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to load applications.");
  }
  return res.json();
}

export async function getStudentCalendarEvents(studentId) {
  const res = await fetch(`${API_BASE_URL}/jobs/calendar/${studentId}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to load calendar events.");
  }
  return res.json();
}