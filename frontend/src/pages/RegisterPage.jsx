import { useState } from "react";
import { register } from "../services/authService";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0d1117",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: 20,
    boxSizing: "border-box",
  },
  wrapper: {
    width: "100%",
    maxWidth: 460,
  },
  logo: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 24,
    fontSize: 24,
    fontWeight: 850,
    color: "#f8fafc",
    letterSpacing: "-0.4px",
  },
  card: {
    width: "100%",
    background: "#161b22",
    borderRadius: 24,
    padding: "36px 32px",
    boxShadow: "0 24px 70px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: 22,
    fontWeight: 850,
    color: "#f8fafc",
    margin: "0 0 6px",
    letterSpacing: "-0.5px",
  },
  subheading: {
    fontSize: 13.5,
    color: "#94a3b8",
    margin: "0 0 24px",
    lineHeight: 1.5,
  },
  label: {
    fontSize: 12.5,
    fontWeight: 700,
    color: "#cbd5e1",
    display: "block",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    height: 44,
    padding: "0 14px",
    borderRadius: 12,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "#0d1117",
    color: "#f8fafc",
    fontSize: 13.5,
    marginBottom: 16,
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  row: { display: "flex", gap: 12 },
  primaryButton: {
    width: "100%",
    minHeight: 48,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(90deg, #22c55e, #16a34a)",
    color: "white",
    fontWeight: 750,
    fontSize: 14,
    cursor: "pointer",
    marginTop: 8,
    boxShadow: "0 10px 25px rgba(34, 197, 94, 0.25)",
    transition: "transform 0.2s ease, opacity 0.2s ease",
  },
  disabledButton: {
    opacity: 0.65,
    cursor: "not-allowed",
  },
  error: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    margin: "14px 0 0",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(239, 68, 68, 0.3)",
    background: "rgba(239, 68, 68, 0.1)",
    color: "#f87171",
    fontSize: 12,
    lineHeight: 1.45,
  },
  footerText: { fontSize: 12.5, color: "#94a3b8", textAlign: "center", marginTop: 24 },
  link: { color: "#4ade80", fontWeight: 750, cursor: "pointer", background: "transparent", border: "none", padding: 0, fontFamily: "inherit", fontSize: "inherit" },
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
  const [focusedField, setFocusedField] = useState("");

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (error) setError("");
  };

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

  const inputFocusStyle = (fieldName) =>
    focusedField === fieldName
      ? {
          borderColor: "#22c55e",
          boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.15)",
          background: "#0d1117",
        }
      : {};

  return (
    <>
      <style>
        {`
          .ai-cros-register-btn:hover:not(:disabled) {
            transform: translateY(-1px);
          }
          .ai-cros-reg-link:hover {
            text-decoration: underline;
          }
        `}
      </style>
      <div style={styles.page}>
        <div style={styles.wrapper}>
          <div style={styles.logo}>AI-CROS</div>
          <div style={styles.card}>
            <h2 style={styles.heading}>Create your account</h2>
            <p style={styles.subheading}>Register as a student to get started.</p>

            <label style={styles.label}>Full name *</label>
            <input
              style={{ ...styles.input, ...inputFocusStyle("fullname") }}
              value={form.fullname}
              onChange={update("fullname")}
              onFocus={() => setFocusedField("fullname")}
              onBlur={() => setFocusedField("")}
              placeholder="Jaclina A/P S Jacob"
              disabled={loading}
            />

            <label style={styles.label}>Email *</label>
            <input
              style={{ ...styles.input, ...inputFocusStyle("email") }}
              type="email"
              value={form.email}
              onChange={update("email")}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField("")}
              placeholder="you@umpsa.edu.my"
              disabled={loading}
            />

            <label style={styles.label}>Password *</label>
            <input
              type="password"
              style={{ ...styles.input, ...inputFocusStyle("password") }}
              value={form.password}
              onChange={update("password")}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField("")}
              placeholder="••••••••"
              disabled={loading}
            />

            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Matric number</label>
                <input
                  style={{ ...styles.input, ...inputFocusStyle("matric_number") }}
                  value={form.matric_number}
                  onChange={update("matric_number")}
                  onFocus={() => setFocusedField("matric_number")}
                  onBlur={() => setFocusedField("")}
                  placeholder="CB23074"
                  disabled={loading}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Phone number</label>
                <input
                  style={{ ...styles.input, ...inputFocusStyle("phone_number") }}
                  value={form.phone_number}
                  onChange={update("phone_number")}
                  onFocus={() => setFocusedField("phone_number")}
                  onBlur={() => setFocusedField("")}
                  placeholder="012-3456789"
                  disabled={loading}
                />
              </div>
            </div>

            <label style={styles.label}>Programme</label>
            <input
              style={{ ...styles.input, ...inputFocusStyle("programme") }}
              value={form.programme}
              onChange={update("programme")}
              onFocus={() => setFocusedField("programme")}
              onBlur={() => setFocusedField("")}
              placeholder="Software Engineering"
              disabled={loading}
            />

            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>LinkedIn URL</label>
                <input
                  style={{ ...styles.input, ...inputFocusStyle("linkedin_url") }}
                  value={form.linkedin_url}
                  onChange={update("linkedin_url")}
                  onFocus={() => setFocusedField("linkedin_url")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Optional"
                  disabled={loading}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>GitHub URL</label>
                <input
                  style={{ ...styles.input, ...inputFocusStyle("github_url") }}
                  value={form.github_url}
                  onChange={update("github_url")}
                  onFocus={() => setFocusedField("github_url")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Optional"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              className="ai-cros-register-btn"
              style={{
                ...styles.primaryButton,
                ...(loading ? styles.disabledButton : {}),
              }}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register →"}
            </button>

            {error && (
              <div style={styles.error} role="alert">
                <span aria-hidden="true">⚠</span>
                <span>{error}</span>
              </div>
            )}
          </div>
          <p style={styles.footerText}>
            Already have an account?{" "}
            <button
              className="ai-cros-reg-link"
              style={styles.link}
              onClick={onBackToLogin}
              type="button"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;