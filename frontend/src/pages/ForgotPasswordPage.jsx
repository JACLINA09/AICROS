import { useState } from "react";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f4f2",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: 20,
    boxSizing: "border-box",
  },
  wrapper: {
    width: "100%",
    maxWidth: 420,
  },
  logoGroup: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  logoImg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    objectFit: "contain",
  },
  logoText: {
    fontSize: 22,
    fontWeight: 850,
    color: "#1c1917",
    letterSpacing: "-0.4px",
  },
  card: {
    width: "100%",
    background: "#ffffff",
    borderRadius: 24,
    padding: "36px 32px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e7e5e4",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: 22,
    fontWeight: 850,
    color: "#0f172a",
    margin: "0 0 6px",
    letterSpacing: "-0.5px",
  },
  subheading: {
    fontSize: 13.5,
    color: "#64748b",
    margin: "0 0 24px",
    lineHeight: 1.5,
  },
  label: {
    fontSize: 12.5,
    fontWeight: 750,
    color: "#334155",
    display: "block",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    height: 44,
    padding: "0 14px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    background: "#fafaf9",
    color: "#0f172a",
    fontSize: 13.5,
    marginBottom: 16,
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
  },
  primaryButton: {
    width: "100%",
    minHeight: 48,
    borderRadius: 10,
    border: "none",
    background: "#0284c7",
    color: "white",
    fontWeight: 750,
    fontSize: 14,
    cursor: "pointer",
    marginTop: 8,
    boxShadow: "0 4px 15px rgba(2, 132, 199, 0.25)",
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
    borderRadius: 8,
    border: "1px solid rgba(239, 68, 68, 0.3)",
    background: "rgba(239, 68, 68, 0.08)",
    color: "#dc2626",
    fontSize: 12,
  },
  success: {
    margin: "14px 0 0",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid rgba(34, 197, 94, 0.3)",
    background: "rgba(34, 197, 94, 0.08)",
    color: "#16a34a",
    fontSize: 12,
    lineHeight: 1.45,
  },
  footerText: { fontSize: 12.5, color: "#64748b", textAlign: "center", marginTop: 24 },
  link: { color: "#0284c7", fontWeight: 750, cursor: "pointer", background: "transparent", border: "none", padding: 0, fontFamily: "inherit", fontSize: "inherit" },
};

function ForgotPasswordPage({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // TODO: Connect to your backend forgot password route
      // e.g., await requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      setError("Failed to send reset instructions. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.logoGroup}>
          <img src="/ai-cros-logo.png" alt="AI-CROS Logo" style={styles.logoImg} />
          <div style={styles.logoText}>AI-CROS</div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.heading}>Reset your password</h2>
          <p style={styles.subheading}>
            {!submitted
              ? "Enter your email address and we'll send you instructions to reset your password."
              : "If an account exists with this email, reset instructions have been dispatched."}
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Email address</label>
              <input
                type="email"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@umpsa.edu.my"
                disabled={loading}
              />

              <button
                type="submit"
                style={{
                  ...styles.primaryButton,
                  ...(loading ? styles.disabledButton : {}),
                }}
                disabled={loading}
              >
                {loading ? "Sending instructions..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div style={styles.success}>
              Check your inbox (and spam folder) for the password recovery link.
            </div>
          )}

          {error && <div style={styles.error}>{error}</div>}
        </div>

        <p style={styles.footerText}>
          Remember your password?{" "}
          <button style={styles.link} onClick={onBackToLogin} type="button">
            Back to login
          </button>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;