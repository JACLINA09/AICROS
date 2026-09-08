import { useState } from "react";
import { register } from "../services/authService";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F7F7F5",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: 20,
  },
  card: {
    width: 420,
    background: "white",
    borderRadius: 16,
    padding: 28,
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  },
  logo: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 28,
    fontSize: 22,
    fontWeight: 800,
    background: "linear-gradient(90deg, #2563eb, #7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  label: { fontSize: 12.5, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #E0E0E0",
    fontSize: 14,
    marginBottom: 14,
    boxSizing: "border-box",
  },
  row: { display: "flex", gap: 10 },
  primaryButton: {
    width: "100%",
    padding: "12px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(90deg, #2563eb, #7c3aed)",
    color: "white",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    marginTop: 6,
  },
  error: { color: "#dc2626", fontSize: 12.5, marginTop: 10, textAlign: "center" },
  success: { color: "#16a34a", fontSize: 12.5, marginTop: 10, textAlign: "center" },
  footerText: { fontSize: 12, color: "#888", textAlign: "center", marginTop: 16 },
  link: { color: "#2563eb", fontWeight: 600, cursor: "pointer" },
};

function RegisterPage({ onRegisterSuccess, onBackToLogin }) {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    matric_number: "",
    phone_number: "",
    programme: "",
    linkedin_url: "",
    github_url: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleRegister = async () => {
    setError("");

    if (!form.fullname.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Fullname, email, and password are required.");
      return;
    }

    setLoading(true);
    try {
      const student = await register(form);
      onRegisterSuccess(student);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={{ width: 420 }}>
        <div style={styles.logo}>AI-CROS</div>
        <div style={styles.card}>
          <h2 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 4px" }}>Create your account</h2>
          <p style={{ fontSize: 13.5, color: "#666", margin: "0 0 18px" }}>Register as a student to get started.</p>

          <label style={styles.label}>Full name *</label>
          <input style={styles.input} value={form.fullname} onChange={update("fullname")} placeholder="Jaclina A/P S Jacob" />

          <label style={styles.label}>Email *</label>
          <input style={styles.input} value={form.email} onChange={update("email")} placeholder="you@umpsa.edu.my" />

          <label style={styles.label}>Password *</label>
          <input type="password" style={styles.input} value={form.password} onChange={update("password")} placeholder="••••••••" />

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Matric number</label>
              <input style={styles.input} value={form.matric_number} onChange={update("matric_number")} placeholder="CB23074" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Phone number</label>
              <input style={styles.input} value={form.phone_number} onChange={update("phone_number")} placeholder="012-3456789" />
            </div>
          </div>

          <label style={styles.label}>Programme</label>
          <input style={styles.input} value={form.programme} onChange={update("programme")} placeholder="Software Engineering" />

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>LinkedIn URL</label>
              <input style={styles.input} value={form.linkedin_url} onChange={update("linkedin_url")} placeholder="Optional" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>GitHub URL</label>
              <input style={styles.input} value={form.github_url} onChange={update("github_url")} placeholder="Optional" />
            </div>
          </div>

          <button style={styles.primaryButton} onClick={handleRegister} disabled={loading}>
            {loading ? "Creating account..." : "Register →"}
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </div>
        <p style={styles.footerText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={onBackToLogin}>Log in</span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;