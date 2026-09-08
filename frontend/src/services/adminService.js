const API_BASE_URL = "http://localhost:8000";

export async function loginAdmin(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
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

export async function getIndustryAccounts(adminId) {
  const res = await fetch(`${API_BASE_URL}/auth/admin/${adminId}/industry-accounts`);
  if (!res.ok) throw new Error("Failed to load industry accounts.");
  return res.json();
}

export async function approveIndustry(industryId, adminId) {
  const res = await fetch(`${API_BASE_URL}/auth/admin/industry-accounts/${industryId}/approve?admin_id=${adminId}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to approve account.");
  return res.json();
}

export async function rejectIndustry(industryId) {
  const res = await fetch(`${API_BASE_URL}/auth/admin/industry-accounts/${industryId}/reject`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to reject account.");
  return res.json();
}

export async function getCourses() {
  const res = await fetch(`${API_BASE_URL}/upskilling`);
  if (!res.ok) throw new Error("Failed to load courses.");
  return res.json();
}

export async function createCourse(data) {
  const res = await fetch(`${API_BASE_URL}/upskilling`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to create course.");
  }
  return res.json();
}

export async function deleteCourse(courseId) {
  const res = await fetch(`${API_BASE_URL}/upskilling/${courseId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete course.");
  return res.json();
}