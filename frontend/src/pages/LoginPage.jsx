import { useState } from "react";
import { login } from "../services/authService";
import ForgotPasswordPage from "./ForgotPasswordPage"; // Linked component import[cite: 3]

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eaf1f7",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    padding: "32px 20px",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: 940,
    minHeight: 580,
    display: "flex",
    overflow: "hidden",
    background: "#f5f1e6",
    borderRadius: 24,
    border: "1px solid #e7e5e4",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.06)",
  },

  leftPanel: {
    flex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 46,
    color: "#ffffff",
    background: "#1f5f8b",
    overflow: "hidden",
  },

  brand: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  logoMark: {
    width: 38,
    height: 38,
    display: "block",
    borderRadius: 8,
    objectFit: "contain",
  },

  brandButton: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "none",
    background: "transparent",
    padding: 0,
    color: "inherit",
    cursor: "pointer",
  },

  brandName: {
    fontSize: 22,
    fontWeight: 850,
    letterSpacing: "-0.4px",
    color: "#ffffff",
  },

  heroContent: {
    position: "relative",
    zIndex: 1,
    maxWidth: 360,
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "7px 12px",
    marginBottom: 20,
    borderRadius: 999,
    background: "rgba(56, 189, 248, 0.15)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    fontSize: 12,
    fontWeight: 700,
    color: "#38bdf8",
  },

  heroTitle: {
    margin: "0 0 16px",
    fontSize: 34,
    lineHeight: 1.15,
    letterSpacing: "-1px",
    fontWeight: 850,
    color: "#ffffff",
  },

  heroDescription: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: 14.5,
    lineHeight: 1.6,
  },

  leftFooter: {
    position: "relative",
    zIndex: 1,
    color: "#94a3b8",
    fontSize: 12,
  },

  formPanel: {
    width: 440,
    display: "flex",
    alignItems: "center",
    padding: "48px 44px",
    boxSizing: "border-box",
    background: "#ffffff",
  },

  formContent: {
    width: "100%",
  },

  mobileLogo: {
    display: "none",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
    color: "#0f172a",
    fontWeight: 850,
    fontSize: 20,
  },

  mobileLogoMark: {
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    objectFit: "contain",
  },

  heading: {
    margin: "0 0 6px",
    color: "#0f172a",
    fontSize: 26,
    fontWeight: 850,
    letterSpacing: "-0.6px",
  },

  subheading: {
    margin: "0 0 24px",
    color: "#64748b",
    fontSize: 13.5,
    lineHeight: 1.5,
  },

  label: {
    display: "block",
    marginBottom: 6,
    color: "#334155",
    fontSize: 12.5,
    fontWeight: 750,
  },

  fieldGroup: {
    marginBottom: 16,
  },

  inputWrapper: {
    position: "relative",
  },

  inputIcon: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    fontSize: 15,
    pointerEvents: "none",
  },

  input: {
    width: "100%",
    height: 46,
    padding: "0 44px 0 42px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    outline: "none",
    background: "#fafaf9",
    color: "#0f172a",
    fontFamily: "inherit",
    fontSize: 13.5,
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  passwordToggle: {
    position: "absolute",
    right: 13,
    top: "50%",
    transform: "translateY(-50%)",
    padding: 4,
    border: "none",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    fontSize: 15,
  },

  optionsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "2px 0 20px",
  },

  rememberLabel: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    color: "#64748b",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 600,
  },

  checkbox: {
    width: 15,
    height: 15,
    accentColor: "#0284c7",
  },

  forgotButton: {
    padding: 0,
    border: "none",
    background: "transparent",
    color: "#0284c7",
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: 750,
    cursor: "pointer",
  },

  loginButton: {
    width: "100%",
    minHeight: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "none",
    borderRadius: 10,
    background: "#0284c7",
    color: "#ffffff",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 750,
    boxShadow: "0 4px 15px rgba(2, 132, 199, 0.25)",
    cursor: "pointer",
    transition: "transform 0.2s ease, opacity 0.2s ease",
  },

  disabledButton: {
    opacity: 0.65,
    cursor: "not-allowed",
  },

  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.45)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
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
    lineHeight: 1.45,
  },

  registerText: {
    margin: "22px 0 0",
    color: "#64748b",
    textAlign: "center",
    fontSize: 12.5,
  },

  registerButton: {
    padding: 0,
    border: "none",
    background: "transparent",
    color: "#0284c7",
    fontFamily: "inherit",
    fontSize: 12.5,
    fontWeight: 750,
    cursor: "pointer",
  },
};

function LoginPage({
  onLoginSuccess,
  onRegisterClick,
  onHomeClick,
}) {
  // State to manage whether we show the login form or the forgot password page[cite: 3]
  const [currentView, setCurrentView] = useState("login");

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateCredential = (field, value) => {
    setCredentials((previous) => ({ ...previous, [field]: value }));

    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    const trimmedEmail = credentials.email.trim();

    if (!trimmedEmail) {
      return "Please enter your email address.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      return "Please enter a valid email address.";
    }

    if (!credentials.password) {
      return "Please enter your password.";
    }

    return "";
  };

  const handleLogin = async (event) => {
    event?.preventDefault();

    if (loading) return;

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    const email = credentials.email.trim();
    const password = credentials.password;

    try {
      const account = await login(email, password);

      if (rememberMe) {
        localStorage.setItem("aiCrosRememberedRole", "student");
        localStorage.setItem("aiCrosRememberedEmail", email);
      } else {
        localStorage.removeItem("aiCrosRememberedRole");
        localStorage.removeItem("aiCrosRememberedEmail");
      }

      onLoginSuccess(account, "student");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Login failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    onRegisterClick?.();
  };

  const inputFocusStyle = (fieldName) =>
    focusedField === fieldName
      ? {
          borderColor: "#0284c7",
          boxShadow: "0 0 0 3px rgba(2, 132, 199, 0.12)",
          background: "#ffffff",
        }
      : {};

  // Conditionally render the ForgotPasswordPage if requested[cite: 3]
  if (currentView === "forgotPassword") {
    return (
      <ForgotPasswordPage
        initialRole="student"
        onBackToLogin={() => setCurrentView("login")}
      />
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .ai-cros-login-button:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          .ai-cros-link:hover {
            text-decoration: underline;
          }

          @media (max-width: 760px) {
            .ai-cros-login-container {
              max-width: 460px !important;
              min-height: auto !important;
              display: block !important;
              border-radius: 20px !important;
            }

            .ai-cros-left-panel {
              display: none !important;
            }

            .ai-cros-form-panel {
              width: 100% !important;
              padding: 36px 26px !important;
            }

            .ai-cros-mobile-logo {
              display: flex !important;
            }
          }
        `}
      </style>

      <main style={styles.page}>
        <section
          className="ai-cros-login-container"
          style={styles.container}
          aria-label="AI-CROS login"
        >
          <aside style={styles.leftPanel}>
            <div style={styles.brand}>
              <button type="button" style={styles.brandButton} onClick={onHomeClick} title="Back to homepage">
                <img
                  src="/ai-cros-logo.png"
                  alt="AI-CROS logo"
                  style={styles.logoMark}
                />
                <span style={styles.brandName}>AI-CROS</span>
              </button>
            </div>

            <div style={styles.heroContent}>
              <div style={styles.heroBadge}>
                <span>✦</span>
                AI-powered career preparation
              </div>

              <h1 style={styles.heroTitle}>
                Build your path towards your dream career.
              </h1>

              <p style={styles.heroDescription}>
                Evaluate your resume, discover matching opportunities, identify
                missing skills and practise industry-based career simulations.
              </p>
            </div>

            <div style={styles.leftFooter}>
              © 2026 AI-CROS · Career Readiness Platform
            </div>
          </aside>

          <div className="ai-cros-form-panel" style={styles.formPanel}>
            <div style={styles.formContent}>
              <div className="ai-cros-mobile-logo" style={styles.mobileLogo}>
                <img
                  src="/ai-cros-logo.png"
                  alt="AI-CROS logo"
                  style={styles.mobileLogoMark}
                />
                AI-CROS
              </div>

              <h2 style={styles.heading}>Welcome back</h2>
              <p style={styles.subheading}>Enter your student login details.</p>

              <form onSubmit={handleLogin} noValidate>
                <div style={styles.fieldGroup}>
                  <label htmlFor="login-email" style={styles.label}>
                    Email address
                  </label>

                  <div style={styles.inputWrapper}>
                    <span style={styles.inputIcon}>✉</span>

                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={credentials.email}
                      onChange={(event) =>
                        updateCredential("email", event.target.value)
                      }
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField("")}
                      placeholder="student@umpsa.edu.my"
                      style={{
                        ...styles.input,
                        ...inputFocusStyle("email"),
                      }}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <label htmlFor="login-password" style={styles.label}>
                    Password
                  </label>

                  <div style={styles.inputWrapper}>
                    <span style={styles.inputIcon}>⌑</span>

                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={credentials.password}
                      onChange={(event) =>
                        updateCredential("password", event.target.value)
                      }
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField("")}
                      placeholder="Enter your password"
                      style={{
                        ...styles.input,
                        ...inputFocusStyle("password"),
                      }}
                      disabled={loading}
                    />

                    <button
                      type="button"
                      style={styles.passwordToggle}
                      onClick={() => setShowPassword((previous) => !previous)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? "◉" : "◎"}
                    </button>
                  </div>
                </div>

                <div style={styles.optionsRow}>
                  <label style={styles.rememberLabel}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(event.target.checked)
                      }
                      style={styles.checkbox}
                    />
                    Remember me
                  </label>

                  <button
                    className="ai-cros-link"
                    type="button"
                    style={styles.forgotButton}
                    // Trigger switching views to the ForgotPasswordPage[cite: 3]
                    onClick={() => setCurrentView("forgotPassword")}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  className="ai-cros-login-button"
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.loginButton,
                    ...(loading ? styles.disabledButton : {}),
                  }}
                >
                  {loading ? (
                    <>
                      <span style={styles.spinner} />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Log in
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>

                {error && (
                  <div style={styles.error} role="alert">
                    <span aria-hidden="true">⚠</span>
                    <span>{error}</span>
                  </div>
                )}
              </form>

              <p style={styles.registerText}>
                Don&apos;t have an account?{" "}
                <button
                  className="ai-cros-link"
                  type="button"
                  onClick={handleRegister}
                  style={styles.registerButton}
                >
                  Create an account
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default LoginPage;