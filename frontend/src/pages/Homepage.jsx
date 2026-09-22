import { useState, useEffect } from "react";

const styles = {
  page: { 
    fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", 
    background: "#eaf1f7", 
    minHeight: "100vh", 
    color: "#17324d",
    WebkitFontSmoothing: "antialiased",
    position: "relative"
  },

  nav: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "20px 48px", 
    maxWidth: 1280, 
    margin: "0 auto",
    background: "#dce9f2",
    borderBottom: "1px solid #bfd3e2",
    boxShadow: "0 2px 0 rgba(23,50,77,0.04)"
  },
  logoButton: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
    textDecoration: "none"
  },
  logoImg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    objectFit: "contain"
  },
  logoText: { 
    fontSize: 20, 
    fontWeight: 850, 
    color: "#234e70",
    letterSpacing: "0.2px"
  },
  navRight: { display: "flex", alignItems: "center", gap: 14 },
  languageControl: { display: "flex", alignItems: "center", gap: 7 },
  languageIcon: {
    color: "#234e70",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "-1px"
  },
  langSelect: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #b8cddd",
    background: "rgba(234, 241, 247, 0.82)",
    fontSize: 13,
    fontWeight: 650,
    color: "#234e70",
    cursor: "pointer",
    outline: "none"
  },
  
  employerNavBtn: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid rgba(16, 24, 32, 0.34)",
    background: "rgba(255, 255, 255, 0.62)",
    color: "#234e70",
    fontSize: 13.5,
    fontWeight: 750,
    cursor: "pointer",
    transition: "all 0.2s ease"
  },

  navActions: { display: "flex", gap: 10 },
  navLoginBtn: { 
    padding: "9px 18px", 
    borderRadius: 8, 
    border: "1px solid rgba(16, 24, 32, 0.34)", 
    background: "transparent", 
    fontSize: 13.5, 
    fontWeight: 650, 
    cursor: "pointer", 
    color: "#234e70",
    transition: "all 0.2s ease"
  },
  navRegisterBtn: { 
    padding: "9px 18px", 
    borderRadius: 8, 
    border: "none", 
    background: "#234e70", 
    color: "#ffffff", 
    fontSize: 13.5, 
    fontWeight: 650, 
    cursor: "pointer",
    transition: "all 0.2s ease"
  },

  heroWrapper: {
    position: "relative",
    backgroundImage: "url('/background.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderBottom: "1px solid #b8cddd"
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255, 255, 255, 0.08)", 
    zIndex: 1
  },
  hero: { 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "space-between",
    gap: 50, 
    maxWidth: 1200, 
    margin: "0 auto", 
    padding: "76px 48px 92px", 
    flexWrap: "wrap",
    position: "relative",
    zIndex: 2
  },
  heroLeft: { flex: "1 1 500px" },
  
  roleSelector: {
    display: "inline-flex",
    background: "rgba(245, 241, 230, 0.12)",
    padding: "4px",
    borderRadius: "10px",
    marginBottom: "16px",
    border: "1px solid rgba(245, 241, 230, 0.36)"
  },
  roleTab: {
    padding: "8px 20px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    color: "#e6eef5",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  roleTabActive: {
    background: "#1f5f8b",
    color: "#234e70", 
    boxShadow: "0 3px 0 rgba(23,50,77,0.2)"
  },

  eyebrow: { 
    fontSize: 12, 
    fontWeight: 750, 
    color: "#ffffff", 
    letterSpacing: 1, 
    textTransform: "uppercase", 
    marginBottom: 14,
    display: "inline-block",
    padding: "4px 10px",
    background: "rgba(255, 255, 255, 0.62)",
    borderRadius: "4px",
    border: "1px solid rgba(16, 24, 32, 0.28)"
  },
  headline: { 
    fontSize: 42, 
    fontWeight: 850, 
    lineHeight: 1.15, 
    letterSpacing: -1.2, 
    margin: "0 0 16px",
    color: "#17324d",
    textShadow: "0 1px 5px rgba(255, 255, 255, 0.72)"
  },
  headlineAccent: { 
    color: "#17324d" 
  },
  subtext: { 
    fontSize: 15, 
    color: "#17324d",
    textShadow: "0 1px 4px rgba(255, 255, 255, 0.72)", 
    lineHeight: 1.6, 
    maxWidth: 480, 
    margin: "0 0 28px" 
  },
  heroCtaRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  ctaPrimary: { 
    padding: "12px 24px", 
    borderRadius: 8, 
    border: "none", 
    background: "#1f5f8b", 
    color: "#ffffff", 
    fontSize: 14.5, 
    fontWeight: 700, 
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  ctaSecondary: { 
    padding: "12px 24px", 
    borderRadius: 8, 
    border: "1px solid rgba(23, 50, 77, 0.42)", 
    background: "rgba(255, 255, 255, 0.52)", 
    color: "#17324d", 
    fontSize: 14.5, 
    fontWeight: 650, 
    cursor: "pointer",
    transition: "all 0.2s ease"
  },

  heroRight: { flex: "1 1 340px", display: "flex", justifyContent: "center" },
  scoreCard: { 
    background: "#f5f1e6", 
    borderRadius: 10, 
    padding: "28px", 
    width: "100%", 
    maxWidth: 360, 
    boxShadow: "0 8px 18px rgba(23, 50, 77, 0.12)", 
    border: "1px solid #c7d7e4" 
  },
  scoreCardLabel: { 
    fontSize: 12, 
    fontWeight: 750, 
    color: "#557086", 
    textTransform: "uppercase", 
    letterSpacing: 0.5, 
    margin: "0 0 4px" 
  },
  scoreRingWrap: { display: "flex", justifyContent: "center", margin: "14px 0 20px" },
  scoreBreakdownRow: { 
    display: "flex", 
    justifyContent: "space-between", 
    fontSize: 13, 
    color: "#47647d", 
    padding: "8px 0", 
    borderBottom: "1px solid #d6e1ea" 
  },
  scoreBreakdownVal: { fontWeight: 700, color: "#17324d" },

  partnersSection: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "70px 48px",
    background: "#eaf1f7",
    textAlign: "center"
  },
  partnerGrid: {
    overflow: "hidden",
    marginTop: 32
  },
  partnerTrack: {
    display: "flex",
    gap: 20,
    width: "max-content",
    animation: "partnerMarquee 28s linear infinite"
  },
  partnerCopy: {
    display: "flex",
    gap: 20
  },
  partnerCard: {
    flex: "0 0 220px",
    background: "#f5f1e6",
    borderRadius: 8,
    padding: "24px 20px",
    border: "1px solid #c7d7e4",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 4px 0 rgba(23,50,77,0.05)",
    transition: "all 0.2s ease"
  },
  partnerLogoImg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    objectFit: "contain",
    background: "#eaf1f7",
    padding: 4,
    border: "1px solid #c7d7e4"
  },
  partnerInitialFallback: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: "#1f5f8b",
    color: "#f5f1e6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 18
  },
  partnerName: {
    fontSize: 14.5,
    fontWeight: 750,
    color: "#17324d",
    margin: 0
  },
  partnerRole: {
    fontSize: 12.5,
    color: "#557086",
    margin: 0
  },
  emptyPartnersText: {
    fontSize: 14,
    color: "#557086",
    gridColumn: "1 / -1",
    padding: "20px 0"
  },

  section: { maxWidth: 1280, margin: "0 auto", padding: "88px 48px", background: "#eaf1f7" },
  sectionAlt: { maxWidth: 1280, margin: "0 auto", padding: "88px 48px", background: "#dce9f2", borderTop: "1px solid #c3d8e7", borderBottom: "1px solid #c3d8e7" },
  sectionEyebrow: { 
    fontSize: 12, 
    fontWeight: 750, 
    color: "#1f5f8b", 
    letterSpacing: 1.5, 
    textTransform: "uppercase", 
    marginBottom: 8, 
    textAlign: "center" 
  },
  sectionTitle: { 
    fontSize: 30, 
    fontWeight: 850, 
    textAlign: "center", 
    margin: "0 0 40px", 
    letterSpacing: -0.5,
    color: "#17324d",
    fontFamily: "Georgia, 'Times New Roman', serif"
  },

  stepsGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))", 
    gap: 18 
  },
  stepCard: { 
    background: "#f5f1e6", 
    borderRadius: 8, 
    padding: "28px", 
    border: "1px solid #c7d7e4",
    boxShadow: "0 4px 0 rgba(23,50,77,0.05)",
    transition: "all 0.2s ease"
  },
  stepNum: { 
    fontSize: 12, 
    fontWeight: 750, 
    color: "#1f5f8b", 
    marginBottom: 12,
    display: "inline-block",
    padding: "4px 10px",
    background: "#dce9f2",
    borderRadius: "4px"
  },
  stepTitle: { fontSize: 16, fontWeight: 750, margin: "0 0 8px", color: "#17324d" },
  stepDesc: { fontSize: 13.5, color: "#47647d", lineHeight: 1.6, margin: 0 },

  featureGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))", 
    gap: 30,
    maxWidth: 930,
    margin: "0 auto"
  },
  singleCardStage: {
    display: "flex",
    justifyContent: "center",
    minHeight: 210
  },
  carouselDots: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 22
  },
  carouselDot: {
    width: 9,
    height: 9,
    padding: 0,
    border: "none",
    borderRadius: "50%",
    background: "#a9c5d8",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  carouselDotActive: {
    width: 25,
    borderRadius: 8,
    background: "#1f5f8b"
  },
  featureCard: { 
    background: "#f5f1e6", 
    borderRadius: 8, 
    padding: "30px", 
    border: "1px solid #c7d7e4",
    boxShadow: "0 4px 0 rgba(23,50,77,0.05)",
    transition: "all 0.2s ease"
  },
  featureIcon: { 
    width: 42, 
    height: 42, 
    borderRadius: 10, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontSize: 20, 
    marginBottom: 16,
    background: "#f7e7a8",
    color: "#1f5f8b",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontWeight: 700
  },
  featureTitle: { fontSize: 16, fontWeight: 750, margin: "0 0 8px", color: "#17324d" },
  featureDesc: { fontSize: 13.5, color: "#47647d", lineHeight: 1.6, margin: 0 },

  finalCtaContainer: {
    background: "#eaf1f7",
    padding: "80px 48px"
  },
  finalCta: { 
    textAlign: "center", 
    background: "#1f5f8b", 
    borderRadius: 10, 
    padding: "58px 36px", 
    maxWidth: 1104,
    margin: "0 auto",
    boxShadow: "0 8px 0 rgba(23,50,77,0.08)"
  },
  finalCtaTitle: { fontSize: 30, fontWeight: 850, color: "#fffdf7", margin: "0 0 10px", letterSpacing: -0.5, fontFamily: "Georgia, 'Times New Roman', serif" },
  finalCtaSub: { fontSize: 14.5, color: "#e0edf5", margin: "0 0 28px", maxWidth: 460, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 },
  finalCtaBtn: { 
    padding: "13px 30px", 
    borderRadius: 8, 
    border: "none", 
    background: "#1f5f8b", 
    color: "#ffffff", 
    fontSize: 14.5, 
    fontWeight: 700, 
    cursor: "pointer",
    transition: "all 0.2s ease"
  },

  footer: { 
    textAlign: "center", 
    padding: "32px 20px", 
    fontSize: 13, 
    color: "#47647d", 
    background: "#dce9f2", 
    borderTop: "1px solid #c3d8e7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap"
  },
  adminFooterLink: {
    background: "transparent",
    border: "none",
    color: "#1f5f8b",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 650,
    textDecoration: "underline",
    padding: 0
  }
};

const translations = {
  EN: {
    signIn: "Sign In",
    getStarted: "Get Started",
    forEmployers: "For Employers / Majikan",
    portalLabel: "Portal:",
    studentTab: "Student",
    industryTab: "Industry",
    institutionalLogin: "Institutional Portal",
    workflowEyebrow: "Workflow",
    workflowTitle: "Standardized Evaluation Process",
    capabilitiesEyebrow: "Capabilities",
    capabilitiesTitle: "Built for Early-Career Professionals",
    partnersTitle: "Trusted by Leading Industry Partners",
    noPartnersText: "No approved industry partners registered yet.",
    finalTitle: "Ready to begin your career evaluation?",
    finalSub: "Upload your current resume to generate an objective readiness score in minutes.",
    finalBtn: "Create Student Account",
    footerText: "© 2026 AI-CROS — AI-Powered Career Readiness & Opportunity Sourcing System",
    adminAccessText: "Admin Access",
    
    student: {
      eyebrow: "Student Career Portal",
      headlineText: "Bridge the gap between ",
      headlineAccent: "education and employment.",
      subtext: "AI-CROS evaluates student qualifications, enhances resumes for applicant tracking systems, and connects candidates directly with matching entry-level opportunities.",
      primaryCta: "Calculate Readiness Score",
      cardLabel: "Candidate Readiness Index",
      metrics: [["Project Impact", 85], ["ATS Compatibility", 92], ["Skill Alignment", 87], ["Simulation Score", 90]]
    },
    industry: {
      eyebrow: "Industry Partner Portal",
      headlineText: "Source pre-vetted top talent with ",
      headlineAccent: "verified readiness metrics.",
      subtext: "Connect directly with high-performing university graduates whose practical skills and project simulations match your exact hiring prerequisites.",
      primaryCta: "Post Opportunity / Hire",
      cardLabel: "Talent Quality Index",
      metrics: [["Verified Skill Match", 94], ["Candidate Readiness", 89], ["Simulation Success", 91], ["Retention Predictor", 95]]
    },

    steps: [
      { title: "Upload Profile & Resume", desc: "Instantly parse academic history, projects, and work experience into standard formats." },
      { title: "Target Relevant Roles", desc: "Browse curated internships and entry-level positions aligned with your skill set." },
      { title: "Complete Simulations", desc: "Take role-specific assessments to validate practical capability before applying." },
      { title: "Submit Verified Portfolio", desc: "Provide hiring managers with a comprehensive readiness score backed by data." }
    ],

    features: [
      { icon: "01", title: "Resume Optimization", desc: "Convert course projects and campus involvement into professional, results-oriented achievements." },
      { icon: "02", title: "Targeted Matching", desc: "Filter opportunities by precise technical proficiencies and verified skill overlap." },
      { icon: "03", title: "Readiness Simulations", desc: "Demonstrate workplace preparedness through structured professional evaluations." },
      { icon: "04", title: "Unified Profile Dashboard", desc: "Maintain a single reliable record of your academic and practical qualifications." }
    ]
  },
  MS: {
    signIn: "Log Masuk",
    getStarted: "Mulakan",
    forEmployers: "Untuk Majikan - Iklan Kerja",
    portalLabel: "Portal:",
    studentTab: "Pelajar",
    industryTab: "Industri",
    institutionalLogin: "Portal Institusi",
    workflowEyebrow: "Alur Kerja",
    workflowTitle: "Proses Penilaian Standard",
    capabilitiesEyebrow: "Keupayaan",
    capabilitiesTitle: "Dibina untuk Profesional Kerjaya Awal",
    partnersTitle: "Diberi Kepercayaan oleh Rakan Industri Terkemuka",
    noPartnersText: "Tiada rakan industri yang diluluskan berdaftar buat masa ini.",
    finalTitle: "Bersedia untuk memulakan penilaian kerjaya anda?",
    finalSub: "Muat naik resume semasa anda untuk menjana skor kesiapsiagaan objektif dalam beberapa minit.",
    finalBtn: "Cipta Akaun Pelajar",
    footerText: "© 2026 AI-CROS — Sistem Kesiapsiagaan Kerjaya & Sumber Peluang Berasaskan AI",
    adminAccessText: "Akses Admin",
    
    student: {
      eyebrow: "Portal Kerjaya Pelajar",
      headlineText: "Rapatkan jurang antara ",
      headlineAccent: "pendidikan dan pekerjaan.",
      subtext: "AI-CROS menilai kelayakan pelajar, menambah baik resume untuk sistem penjejakan pemohon, dan menghubungkan calon terus dengan peluang peringkat permulaan.",
      primaryCta: "Kira Skor Kesiapsiagaan",
      cardLabel: "Indeks Kesiapsiagaan Calon",
      metrics: [["Impak Projek", 85], ["Keserasian ATS", 92], ["Penjajaran Kemahiran", 87], ["Skor Simulasi", 90]]
    },
    industry: {
      eyebrow: "Portal Rakan Industri",
      headlineText: "Dapatkan bakat teratas yang disaring dengan ",
      headlineAccent: "metrik kesiapsiagaan disahkan.",
      subtext: "Berhubung terus dengan graduan universiti berprestasi tinggi yang kemahiran praktikal dan simulasi projeknya sepadan dengan keperluan pengambilan anda.",
      primaryCta: "Tawar Peluang / Ambil",
      cardLabel: "Indeks Kualiti Bakat",
      metrics: [["Padanan Kemahiran", 94], ["Kesiapsiagaan Calon", 89], ["Kejayaan Simulasi", 91], ["Ramalan Pengekalan", 95]]
    },

    steps: [
      { title: "Muat Naik Profil & Resume", desc: "Urai sejarah akademik, projek, dan pengalaman kerja serta-merta ke dalam format standard." },
      { title: "Sasarkan Peranan Berkaitan", desc: "Semak imbas latihan industri dan jawatan peringkat permulaan yang selaras dengan kemahiran anda." },
      { title: "Lengkapkan Simulasi", desc: "Ambil penilaian khusus peranan untuk mengesahkan keupayaan praktikal sebelum memohon." },
      { title: "Hantar Portfolio Disahkan", desc: "Berikan pengurus pengambilan skor kesiapsiagaan komprehensif yang disokong data." }
    ],

    features: [
      { icon: "01", title: "Pengoptimuman Resume", desc: "Tukar projek kursus dan penglibatan kampus kepada pencapaian profesional yang berorientasikan hasil." },
      { icon: "02", title: "Padanan Sasaran", desc: "Tapis peluang mengikut kecekapan teknikal yang tepat dan pertindihan kemahiran yang disahkan." },
      { icon: "03", title: "Simulasi Kesiapsiagaan", desc: "Demonstrasikan kesiapsiagaan tempat kerja melalui penilaian profesional berstruktur." },
      { icon: "04", title: "Papan Pemuka Profil Bersatu", desc: "Kekalkan rekod tunggal yang boleh dipercayai untuk kelayakan akademik dan praktikal anda." }
    ]
  }
};

function AnimatedScoreRing({ target = 88, size = 120 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const duration = 1200;
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
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e2e8f0" strokeWidth={7} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="#1f5f8b" strokeWidth={7} fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.1s linear" }}
      />
      <text
        x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        style={{ transform: `rotate(90deg) translate(0px, -${size}px)`, transformOrigin: `${size / 2}px ${size / 2}px`, fontSize: 26, fontWeight: 800, fill: "#17324d", fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {value}
      </text>
    </svg>
  );
}

function Homepage({ onLoginClick, onRegisterClick, onEmployerClick }) {
  const [lang, setLang] = useState("EN");
  const [livePartners, setLivePartners] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [featureIndex, setFeatureIndex] = useState(0);

  // Automatically fetch live approved industry partners from FastAPI backend
  useEffect(() => {
    fetch("http://localhost:8000/auth/industry/approved-partners")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch approved partners (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setLivePartners(data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch approved industry partners:", err);
      });
  }, []);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((current) => (current + 1) % 4);
    }, 4500);
    const featureTimer = setInterval(() => {
      setFeatureIndex((current) => (current + 1) % 4);
    }, 5200);
    return () => {
      clearInterval(stepTimer);
      clearInterval(featureTimer);
    };
  }, []);

  const t = translations[lang];
  const content = t.student;
  const activeStep = t.steps[stepIndex];
  const activeFeature = t.features[featureIndex];

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={styles.page}>
      <style>{`
        button:hover { opacity: 0.92; }
        .step-card:hover, .feature-card:hover, .partner-card:hover {
          border-color: #1f5f8b !important;
          box-shadow: 0 6px 16px rgba(23,50,77,0.10) !important;
        }
        .step-card, .feature-card {
          animation: cardFloat 4.8s ease-in-out infinite alternate;
          will-change: transform;
        }
        .step-card:hover, .feature-card:hover {
          transform: translateY(-7px) rotate(-0.5deg);
        }
        .step-card:nth-child(2), .feature-card:nth-child(2) {
          animation-delay: 700ms;
        }
        .step-card:nth-child(3), .feature-card:nth-child(3) {
          animation-delay: 1400ms;
        }
        .step-card:nth-child(4), .feature-card:nth-child(4) {
          animation-delay: 2100ms;
        }
        .step-card:nth-child(1), .feature-card:nth-child(1) {
          background: #e5eff7 !important;
          border-top: 4px solid #2f78a8;
        }
        .step-card:nth-child(2), .feature-card:nth-child(2) {
          background: #f3e5e1 !important;
          border-top: 4px solid #bc6b5d;
        }
        .step-card:nth-child(3), .feature-card:nth-child(3) {
          background: #e4eee7 !important;
          border-top: 4px solid #5f8b70;
        }
        .step-card:nth-child(4), .feature-card:nth-child(4) {
          background: #e9e5ee !important;
          border-top: 4px solid #75627f;
        }
        .feature-card:nth-child(1) .feature-icon { background: #c9dfef !important; color: #245d83; }
        .feature-card:nth-child(2) .feature-icon { background: #e7c9c1 !important; color: #8e4e43; }
        .feature-card:nth-child(3) .feature-icon { background: #cbe1d2 !important; color: #466b54; }
        .feature-card:nth-child(4) .feature-icon { background: #d8cfe0 !important; color: #5d4b68; }
        .step-card-0, .feature-card-0 { background: #e5eff7 !important; border-top: 4px solid #2f78a8; }
        .step-card-1, .feature-card-1 { background: #f3e5e1 !important; border-top: 4px solid #bc6b5d; }
        .step-card-2, .feature-card-2 { background: #e4eee7 !important; border-top: 4px solid #5f8b70; }
        .step-card-3, .feature-card-3 { background: #e9e5ee !important; border-top: 4px solid #75627f; }
        .feature-card-0 .feature-icon { background: #c9dfef !important; color: #245d83; }
        .feature-card-1 .feature-icon { background: #e7c9c1 !important; color: #8e4e43; }
        .feature-card-2 .feature-icon { background: #cbe1d2 !important; color: #466b54; }
        .feature-card-3 .feature-icon { background: #d8cfe0 !important; color: #5d4b68; }
        @keyframes cardFloat {
          from { transform: translateY(0); }
          to { transform: translateY(-8px); }
        }
        @keyframes partnerMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 10px)); }
        }
        .partner-grid:hover .partner-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .partner-track, .step-card, .feature-card {
            animation: none;
            transform: translateX(0);
          }
        }
        @media (max-width: 720px) {
          .homepage-nav {
            padding: 16px 20px !important;
            flex-wrap: wrap;
            gap: 14px;
          }
          .homepage-nav-right {
            width: 100%;
            justify-content: flex-end;
            flex-wrap: wrap;
          }
          .steps-grid, .feature-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <nav className="homepage-nav" style={styles.nav}>
        <button style={styles.logoButton} onClick={handleLogoClick} title="AI-CROS Home">
          <img src="/ai-cros-logo.png" alt="AI-CROS Logo" style={styles.logoImg} />
          <span style={styles.logoText}>AI-CROS</span>
        </button>

        <div className="homepage-nav-right" style={styles.navRight}>
          <button 
            style={styles.employerNavBtn} 
            onClick={onEmployerClick}
          >
            {t.forEmployers}
          </button>
          
          <div style={styles.navActions}>
            <button style={styles.navLoginBtn} onClick={() => onLoginClick("student")}>{t.signIn}</button>
            <button style={styles.navRegisterBtn} onClick={() => onRegisterClick("student")}>{t.getStarted}</button>
          </div>

          <label style={styles.languageControl} title="Choose language">
            <span aria-hidden="true" style={styles.languageIcon}>文A</span>
            <select aria-label="Choose language" style={styles.langSelect} value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="EN">English</option>
              <option value="MS">Bahasa Melayu</option>
            </select>
          </label>
        </div>
      </nav>

      <div style={styles.heroWrapper}>
        <div style={styles.heroOverlay} />
        <header style={styles.hero}>
          <div style={styles.heroLeft}>
            
            <h1 style={styles.headline}>
              {content.headlineText}<span style={styles.headlineAccent}>{content.headlineAccent}</span>
            </h1>
            <p style={styles.subtext}>
              {content.subtext}
            </p>
            <div style={styles.heroCtaRow}>
              <button style={styles.ctaPrimary} onClick={() => onRegisterClick("student")}>{content.primaryCta}</button>
              <button style={styles.ctaSecondary} onClick={() => onLoginClick("student")}>{t.institutionalLogin}</button>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.scoreCard}>
              <p style={styles.scoreCardLabel}>{content.cardLabel}</p>
              <div style={styles.scoreRingWrap}>
                <AnimatedScoreRing target={88} />
              </div>
              {content.metrics.map(([label, val]) => (
                <div key={label} style={styles.scoreBreakdownRow}>
                  <span>{label}</span>
                  <span style={styles.scoreBreakdownVal}>{val} / 100</span>
                </div>
              ))}
            </div>
          </div>
        </header>
      </div>

      <section style={styles.sectionAlt}>
        <p style={styles.sectionEyebrow}>{t.workflowEyebrow}</p>
        <h2 style={styles.sectionTitle}>{t.workflowTitle}</h2>
        <div style={styles.singleCardStage}>
          <div key={activeStep.title} className={`step-card step-card-${stepIndex}`} style={styles.stepCard}>
            <span style={styles.stepNum}>Step {stepIndex + 1}</span>
            <p style={styles.stepTitle}>{activeStep.title}</p>
            <p style={styles.stepDesc}>{activeStep.desc}</p>
          </div>
        </div>
        <div style={styles.carouselDots} aria-label="Workflow steps">
          {t.steps.map((step, index) => (
            <button
              key={step.title}
              type="button"
              aria-label={`Show workflow step ${index + 1}`}
              aria-pressed={stepIndex === index}
              style={{ ...styles.carouselDot, ...(stepIndex === index ? styles.carouselDotActive : {}) }}
              onClick={() => setStepIndex(index)}
            />
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>{t.capabilitiesEyebrow}</p>
        <h2 style={styles.sectionTitle}>{t.capabilitiesTitle}</h2>
        <div style={styles.singleCardStage}>
          <div key={activeFeature.title} className={`feature-card feature-card-${featureIndex}`} style={styles.featureCard}>
            <div style={styles.featureIcon}>{activeFeature.icon}</div>
            <p style={styles.featureTitle}>{activeFeature.title}</p>
            <p style={styles.featureDesc}>{activeFeature.desc}</p>
          </div>
        </div>
        <div style={styles.carouselDots} aria-label="Capabilities">
          {t.features.map((feature, index) => (
            <button
              key={feature.title}
              type="button"
              aria-label={`Show capability ${index + 1}`}
              aria-pressed={featureIndex === index}
              style={{ ...styles.carouselDot, ...(featureIndex === index ? styles.carouselDotActive : {}) }}
              onClick={() => setFeatureIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Fully Dynamic Live Industry Partners Grid */}
      <section style={styles.partnersSection}>
        <p style={styles.sectionEyebrow}>{lang === "EN" ? "Our Network" : "Rangkaian Kami"}</p>
        <h2 style={styles.sectionTitle}>{t.partnersTitle}</h2>
        <div style={styles.partnerGrid}>
          {livePartners.length > 0 ? (
            <div className="partner-track" style={styles.partnerTrack}>
              {livePartners.map((partner, idx) => (
                <div key={`partner-${idx}`} className="partner-card" style={styles.partnerCard}>
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} style={styles.partnerLogoImg} />
                  ) : (
                    <div style={styles.partnerInitialFallback}>
                      {partner.name ? partner.name.charAt(0).toUpperCase() : "C"}
                    </div>
                  )}
                  <p style={styles.partnerName}>{partner.name}</p>
                  <p style={styles.partnerRole}>{partner.role}</p>
                </div>
              ))}
              <div aria-hidden="true" style={styles.partnerCopy}>
                {livePartners.map((partner, idx) => (
                  <div key={`partner-copy-${idx}`} className="partner-card" style={styles.partnerCard}>
                    {partner.logo ? (
                      <img src={partner.logo} alt="" style={styles.partnerLogoImg} />
                    ) : (
                      <div style={styles.partnerInitialFallback}>
                        {partner.name ? partner.name.charAt(0).toUpperCase() : "C"}
                      </div>
                    )}
                    <p style={styles.partnerName}>{partner.name}</p>
                    <p style={styles.partnerRole}>{partner.role}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={styles.emptyPartnersText}>{t.noPartnersText}</p>
          )}
        </div>
      </section>

      <div style={styles.finalCtaContainer}>
        <div style={styles.finalCta}>
          <p style={styles.finalCtaTitle}>{t.finalTitle}</p>
          <p style={styles.finalCtaSub}>{t.finalSub}</p>
          <button style={styles.finalCtaBtn} onClick={() => onRegisterClick("student")}>{t.finalBtn}</button>
        </div>
      </div>

      <footer style={styles.footer}>
        <span>{t.footerText}</span>
        <span>·</span>
        <button 
          style={styles.adminFooterLink} 
          onClick={() => onLoginClick("admin")}
        >
          {t.adminAccessText}
        </button>
      </footer>
    </div>
  );
}

export default Homepage;