import { useState } from "react";
import { login } from "../services/authService";
import { loginIndustry } from "../services/industryService";
import { loginAdmin } from "../services/adminService";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at top left, rgba(37, 99, 235, 0.14), transparent 35%), radial-gradient(circle at bottom right, rgba(124, 58, 237, 0.14), transparent 35%), #f7f8fc",
    fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "32px 20px",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: 940,
    minHeight: 580,
    display: "flex",
    overflow: "hidden",
    background: "#ffffff",
    borderRadius: 24,
    border: "1px solid rgba(15, 23, 42, 0.06)",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.14)",
  },

  leftPanel: {
    flex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 46,
    color: "#ffffff",
    background:
      "linear-gradient(145deg, #8ea688 0%, #46e561 48%, #7ee281 100%)",
    overflow: "hidden",
  },

  circleOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: "50%",
    top: -110,
    right: -80,
    background: "rgba(255,255,255,0.10)",
  },

  circleTwo: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: "50%",
    bottom: -90,
    left: -60,
    background: "rgba(255,255,255,0.08)",
  },

  brand: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  logoMark: {
    width: 42,
    height: 42,
    display: "block",
    borderRadius: 13,
    objectFit: "contain",
  },

  brandName: {
    fontSize: 22,
    fontWeight: 850,
    letterSpacing: "-0.4px",
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
    padding: "7px 11px",
    marginBottom: 20,
    borderRadius: 999,
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontSize: 12,
    fontWeight: 650,
  },

  heroTitle: {
    margin: "0 0 16px",
    fontSize: 37,
    lineHeight: 1.15,
    letterSpacing: "-1.2px",
    fontWeight: 850,
  },

  heroDescription: {
    margin: 0,
    color: "rgba(255,255,255,0.82)",
    fontSize: 14.5,
    lineHeight: 1.7,
  },

  featureList: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 28,
  },

  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: 550,
  },

  checkIcon: {
    width: 21,
    height: 21,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.17)",
    fontSize: 11,
  },

  leftFooter: {
    position: "relative",
    zIndex: 1,
    color: "rgba(255,255,255,0.6)",
    fontSize: 11.5,
  },

  formPanel: {
    width: 430,
    display: "flex",
    alignItems: "center",
    padding: "48px 44px",
    boxSizing: "border-box",
  },

  formContent: {
    width: "100%",
  },

  mobileLogo: {
    display: "none",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
    color: "#1e293b",
    fontWeight: 850,
    fontSize: 20,
  },

  mobileLogoMark: {
    width: 38,
    height: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    color: "#ffffff",
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    fontSize: 15,
    fontWeight: 900,
  },

  heading: {
    margin: "0 0 7px",
    color: "#0f172a",
    fontSize: 27,
    fontWeight: 850,
    letterSpacing: "-0.7px",
  },

  subheading: {
    margin: "0 0 28px",
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.55,
  },

  label: {
    display: "block",
    marginBottom: 7,
    color: "#334155",
    fontSize: 12.5,
    fontWeight: 700,
  },

  roleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
    marginBottom: 22,
  },

  roleButton: (active) => ({
    minHeight: 72,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    padding: "10px 6px",
    borderRadius: 13,
    border: active ? "1.5px solid #4f46e5" : "1px solid #e2e8f0",
    background: active
      ? "linear-gradient(180deg, #eef2ff, #f5f3ff)"
      : "#ffffff",
    color: active ? "#4338ca" : "#64748b",
    boxShadow: active ? "0 5px 15px rgba(79, 70, 229, 0.10)" : "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 11.5,
    fontWeight: 700,
    transition: "all 0.2s ease",
  }),

  roleIcon: {
    fontSize: 20,
    lineHeight: 1,
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
    fontSize: 16,
    pointerEvents: "none",
  },

  input: {
    width: "100%",
    height: 47,
    padding: "0 44px 0 42px",
    borderRadius: 12,
    border: "1px solid #dbe2ea",
    outline: "none",
    background: "#fbfcfe",
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
    fontSize: 16,
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
  },

  checkbox: {
    width: 15,
    height: 15,
    accentColor: "#4f46e5",
  },

  forgotButton: {
    padding: 0,
    border: "none",
    background: "transparent",
    color: "#4f46e5",
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: 700,
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
    borderRadius: 12,
    background: "linear-gradient(90deg, #2563eb, #6d28d9)",
    color: "#ffffff",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 750,
    boxShadow: "0 10px 25px rgba(79, 70, 229, 0.24)",
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
    borderRadius: 10,
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: 12,
    lineHeight: 1.45,
  },

  registerText: {
    margin: "25px 0 0",
    color: "#64748b",
    textAlign: "center",
    fontSize: 12.5,
  },

  registerButton: {
    padding: 0,
    border: "none",
    background: "transparent",
    color: "#4f46e5",
    fontFamily: "inherit",
    fontSize: 12.5,
    fontWeight: 750,
    cursor: "pointer",
  },
};

const roleDetails = {
  student: {
    label: "Student",
    icon: "🎓",
    placeholder: "student@umpsa.edu.my",
  },
  industry: {
    label: "Industry",
    icon: "🏢",
    placeholder: "company@email.com",
  },
  admin: {
    label: "Admin",
    icon: "🛡️",
    placeholder: "admin@umpsa.edu.my",
  },
};

function LoginPage({
  onLoginSuccess,
  onRegisterClick,
  onIndustryRegisterClick,
  onForgotPasswordClick,
}) {
  const [role, setRole] = useState("student");
  const [credentials, setCredentials] = useState({
    student: { email: "", password: "" },
    industry: { email: "", password: "" },
    admin: { email: "", password: "" },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentCredentials = credentials[role];

  const updateCredential = (field, value) => {
    setCredentials((previous) => ({
      ...previous,
      [role]: {
        ...previous[role],
        [field]: value,
      },
    }));

    if (error) {
      setError("");
    }
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError("");
    setShowPassword(false);
  };

  const validateForm = () => {
    const trimmedEmail = currentCredentials.email.trim();

    if (!trimmedEmail) {
      return "Please enter your email address.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      return "Please enter a valid email address.";
    }

    if (!currentCredentials.password) {
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

    const email = currentCredentials.email.trim();
    const password = currentCredentials.password;

    try {
      let account;

      if (role === "student") {
        account = await login(email, password);
      } else if (role === "industry") {
        account = await loginIndustry(email, password);
      } else {
        account = await loginAdmin(email, password);
      }

      if (rememberMe) {
        localStorage.setItem("aiCrosRememberedRole", role);
        localStorage.setItem("aiCrosRememberedEmail", email);
      } else {
        localStorage.removeItem("aiCrosRememberedRole");
        localStorage.removeItem("aiCrosRememberedEmail");
      }

      onLoginSuccess(account, role);
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
    if (role === "industry") {
      onIndustryRegisterClick?.();
      return;
    }

    onRegisterClick?.();
  };

  const inputFocusStyle = (fieldName) =>
    focusedField === fieldName
      ? {
          borderColor: "#6366f1",
          boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.12)",
          background: "#ffffff",
        }
      : {};

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

          .ai-cros-role-button:hover {
            border-color: #a5b4fc !important;
            background: #f8faff !important;
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

          @media (max-width: 420px) {
            .ai-cros-page {
              padding: 16px !important;
            }

            .ai-cros-form-panel {
              padding: 30px 20px !important;
            }

            .ai-cros-role-grid {
              gap: 6px !important;
            }
          }
        `}
      </style>

      <main className="ai-cros-page" style={styles.page}>
        <section
          className="ai-cros-login-container"
          style={styles.container}
          aria-label="AI-CROS login"
        >
          <aside className="ai-cros-left-panel" style={styles.leftPanel}>
            <div style={styles.circleOne} />
            <div style={styles.circleTwo} />

            <div style={styles.brand}>
              <img
                src="/ai-cros-logo.png"
                alt="AI-CROS logo"
                style={styles.logoMark}
              />
              <span style={styles.brandName}>AI-CROS</span>
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
                <div style={styles.mobileLogoMark}>AI</div>
                AI-CROS
              </div>

              <h2 style={styles.heading}>Welcome back</h2>
              <p style={styles.subheading}>
                Select your account type and enter your login details.
              </p>

              <form onSubmit={handleLogin} noValidate>
                <label style={styles.label}>Log in as</label>

                <div
                  className="ai-cros-role-grid"
                  style={styles.roleGrid}
                  role="group"
                  aria-label="Select account type"
                >
                  {Object.entries(roleDetails).map(([roleKey, details]) => {
                    const isActive = role === roleKey;

                    return (
                      <button
                        key={roleKey}
                        className="ai-cros-role-button"
                        type="button"
                        onClick={() => handleRoleChange(roleKey)}
                        style={styles.roleButton(isActive)}
                        aria-pressed={isActive}
                      >
                        <span style={styles.roleIcon}>{details.icon}</span>
                        <span>{details.label}</span>
                      </button>
                    );
                  })}
                </div>

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
                      value={currentCredentials.email}
                      onChange={(event) =>
                        updateCredential("email", event.target.value)
                      }
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField("")}
                      placeholder={roleDetails[role].placeholder}
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
                      value={currentCredentials.password}
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
                    onClick={onForgotPasswordClick}
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

              {role !== "admin" && (
                <p style={styles.registerText}>
                  {role === "industry"
                    ? "New industry partner?"
                    : "Don't have an account?"}{" "}
                  <button
                    className="ai-cros-link"
                    type="button"
                    onClick={handleRegister}
                    style={styles.registerButton}
                  >
                    Create an account
                  </button>
                </p>
              )}

              {role === "admin" && (
                <p style={styles.registerText}>
                  Admin accounts are managed by the system administrator.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default LoginPage;