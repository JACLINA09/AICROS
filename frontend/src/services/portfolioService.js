const API_BASE_URL = "http://localhost:8000";

export async function getPortfolio(studentId, jobId) {
  const res = await fetch(`${API_BASE_URL}/portfolios/${studentId}/${jobId}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to load portfolio.");
  }
  return res.json();
}
