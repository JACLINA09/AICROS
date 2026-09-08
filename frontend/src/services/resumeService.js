const API_BASE_URL = "http://localhost:8000";

export async function uploadResume(studentId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/resumes/upload/${studentId}`, {
    method: "POST",
    body: formData, // no Content-Type header — the browser sets the correct multipart boundary automatically
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Resume upload failed.");
  }

  return res.json();
}

export async function getLatestResume(studentId) {
  const res = await fetch(`${API_BASE_URL}/resumes/latest/${studentId}`);

  if (res.status === 404) {
    return null; // no resume uploaded yet — not an error
  }
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to load resume.");
  }

  return res.json();
}

export function downloadResumeReport(resumeId) {
  window.open(`${API_BASE_URL}/resumes/${resumeId}/report`, "_blank");
}