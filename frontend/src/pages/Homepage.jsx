import { useState, useEffect } from "react";

const styles = {
  page: { fontFamily: "'Inter', system-ui, sans-serif", background: "#FAFAF9", minHeight: "100vh", color: "#1A1A1A" },

  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", maxWidth: 1200, margin: "0 auto" },
  logo: { fontSize: 20, fontWeight: 800, background: "linear-gradient(90deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  navActions: { display: "flex", gap: 10 },
  navLoginBtn: { padding: "9px 18px", borderRadius: 10, border: "1px solid #E0E0DA", background: "white", fontSize: 13.5, fontWeight: 600, cursor: "pointer", color: "#444" },
  navRegisterBtn: { padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #2563eb, #7c3aed)", color: "white", fontSize: 13.5, fontWeight: 700, cursor: "pointer" },

  hero: { display: "flex", alignItems: "center", gap: 60, maxWidth: 1200, margin: "40px auto 100px", padding: "0 48px", flexWrap: "wrap" },
  heroLeft: { flex: "1 1 440px" },
  eyebrow: { fontSize: 12.5, fontWeight: 700, color: "#7c3aed", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 16 },
  headline: { fontSize: 46, fontWeight: 800, lineHeight: 1.12, letterSpacing: -1.2, margin: "0 0 20px" },
  headlineAccent: { background: "linear-gradient(90deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtext: { fontSize: 16, color: "#666", lineHeight: 1.6, maxWidth: 460, margin: "0 0 32px" },
  heroCtaRow: { display: "flex", gap: 12 },
  ctaPrimary: { padding: "14px 26px", borderRadius: 12, border: "none", background: "linear-gradient(90deg, #2563eb, #7c3aed)", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  ctaSecondary: { padding: "14px 26px", borderRadius: 12, border: "1.5px solid #D8D8D2", background: "white", color: "#333", fontSize: 15, fontWeight: 700, cursor: "pointer" },

  heroRight: { flex: "1 1 360px", display: "flex", justifyContent: "center" },
  scoreCard: { background: "white", borderRadius: 20, padding: 28, width: 320, boxShadow: "0 20px 50px rgba(37,99,235,0.12)", border: "1px solid #EEEEE9" },
  scoreCardLabel: { fontSize: 11.5, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 0.6, margin: "0 0 4px" },
  scoreRingWrap: { display: "flex", justifyContent: "center", margin: "12px 0 20px" },
  scoreBreakdownRow: { display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#666", padding: "8px 0", borderBottom: "1px solid #F2F2EE" },
  scoreBreakdownVal: { fontWeight: 700, color: "#333" },

  section: { maxWidth: 1200, margin: "0 auto", padding: "60px 48px" },
  sectionEyebrow: { fontSize: 12.5, fontWeight: 700, color: "#7c3aed", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10, textAlign: "center" },
  sectionTitle: { fontSize: 30, fontWeight: 800, textAlign: "center", margin: "0 0 50px", letterSpacing: -0.6 },

  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 },
  stepCard: { position: "relative" },
  stepNum: { fontSize: 13, fontWeight: 800, color: "#2563eb", marginBottom: 10 },
  stepTitle: { fontSize: 15.5, fontWeight: 700, margin: "0 0 8px" },
  stepDesc: { fontSize: 13, color: "#777", lineHeight: 1.6, margin: 0 },
  stepConnector: { position: "absolute", top: 8, left: "calc(100% + 12px)", width: "calc(100% - 24px)", borderTop: "1.5px dashed #D8D8D2" },

  featureGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 },
  featureCard: { background: "white", borderRadius: 16, padding: 24, border: "1px solid #EEEEE9" },
  featureIcon: { width: 40, height: 40, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 14 },
  featureTitle: { fontSize: 14.5, fontWeight: 700, margin: "0 0 6px" },
  featureDesc: { fontSize: 12.5, color: "#888", lineHeight: 1.6, margin: 0 },

  finalCta: { textAlign: "center", background: "linear-gradient(90deg, #2563eb, #7c3aed)", borderRadius: 24, padding: "56px 40px", margin: "40px auto 80px", maxWidth: 1104 },
  finalCtaTitle: { fontSize: 28, fontWeight: 800, color: "white", margin: "0 0 10px" },
  finalCtaSub: { fontSize: 14.5, color: "rgba(255,255,255,0.85)", margin: "0 0 26px" },
  finalCtaBtn: { padding: "14px 30px", borderRadius: 12, border: "none", background: "white", color: "#2563eb", fontSize: 15, fontWeight: 700, cursor: "pointer" },

  footer: { textAlign: "center", padding: "24px 20px", fontSize: 12, color: "#999" },
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
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#F0F0EE" strokeWidth={10} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="url(#ringGradient)" strokeWidth={10} fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.1s linear" }}
      />
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <text
        x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        style={{ transform: `rotate(90deg) translate(0px, -${size}px)`, transformOrigin: `${size / 2}px ${size / 2}px`, fontSize: 30, fontWeight: 800, fill: "#1A1A1A", fontFamily: "'Inter', sans-serif" }}
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
  { icon: "📄", bg: "#EEF3FF", title: "AI resume scoring", desc: "Quality and ATS compatibility scored automatically, with specific feedback." },
  { icon: "🎯", bg: "#F3EEFF", title: "Skill-based job matching", desc: "Ranked by how well your actual skills fit each role, not just keywords." },
  { icon: "🧩", bg: "#FFF3E9", title: "Career simulations", desc: "Job-specific scenarios, scored in real time, before you ever apply." },
  { icon: "📊", bg: "#E9FBF3", title: "Career portfolio", desc: "One combined readiness score, built from every part of your profile." },
];

function Homepage({ onLoginClick, onRegisterClick }) {
  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.logo}>AI-CROS</div>
        <div style={styles.navActions}>
          <button style={styles.navLoginBtn} onClick={onLoginClick}>Log in</button>
          <button style={styles.navRegisterBtn} onClick={onRegisterClick}>Get started</button>
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <p style={styles.eyebrow}>AI-powered career readiness</p>
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
      </section>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>The process</p>
        <h2 style={styles.sectionTitle}>Four steps, one honest score</h2>
        <div style={styles.stepsGrid}>
          {steps.map((step, i) => (
            <div key={step.title} style={styles.stepCard}>
              <p style={styles.stepNum}>{String(i + 1).padStart(2, "0")}</p>
              <p style={styles.stepTitle}>{step.title}</p>
              <p style={styles.stepDesc}>{step.desc}</p>
              {i < steps.length - 1 && <div style={styles.stepConnector} />}
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>What's inside</p>
        <h2 style={styles.sectionTitle}>Built around how hiring actually works</h2>
        <div style={styles.featureGrid}>
          {features.map((f) => (
            <div key={f.title} style={styles.featureCard}>
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
