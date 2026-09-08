import { useState, useEffect } from "react";
import { getJobs } from "../../services/jobService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F7F5", minHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 800, margin: "0 0 4px" },
  subtitle: { fontSize: 14, color: "#666", margin: "0 0 24px" },
  loadingText: { textAlign: "center", color: "#888", padding: 40 },
  error: { color: "#dc2626", fontSize: 13, textAlign: "center", padding: 20 },

  grid: { display: "grid", gridTemplateColumns: "1fr", gap: 14 },
  card: {
    background: "white", borderRadius: 16, padding: 22,
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", gap: 20,
  },
  jobTitle: { fontSize: 17, fontWeight: 700, margin: "0 0 4px" },
  jobMeta: { fontSize: 13, color: "#777", margin: "0 0 12px" },
  jobDesc: { fontSize: 13.5, color: "#555", margin: "0 0 14px", lineHeight: 1.6, maxWidth: 560 },

  skillsRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 },
  skillChipMatched: {
    background: "#E9F7EF", border: "1px solid #A8DCC0", color: "#1a7a44",
    fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 8,
  },
  skillChipMissing: {
    background: "#FDECEC", border: "1px solid #F3B6B6", color: "#c0392b",
    fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 8,
  },

  compatBox: { textAlign: "center", flexShrink: 0, width: 110 },
  compatScore: (score) => ({
    fontSize: 30, fontWeight: 800, margin: 0,
    color: score >= 70 ? "#1a7a44" : score >= 40 ? "#b8860b" : "#c0392b",
  }),
  compatLabel: { fontSize: 11, color: "#888", margin: "2px 0 12px", textTransform: "uppercase", letterSpacing: 0.5 },
  viewBtn: {
    padding: "8px 16px", borderRadius: 8, border: "none",
    background: "linear-gradient(90deg, #2563eb, #7c3aed)", color: "white",
    fontSize: 12.5, fontWeight: 600, cursor: "pointer",
  },
};

function CareerOpportunities({ student, onSelectJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getJobs(student.student_id)
      .then(setJobs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [student.student_id]);

  if (loading) {
    return <div style={styles.page}><p style={styles.loadingText}>Loading job opportunities...</p></div>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Career Opportunities</h1>
      <p style={styles.subtitle}>Jobs ranked by your compatibility score, based on your resume's extracted skills.</p>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        {jobs.map((job) => (
          <div key={job.job_id} style={styles.card}>
            <div>
              <p style={styles.jobTitle}>{job.job_title}</p>
              <p style={styles.jobMeta}>{job.location} · {job.job_type} · {job.salary}</p>
              <p style={styles.jobDesc}>{job.job_description}</p>

              {job.matched_skills.length > 0 && (
                <div style={styles.skillsRow}>
                  {job.matched_skills.map((s) => (
                    <span key={s} style={styles.skillChipMatched}>✓ {s}</span>
                  ))}
                </div>
              )}
              {job.missing_skills.length > 0 && (
                <div style={styles.skillsRow}>
                  {job.missing_skills.map((s) => (
                    <span key={s} style={styles.skillChipMissing}>✗ {s}</span>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.compatBox}>
              <p style={styles.compatScore(job.compatibility_score)}>{job.compatibility_score}%</p>
              <p style={styles.compatLabel}>Match</p>
              <button style={styles.viewBtn} onClick={() => onSelectJob(job.job_id)}>
                View details
              </button>
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && !error && (
        <p style={styles.loadingText}>No jobs available yet.</p>
      )}
    </div>
  );
}

export default CareerOpportunities;