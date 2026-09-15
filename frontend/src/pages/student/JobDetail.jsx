import { useState, useEffect } from "react";
import { getJobDetail, applyToJob } from "../../services/jobService";
import { getLatestResume } from "../../services/resumeService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#0d1117", minHeight: "100vh" },
  backBtn: {
    padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255, 255, 255, 0.12)", background: "#161b22",
    fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: "#cbd5e1", marginBottom: 20,
  },
  loadingText: { textAlign: "center", color: "#94a3b8", padding: 40 },
  error: { color: "#f87171", fontSize: 13, textAlign: "center", padding: 20 },

  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: "#f8fafc" },
  meta: { fontSize: 14, color: "#94a3b8", margin: 0 },

  compatBox: { textAlign: "center", flexShrink: 0 },
  compatScore: (score) => ({
    fontSize: 40, fontWeight: 800, margin: 0,
    color: score >= 70 ? "#4ade80" : score >= 40 ? "#facc15" : "#f87171",
  }),
  compatLabel: { fontSize: 11.5, color: "#94a3b8", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: 0.5 },

  card: { background: "#161b22", borderRadius: 16, padding: 24, marginBottom: 16, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" },
  sectionTitle: { fontSize: 14, fontWeight: 700, margin: "0 0 10px", color: "#f8fafc" },
  bodyText: { fontSize: 13.5, color: "#cbd5e1", lineHeight: 1.7, margin: 0 },

  skillsRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 },
  skillChipMatched: {
    background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", color: "#4ade80",
    fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 8,
  },
  skillChipMissing: {
    background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171",
    fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 8,
  },

  applyBtn: {
    width: "100%", padding: "13px", borderRadius: 10, border: "none",
    background: "#22c55e", color: "white",
    fontSize: 14.5, fontWeight: 700, cursor: "pointer",
  },
  applyBtnDisabled: {
    width: "100%", padding: "13px", borderRadius: 10, border: "1px solid rgba(34, 197, 94, 0.2)",
    background: "rgba(34, 197, 94, 0.1)", color: "#4ade80", fontSize: 14.5, fontWeight: 700, cursor: "default",
  },
  applyError: { color: "#f87171", fontSize: 13, textAlign: "center", marginTop: 10 },
};

function JobDetail({ jobId, student, onBack }) {
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
        {applied ? (
          <div style={styles.applyBtnDisabled}>✓ Applied Successfully</div>
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