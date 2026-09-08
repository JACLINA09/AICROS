const API_BASE_URL = "http://localhost:8000";

export async function registerIndustry(data) {
  const res = await fetch(`${API_BASE_URL}/auth/industry/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Registration failed.");
  }
  return res.json();
}

export async function loginIndustry(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/industry/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Login failed.");
  }
  return res.json();
}

export async function createJob(jobData) {
  const res = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to post job.");
  }
  return res.json();
}

export async function getJobsByIndustry(industryId) {
  const res = await fetch(`${API_BASE_URL}/jobs/industry/${industryId}`);
  if (!res.ok) throw new Error("Failed to load jobs.");
  return res.json();
}

export async function getApplicants(industryId) {
  const res = await fetch(`${API_BASE_URL}/jobs/industry/${industryId}/applicants`);
  if (!res.ok) throw new Error("Failed to load applicants.");
  return res.json();
}

export async function updateApplicationStatus(applicationId, status) {
  const res = await fetch(`${API_BASE_URL}/jobs/applications/${applicationId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ application_status: status }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to update status.");
  }
  return res.json();
}

export async function createSimulationTask(taskData) {
  const res = await fetch(`${API_BASE_URL}/simulations/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to create task.");
  }
  return res.json();
}