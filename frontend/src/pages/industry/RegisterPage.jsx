import { useState } from "react";
import { registerIndustry } from "../../services/industryService";

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F7F5", fontFamily: "'Inter', system-ui, sans-serif", padding: 20 },
  card: { width: 400, background: "white", borderRadius: 16, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" },
  logo: { display: "flex", justifyContent: "center", marginBottom: 28, fontSize: 22, fontWeight: 800, background: "linear-gradient(90deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  label: { fontSize: 12.5, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0E0E0", fontSize: 14, marginBottom: 14, boxSizing: "border-box" },
  primaryButton: { width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #2563eb, #7c3aed)", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 6 },
  error: { color: "#dc2626", fontSize: 12.5, marginTop: 10, textAlign: "center" },
  success: { color: "#16a34a", fontSize: 13, marginTop: 12, textAlign: "center", lineHeight: 1.6 },
  footerText: { fontSize: 12, color: "#888", textAlign: "center", marginTop: 16 },
  link: { color: "#2563eb", fontWeight: 600, cursor: "pointer" },
};

function IndustryRegisterPage({ onBackToLogin, onHomeClick }) {
  const [form, setForm] = useState({ company_name: "", contact_person: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleRegister = async () => {
    setError("");
    if (!form.company_name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Company name, email, and password are required.");
      return;
    }
    setLoading(true);
    try {
      await registerIndustry(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={{ width: 400 }}>
        <button type="button" onClick={onHomeClick} title="Back to homepage" style={{ ...styles.logo, border: "none", background: "transparent", cursor: "pointer", width: "100%" }}>AI-CROS</button>
        <div style={styles.card}>
          <h2 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 4px" }}>Register your company</h2>
          <p style={{ fontSize: 13.5, color: "#666", margin: "0 0 18px" }}>Post jobs and review student applicants.</p>

          {submitted ? (
            <p style={styles.success}>
              Registration submitted! Your account is pending admin approval before you can log in.
            </p>
          ) : (
            <>
              <label style={styles.label}>Company name *</label>
              <input style={styles.input} value={form.company_name} onChange={update("company_name")} placeholder="Acme Sdn Bhd" />

              <label style={styles.label}>Contact person</label>
              <input style={styles.input} value={form.contact_person} onChange={update("contact_person")} placeholder="Full name" />

              <label style={styles.label}>Email *</label>
              <input style={styles.input} value={form.email} onChange={update("email")} placeholder="hr@company.com" />

              <label style={styles.label}>Password *</label>
              <input type="password" style={styles.input} value={form.password} onChange={update("password")} placeholder="••••••••" />

              <button style={styles.primaryButton} onClick={handleRegister} disabled={loading}>
                {loading ? "Submitting..." : "Register →"}
              </button>
              {error && <p style={styles.error}>{error}</p>}
            </>
          )}
        </div>
        <p style={styles.footerText}>
          <span style={styles.link} onClick={onBackToLogin}>← Back to login</span>
        </p>
      </div>
    </div>
  );
}

export default IndustryRegisterPage;