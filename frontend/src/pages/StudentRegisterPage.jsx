import { useState } from "react";
import { register } from "../services/authService";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eaf1f7",
    fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif",
    padding: 20,
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    background: "#f5f1e6",
    border: "1px solid #c7d7e4",
    borderRadius: 12,
    padding: "36px 32px",
    boxShadow: "0 10px 24px rgba(23, 50, 77, 0.12)",
    boxSizing: "border-box",
  },
  brand: { textAlign: "center", marginBottom: 26 },
  logo: { width: 38, height: 38, objectFit: "contain", verticalAlign: "middle", marginRight: 10 },
  brandText: { color: "#234e70", fontSize: 22, fontWeight: 850, verticalAlign: "middle" },
  heading: { color: "#17324d", fontSize: 24, margin: "0 0 6px" },
  subheading: { color: "#47647d", fontSize: 13.5, margin: "0 0 24px" },
  label: { display: "block", color: "#234e70", fontSize: 12.5, fontWeight: 750, marginBottom: 6 },
  input: {
    width: "100%",
    height: 44,
    padding: "0 12px",
    marginBottom: 15,
    borderRadius: 8,
    border: "1px solid #b8cddd",
    background: "#ffffff",
    color: "#17324d",
    fontSize: 13.5,
    boxSizing: "border-box",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  button: {
    width: "100%",
    minHeight: 46,
    marginTop: 8,
    border: "none",
    borderRadius: 8,
    background: "#1f5f8b",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 750,
    cursor: "pointer",
  },
  error: { color: "#b42318", background: "#fce8e6", padding: "10px 12px", borderRadius: 8, fontSize: 12.5, margin: "14px 0 0" },
  footer: { textAlign: "center", color: "#47647d", fontSize: 12.5, margin: "22px 0 0" },
  link: { border: "none", background: "transparent", color: "#1f5f8b", fontWeight: 750, cursor: "pointer", padding: 0 },
};

function StudentRegisterPage({ onRegisterSuccess, onBackToLogin, onHomeClick }) {
  const [form, setForm] = useState({ matric_number: "", fullname: "", email: "", password: "", phone_number: "", programme: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.matric_number.trim() || !form.fullname.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Matric number, full name, email, and password are required.");
      return;
    }
    setLoading(true);
    try {
      const student = await register({ ...form, phone_number: form.phone_number || null, programme: form.programme || null });
      onRegisterSuccess(student);
    } catch (requestError) {
      setError(requestError.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <button type="button" onClick={onHomeClick} title="Back to homepage" style={{ ...styles.brand, border: "none", background: "transparent", cursor: "pointer" }}>
          <img src="/ai-cros-logo.png" alt="AI-CROS Logo" style={styles.logo} />
          <span style={styles.brandText}>AI-CROS</span>
        </button>
        <h1 style={styles.heading}>Create your student account</h1>
        <p style={styles.subheading}>Build your profile and start your career readiness journey.</p>

        <div style={styles.row}>
          <div><label style={styles.label}>Matric number *</label><input style={styles.input} value={form.matric_number} onChange={update("matric_number")} /></div>
          <div><label style={styles.label}>Programme</label><input style={styles.input} value={form.programme} onChange={update("programme")} /></div>
        </div>
        <label style={styles.label}>Full name *</label>
        <input style={styles.input} value={form.fullname} onChange={update("fullname")} />
        <label style={styles.label}>Email *</label>
        <input type="email" style={styles.input} value={form.email} onChange={update("email")} />
        <div style={styles.row}>
          <div><label style={styles.label}>Phone</label><input style={styles.input} value={form.phone_number} onChange={update("phone_number")} /></div>
          <div><label style={styles.label}>Password *</label><input type="password" style={styles.input} value={form.password} onChange={update("password")} /></div>
        </div>
        <button type="submit" style={styles.button} disabled={loading}>{loading ? "Creating account..." : "Create Student Account"}</button>
        {error && <p style={styles.error} role="alert">{error}</p>}
        <p style={styles.footer}>Already have an account? <button type="button" style={styles.link} onClick={onBackToLogin}>Sign in</button></p>
      </form>
    </div>
  );
}

export default StudentRegisterPage;
