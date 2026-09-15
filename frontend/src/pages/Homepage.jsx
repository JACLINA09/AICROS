import { useState, useEffect } from "react";

const styles = {
  page: { 
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif", 
    background: "#07080c", 
    minHeight: "100vh", 
    color: "#f3f4f6",
    WebkitFontSmoothing: "antialiased",
    position: "relative",
    overflowX: "hidden"
  },

  // Dynamic mesh-like background glow layers
  meshBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `
      radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.12) 0%, transparent 40%),
      radial-gradient(circle at 85% 35%, rgba(168, 85, 247, 0.10) 0%, transparent 45%),
      radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)
    `,
    zIndex: 0,
    pointerEvents: "none"
  },

  nav: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "24px 48px", 
    maxWidth: 1200, 
    margin: "0 auto",
    position: "relative",
    zIndex: 1
  },
  logoGroup: {
    display: "flex",
    alignItems: "center",
    gap: 12
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
  },
  logo: { 
    fontSize: 22, 
    fontWeight: 900, 
    background: "linear-gradient(135deg, #60a5fa, #c084fc, #f472b6)", 
    WebkitBackgroundClip: "text", 
    WebkitTextFillColor: "transparent",
    letterSpacing: -0.5
  },
  navActions: { display: "flex", gap: 12 },
  navLoginBtn: { 
    padding: "10px 20px", 
    borderRadius: 12, 
    border: "1px solid rgba(255, 255, 255, 0.12)", 
    background: "rgba(255, 255, 255, 0.03)", 
    fontSize: 14, 
    fontWeight: 600, 
    cursor: "pointer", 
    color: "#e5e7eb",
    backdropFilter: "blur(12px)",
    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
  },
  navRegisterBtn: { 
    padding: "10px 20px", 
    borderRadius: 12, 
    border: "none", 
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", 
    color: "white", 
    fontSize: 14, 
    fontWeight: 700, 
    cursor: "pointer",
    boxShadow: "0 0 25px rgba(139, 92, 246, 0.45)",
    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
  },

  hero: { 
    display: "flex", 
    alignItems: "center", 
    gap: 60, 
    maxWidth: 1200, 
    margin: "40px auto 100px", 
    padding: "0 48px", 
    flexWrap: "wrap",
    position: "relative",
    zIndex: 1
  },
  heroLeft: { flex: "1 1 480px" },
  eyebrow: { 
    fontSize: 12, 
    fontWeight: 800, 
    color: "#c084fc", 
    letterSpacing: 2, 
    textTransform: "uppercase", 
    marginBottom: 16,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 14px",
    background: "rgba(192, 132, 252, 0.08)",
    borderRadius: "20px",
    border: "1px solid rgba(192, 132, 252, 0.2)",
    boxShadow: "inset 0 1px 0 rgba(192, 132, 252, 0.1)"
  },
  headline: { 
    fontSize: 54, 
    fontWeight: 900, 
    lineHeight: 1.06, 
    letterSpacing: -2, 
    margin: "0 0 20px",
    color: "#ffffff"
  },
  headlineAccent: { 
    background: "linear-gradient(135deg, #60a5fa, #c084fc, #f472b6)", 
    WebkitBackgroundClip: "text", 
    WebkitTextFillColor: "transparent" 
  },
  subtext: { 
    fontSize: 17, 
    color: "#9ca3af", 
    lineHeight: 1.65, 
    maxWidth: 480, 
    margin: "0 0 32px" 
  },
  heroCtaRow: { display: "flex", gap: 14, flexWrap: "wrap" },
  ctaPrimary: { 
    padding: "16px 30px", 
    borderRadius: 14, 
    border: "none", 
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", 
    color: "white", 
    fontSize: 15, 
    fontWeight: 700, 
    cursor: "pointer",
    boxShadow: "0 10px 35px rgba(59, 130, 246, 0.45)",
    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
  },
  ctaSecondary: { 
    padding: "16px 30px", 
    borderRadius: 14, 
    border: "1.5px solid rgba(255, 255, 255, 0.12)", 
    background: "rgba(255, 255, 255, 0.02)", 
    color: "#f3f4f6", 
    fontSize: 15, 
    fontWeight: 700, 
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
  },

  heroRight: { flex: "1 1 360px", display: "flex", justifyContent: "center" },
  scoreCard: { 
    background: "linear-gradient(145deg, rgba(22, 24, 35, 0.85), rgba(13, 15, 22, 0.95))", 
    backdropFilter: "blur(24px)",
    borderRadius: 26, 
    padding: 32, 
    width: 320, 
    boxShadow: "0 30px 70px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)", 
    border: "1px solid rgba(255, 255, 255, 0.08)" 
  },
  scoreCardLabel: { 
    fontSize: 11.5, 
    fontWeight: 700, 
    color: "#9ca3af", 
    textTransform: "uppercase", 
    letterSpacing: 1, 
    margin: "0 0 4px" 
  },
  scoreRingWrap: { display: "flex", justifyContent: "center", margin: "16px 0 24px" },
  scoreBreakdownRow: { 
    display: "flex", 
    justifyContent: "space-between", 
    fontSize: 13, 
    color: "#9ca3af", 
    padding: "10px 0", 
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)" 
  },
  scoreBreakdownVal: { fontWeight: 700, color: "#f3f4f6" },

  section: { maxWidth: 1200, margin: "0 auto", padding: "80px 48px", position: "relative", zIndex: 1 },
  sectionEyebrow: { 
    fontSize: 12, 
    fontWeight: 800, 
    color: "#c084fc", 
    letterSpacing: 2, 
    textTransform: "uppercase", 
    marginBottom: 10, 
    textAlign: "center" 
  },
  sectionTitle: { 
    fontSize: 36, 
    fontWeight: 900, 
    textAlign: "center", 
    margin: "0 0 60px", 
    letterSpacing: -1,
    color: "#ffffff"
  },

  stepsGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
    gap: 32 
  },
  stepCard: { 
    position: "relative", 
    padding: "24px", 
    background: "rgba(20, 22, 32, 0.4)",
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.04)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease"
  },
  stepNum: { 
    fontSize: 12, 
    fontWeight: 900, 
    color: "#60a5fa", 
    marginBottom: 12,
    display: "inline-block",
    padding: "4px 10px",
    background: "rgba(96, 165, 250, 0.1)",
    borderRadius: "8px"
  },
  stepTitle: { fontSize: 16, fontWeight: 700, margin: "0 0 8px", color: "#f3f4f6" },
  stepDesc: { fontSize: 13.5, color: "#9ca3af", lineHeight: 1.65, margin: 0 },
  stepConnector: { 
    position: "absolute", 
    top: 36, 
    left: "calc(100% + 16px)", 
    width: "calc(100% - 32px)", 
    borderTop: "2px dashed rgba(255, 255, 255, 0.1)", 
    display: "none" 
  },

  featureGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
    gap: 24 
  },
  featureCard: { 
    background: "linear-gradient(145deg, rgba(20, 22, 32, 0.6), rgba(13, 15, 22, 0.8))", 
    backdropFilter: "blur(16px)",
    borderRadius: 22, 
    padding: 30, 
    border: "1px solid rgba(255, 255, 255, 0.06)",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
  },
  featureIcon: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontSize: 20, 
    marginBottom: 18,
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
  },
  featureTitle: { fontSize: 16, fontWeight: 700, margin: "0 0 8px", color: "#f3f4f6" },
  featureDesc: { fontSize: 13.5, color: "#9ca3af", lineHeight: 1.65, margin: 0 },

  finalCta: { 
    textAlign: "center", 
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.18), rgba(139, 92, 246, 0.18))", 
    border: "1px solid rgba(139, 92, 246, 0.35)",
    borderRadius: 28, 
    padding: "64px 40px", 
    margin: "60px auto 100px", 
    maxWidth: 1104,
    boxShadow: "0 25px 60px rgba(139, 92, 246, 0.2)",
    backdropFilter: "blur(24px)",
    position: "relative",
    zIndex: 1
  },
  finalCtaTitle: { fontSize: 36, fontWeight: 900, color: "white", margin: "0 0 12px", letterSpacing: -1 },
  finalCtaSub: { fontSize: 15, color: "#9ca3af", margin: "0 0 32px", maxWidth: 500, marginLeft: "auto", marginRight: "auto" },
  finalCtaBtn: { 
    padding: "16px 36px", 
    borderRadius: 14, 
    border: "none", 
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", 
    color: "white", 
    fontSize: 15, 
    fontWeight: 700, 
    cursor: "pointer",
    boxShadow: "0 10px 35px rgba(139, 92, 246, 0.45)",
    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
  },

  footer: { textAlign: "center", padding: "32px 20px", fontSize: 12.5, color: "#6b7280", borderTop: "1px solid rgba(255, 255, 255, 0.05)", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 },
};

function AnimatedScoreRing({ target = 87, size = 130 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);

  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={10} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="url(#ringGradient)" strokeWidth={10} fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.1s linear" }}
      />
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      <text
        x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        style={{ transform: `rotate(90deg) translate(0px, -${size}px)`, transformOrigin: `${size / 2}px ${size / 2}px`, fontSize: 32, fontWeight: 900, fill: "#ffffff", fontFamily: "'Inter', sans-serif" }}
      >
        {value}
      </text>
    </svg>
  );
}

const steps = [
  { title: "Upload your resume", desc: "AI parses and scores it for quality and ATS compatibility." },
  { title: "Get matched to jobs", desc: "See real compatibility scores based on your actual skills." },
  { title: "Practice the role", desc: "Take a scored simulation built around the job you want." },
  { title: "Apply with confidence", desc: "Your portfolio combines every score into one readiness metric." },
];

const features = [
  { icon: "📄", bg: "rgba(59, 130, 246, 0.18)", title: "AI resume scoring", desc: "Quality and ATS compatibility scored automatically, with specific feedback." },
  { icon: "🎯", bg: "rgba(168, 85, 247, 0.18)", title: "Skill-based job matching", desc: "Ranked by how well your actual skills fit each role, not just keywords." },
  { icon: "🧩", bg: "rgba(249, 115, 22, 0.18)", title: "Career simulations", desc: "Job-specific scenarios, scored in real time, before you ever apply." },
  { icon: "📊", bg: "rgba(16, 185, 129, 0.18)", title: "Career portfolio", desc: "One combined readiness score, built from every part of your profile." },
];

function Homepage({ onLoginClick, onRegisterClick }) {
  return (
    <div style={styles.page}>
      <div style={styles.meshBackground} />

      <style>{`
        button:hover { opacity: 0.92; transform: translateY(-2px); }
        button:active { transform: translateY(0); }
        @media (min-width: 1024px) {
          .desktop-step-connector { display: block !important; }
        }
        .step-card:hover {
          border-color: rgba(96, 165, 250, 0.3) !important;
          background: rgba(25, 28, 42, 0.6) !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.3);
          transform: translateY(-4px);
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
          border-color: rgba(139, 92, 246, 0.4) !important;
          background: linear-gradient(145deg, rgba(25, 28, 42, 0.8), rgba(18, 20, 30, 0.95)) !important;
        }
      `}</style>

      <nav style={styles.nav}>
        <div style={styles.logoGroup}>
          <div style={styles.logoIcon}>⚡</div>
          <div style={styles.logo}>AI-CROS</div>
        </div>
        <div style={styles.navActions}>
          <button style={styles.navLoginBtn} onClick={onLoginClick}>Log in</button>
          <button style={styles.navRegisterBtn} onClick={onRegisterClick}>Get started</button>
        </div>
      </nav>

      <header style={styles.hero}>
        <div style={styles.heroLeft}>
          <p style={styles.eyebrow}>✦ Next-Gen Career Intelligence</p>
          <h1 style={styles.headline}>
            Know exactly how <span style={styles.headlineAccent}>job-ready</span> you really are.
          </h1>
          <p style={styles.subtext}>
            AI-CROS scores your resume, matches you to real jobs by skill, and runs you through job-specific
            simulations — then combines it all into one honest readiness score.
          </p>
          <div style={styles.heroCtaRow}>
            <button style={styles.ctaPrimary} onClick={onRegisterClick}>Get your readiness score →</button>
            <button style={styles.ctaSecondary} onClick={onLoginClick}>I already have an account</button>
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.scoreCard}>
            <p style={styles.scoreCardLabel}>Career readiness score</p>
            <div style={styles.scoreRingWrap}>
              <AnimatedScoreRing target={87} />
            </div>
            {[
              ["Resume quality", 82], ["ATS compatibility", 90], ["Skill match", 85], ["Simulation score", 91],
            ].map(([label, val]) => (
              <div key={label} style={styles.scoreBreakdownRow}>
                <span>{label}</span>
                <span style={styles.scoreBreakdownVal}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>The process</p>
        <h2 style={styles.sectionTitle}>Four steps, one honest score</h2>
        <div style={styles.stepsGrid}>
          {steps.map((step, i) => (
            <div key={step.title} className="step-card" style={styles.stepCard}>
              <p style={styles.stepNum}>{String(i + 1).padStart(2, "0")}</p>
              <p style={styles.stepTitle}>{step.title}</p>
              <p style={styles.stepDesc}>{step.desc}</p>
              {i < steps.length - 1 && <div className="desktop-step-connector" style={styles.stepConnector} />}
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>What's inside</p>
        <h2 style={styles.sectionTitle}>Built around how hiring actually works</h2>
        <div style={styles.featureGrid}>
          {features.map((f) => (
            <div key={f.title} className="feature-card" style={styles.featureCard}>
              <div style={{ ...styles.featureIcon, background: f.bg }}>{f.icon}</div>
              <p style={styles.featureTitle}>{f.title}</p>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.finalCta}>
        <p style={styles.finalCtaTitle}>Ready to see your score?</p>
        <p style={styles.finalCtaSub}>It takes less than five minutes to upload your resume and get started.</p>
        <button style={styles.finalCtaBtn} onClick={onRegisterClick}>Create your free account →</button>
      </div>

      <footer style={styles.footer}>© 2026 AI-CROS — AI-Powered Career Readiness & Opportunity Sourcing System</footer>
    </div>
  );
}

export default Homepage;