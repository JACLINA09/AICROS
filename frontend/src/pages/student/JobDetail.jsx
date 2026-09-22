import { useState, useEffect } from "react";
import { getJobDetail, applyToJob } from "../../services/jobService";
import { getLatestResume } from "../../services/resumeService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", background: "#eaf1f7", minHeight: "100vh" },
  backBtn: {
    padding: "6px 14px", borderRadius: 8, border: "1px solid #b8cddd", background: "#f5f1e6",
    fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: "#234e70", marginBottom: 20,
  },
  loadingText: { textAlign: "center", color: "#557086", padding: 40 },
  error: { color: "#bc6b5d", fontSize: 13, textAlign: "center", padding: 20 },

  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 850, margin: "0 0 4px", color: "#17324d" },
  meta: { fontSize: 14, color: "#557086", margin: 0 },

  compatBox: { textAlign: "center", flexShrink: 0 },
  compatScore: (score) => ({
    fontSize: 40, fontWeight: 800, margin: 0,
    color: score >= 70 ? "#2f78a8" : score >= 40 ? "#b5964a" : "#bc6b5d",
  }),
  compatLabel: { fontSize: 11.5, color: "#557086", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: 0.5 },

  card: { background: "#f5f1e6", borderRadius: 10, padding: 24, marginBottom: 16, border: "1px solid #c7d7e4", boxShadow: "0 5px 14px rgba(23,50,77,0.08)" },
  sectionTitle: { fontSize: 14, fontWeight: 700, margin: "0 0 10px", color: "#17324d" },
  bodyText: { fontSize: 13.5, color: "#47647d", lineHeight: 1.7, margin: 0 },

  skillsRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 },
  skillChipMatched: {
    background: "#dce9f2", border: "1px solid #b8cddd", color: "#1f5f8b",
    fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 8,
  },
  skillChipMissing: {
    background: "#f3e5e1", border: "1px solid #e1c2bb", color: "#9b4d57",
    fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 8,
  },

  applyBtn: {
    width: "100%", padding: "13px", borderRadius: 10, border: "none",
    background: "#1f5f8b", color: "white",
    fontSize: 14.5, fontWeight: 700, cursor: "pointer",
  },
  simulationBtn: {
    width: "100%", padding: "13px", borderRadius: 10, border: "1px solid #1f5f8b",
    background: "#dce9f2", color: "#1f5f8b", fontSize: 14.5, fontWeight: 700, cursor: "pointer", marginBottom: 10,
  },
  applyBtnDisabled: {
    width: "100%", padding: "13px", borderRadius: 10, border: "1px solid #b8cddd",
    background: "#dce9f2", color: "#1f5f8b", fontSize: 14.5, fontWeight: 700, cursor: "default",
  },
  applyError: { color: "#bc6b5d", fontSize: 13, textAlign: "center", marginTop: 10 },
};

function JobDetail({ jobId, student, onBack, onStartSimulation }) {
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getJobDetail(jobId, student.student_id),
      getLatestResume(student.student_id),
    ])
      .then(([jobData, resumeData]) => {
        setJob(jobData);
        setResume(resumeData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [jobId, student.student_id]);

  const handleApply = async () => {
    if (!job.simulation_completed) {
      setError("Complete the career simulation for this job before applying.");
      return;
    }
    if (!resume) {
      setError("Please upload a resume before applying.");
      return;
    }
    setApplying(true);
    setError("");
    try {
      await applyToJob(student.student_id, resume.resume_id, jobId);
      setApplied(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div style={styles.page}><p style={styles.loadingText}>Loading job details...</p></div>;
  }
  if (!job) {
    return <div style={styles.page}><p style={styles.error}>Job not found.</p></div>;
  }

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Back to Career Opportunities</button>

      <div style={styles.headerRow}>
        <div>
          <p style={styles.title}>{job.job_title}</p>
          <p style={styles.meta}>{job.location} · {job.job_type} · {job.salary}</p>
        </div>
        <div style={styles.compatBox}>
          <p style={styles.compatScore(job.compatibility_score)}>{job.compatibility_score}%</p>
          <p style={styles.compatLabel}>Skill match</p>
        </div>
      </div>

      <div style={styles.card}>
        <p style={styles.sectionTitle}>Job description</p>
        <p style={styles.bodyText}>{job.job_description}</p>
      </div>

      <div style={styles.card}>
        <p style={styles.sectionTitle}>Responsibilities</p>
        <p style={styles.bodyText}>{job.responsibilities}</p>
      </div>

      <div style={styles.card}>
        <p style={styles.sectionTitle}>Skill match breakdown</p>
        {job.matched_skills.length > 0 && (
          <div style={styles.skillsRow}>
            {job.matched_skills.map((s) => <span key={s} style={styles.skillChipMatched}>✓ {s}</span>)}
          </div>
        )}
        {job.missing_skills.length > 0 && (
          <div style={styles.skillsRow}>
            {job.missing_skills.map((s) => <span key={s} style={styles.skillChipMissing}>✗ {s}</span>)}
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <button style={styles.simulationBtn} onClick={() => onStartSimulation(jobId)}>
          Take Simulation for This Job →
        </button>
        {applied ? (
          <div style={styles.applyBtnDisabled}>✓ Applied Successfully</div>
        ) : !job.simulation_completed ? (
          <button style={styles.applyBtnDisabled} disabled>
            Complete Simulation to Apply
          </button>
        ) : (
          <button style={styles.applyBtn} disabled={applying} onClick={handleApply}>
            {applying ? "Submitting Application..." : "Apply Now"}
          </button>
        )}
        {error && <p style={styles.applyError}>{error}</p>}
      </div>

    </div>
  );
}

export default JobDetail;