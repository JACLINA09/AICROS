import { useState, useEffect } from "react";
import { getPortfolio } from "../../services/portfolioService";
import { applyToJob } from "../../services/jobService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", background: "#eaf1f7", minHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 850, margin: "0 0 4px", color: "#17324d" },
  subtitle: { fontSize: 14, color: "#47647d", margin: "0 0 24px" },
  loadingText: { textAlign: "center", color: "#557086", padding: 40 },
  error: { color: "#f87171", fontSize: 13, textAlign: "center", padding: 20 },

  heroCard: { borderRadius: 10, overflow: "hidden", marginBottom: 16, border: "1px solid #c7d7e4", boxShadow: "0 5px 14px rgba(23,50,77,0.08)" },
  heroTop: { background: "#1f5f8b", padding: "28px 32px", color: "white", borderBottom: "1px solid #2f78a8" },
  heroLabel: { fontSize: 12.5, fontWeight: 700, margin: "0 0 6px", opacity: 0.85, textTransform: "uppercase", letterSpacing: 0.6, color: "#dce9f2" },
  heroScore: { fontSize: 52, fontWeight: 800, margin: "0 0 4px", letterSpacing: -2, color: "#ffffff" },
  heroJob: { fontSize: 14, opacity: 0.9, margin: 0, color: "#e5eff7" },

  card: { background: "#f5f1e6", borderRadius: 10, padding: 24, marginBottom: 16, border: "1px solid #c7d7e4", boxShadow: "0 5px 14px rgba(23,50,77,0.08)" },
  breakdownGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 },
  breakdownBox: { textAlign: "center", padding: 16, borderRadius: 10, background: "#dce9f2", border: "1px solid #c7d7e4" },
  breakdownValue: { fontSize: 26, fontWeight: 800, margin: 0, color: "#17324d" },
  breakdownLabel: { fontSize: 11, color: "#557086", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: 0.4 },
  breakdownWeight: { fontSize: 10.5, color: "#557086", margin: "2px 0 0" },

  formulaBox: { background: "#eaf1f7", borderRadius: 10, padding: 14, fontSize: 12.5, color: "#557086", marginTop: 16, border: "1px solid #c7d7e4" },

  applyBtn: {
    width: "100%", padding: "13px", borderRadius: 10, border: "none",
    background: "#1f5f8b", color: "white",
    fontSize: 14.5, fontWeight: 700, cursor: "pointer",
  },
  applyBtnDisabled: {
    width: "100%", padding: "13px", borderRadius: 10, border: "1px solid rgba(34, 197, 94, 0.2)",
    background: "rgba(34, 197, 94, 0.1)", color: "#4ade80", fontSize: 14.5, fontWeight: 700, cursor: "default",
  },
};

function CareerPortfolio({ student, jobId = 1 }) {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    getPortfolio(student.student_id, jobId)
      .then(setPortfolio)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [student.student_id, jobId]);

  const handleApply = async () => {
    setApplying(true);
    setError("");
    try {
      await applyToJob(student.student_id, portfolio.resume_id ?? null, jobId);
      setApplied(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div style={styles.page}><p style={styles.loadingText}>Building your career portfolio...</p></div>;
  }
  if (error && !portfolio) {
    return <div style={styles.page}><p style={styles.error}>{error}</p></div>;
  }

  const score = portfolio.career_readiness_score ?? 0;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Career Portfolio</h1>
      <p style={styles.subtitle}>Your combined readiness score for {portfolio.job_title}.</p>

      <div style={styles.heroCard}>
        <div style={styles.heroTop}>
          <p style={styles.heroLabel}>Career readiness score</p>
          <p style={styles.heroScore}>{score}</p>
          <p style={styles.heroJob}>
            {score >= 80 ? "You're highly job-ready 🎉" : score >= 60 ? "Good progress — keep practising" : "Keep building your profile"}
          </p>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.breakdownGrid}>
          <div style={styles.breakdownBox}>
            <p style={styles.breakdownValue}>{portfolio.resume_quality_score ?? "—"}</p>
            <p style={styles.breakdownLabel}>Resume Quality</p>
            <p style={styles.breakdownWeight}>weight 15%</p>
          </div>
          <div style={styles.breakdownBox}>
            <p style={styles.breakdownValue}>{portfolio.ats_compatibiltiy_score ?? "—"}</p>
            <p style={styles.breakdownLabel}>ATS Score</p>
            <p style={styles.breakdownWeight}>weight 10%</p>
          </div>
          <div style={styles.breakdownBox}>
            <p style={styles.breakdownValue}>{portfolio.skill_match_score ?? "—"}</p>
            <p style={styles.breakdownLabel}>Skill Match</p>
            <p style={styles.breakdownWeight}>weight 25%</p>
          </div>
          <div style={styles.breakdownBox}>
            <p style={styles.breakdownValue}>{portfolio.simulation_score ?? "—"}</p>
            <p style={styles.breakdownLabel}>Simulation</p>
            <p style={styles.breakdownWeight}>weight 50%</p>
          </div>
        </div>

        <div style={styles.formulaBox}>
          Career readiness = (Resume × 0.15) + (ATS × 0.10) + (Skill match × 0.25) + (Simulation × 0.50) = <strong style={{ color: "#17324d" }}>{score}%</strong>
        </div>
      </div>

      <div style={styles.card}>
        {applied ? (
          <button style={styles.applyBtnDisabled} disabled>✓ Application submitted</button>
        ) : (
          <button style={styles.applyBtn} onClick={handleApply} disabled={applying}>
            {applying ? "Submitting..." : `Apply now to ${portfolio.job_title} →`}
          </button>
        )}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default CareerPortfolio;