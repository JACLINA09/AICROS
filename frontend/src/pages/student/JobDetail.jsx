import { useState, useEffect } from "react";
import { getJobDetail, applyToJob } from "../../services/jobService";
import { getLatestResume } from "../../services/resumeService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F7F5", minHeight: "100vh" },
  backBtn: {
    padding: "6px 14px", borderRadius: 8, border: "1px solid #D0D0D0", background: "white",
    fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: "#444", marginBottom: 20,
  },
  loadingText: { textAlign: "center", color: "#888", padding: 40 },
  error: { color: "#dc2626", fontSize: 13, textAlign: "center", padding: 20 },

  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 800, margin: "0 0 4px" },
  meta: { fontSize: 14, color: "#777", margin: 0 },

  compatBox: { textAlign: "center", flexShrink: 0 },
  compatScore: (score) => ({
    fontSize: 40, fontWeight: 800, margin: 0,
    color: score >= 70 ? "#1a7a44" : score >= 40 ? "#b8860b" : "#c0392b",
  }),
  compatLabel: { fontSize: 11.5, color: "#888", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: 0.5 },

  card: { background: "white", borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" },
  sectionTitle: { fontSize: 14, fontWeight: 700, margin: "0 0 10px" },
  bodyText: { fontSize: 13.5, color: "#555", lineHeight: 1.7, margin: 0 },

  skillsRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 },
  skillChipMatched: {
    background: "#E9F7EF", border: "1px solid #A8DCC0", color: "#1a7a44",
    fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 8,
  },
  skillChipMissing: {
    background: "#FDECEC", border: "1px solid #F3B6B6", color: "#c0392b",
    fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 8,
  },

  applyBtn: {
    width: "100%", padding: "13px", borderRadius: 10, border: "none",
    background: "linear-gradient(90deg, #2563eb, #7c3aed)", color: "white",
    fontSize: 14.5, fontWeight: 700, cursor: "pointer",
  },
  applyBtnDisabled: {
    width: "100%", padding: "13px", borderRadius: 10, border: "1px solid #A8DCC0",
    background: "#E9F7EF", color: "#1a7a44", fontSize: 14.5, fontWeight: 700, cursor: "default",
  },
  applyError: { color: "#dc2626", fontSize: 13, textAlign: "center", marginTop: 10 },
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

    </div>
  );
}

export default JobDetail;