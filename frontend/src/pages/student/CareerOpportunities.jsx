import { useState, useEffect } from "react";
import { getJobs } from "../../services/jobService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", background: "#eaf1f7", minHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 850, margin: "0 0 4px", color: "#17324d" },
  subtitle: { fontSize: 14, color: "#47647d", margin: "0 0 24px" },
  loadingText: { textAlign: "center", color: "#557086", padding: 40 },
  error: { color: "#bc6b5d", fontSize: 13, textAlign: "center", padding: 20 },

  grid: { display: "grid", gridTemplateColumns: "1fr", gap: 14 },
  card: {
    background: "#f5f1e6", borderRadius: 10, padding: 22,
    border: "1px solid #c7d7e4", boxShadow: "0 5px 14px rgba(23,50,77,0.08)", display: "flex", justifyContent: "space-between", gap: 20,
  },
  jobTitle: { fontSize: 17, fontWeight: 700, margin: "0 0 4px", color: "#17324d" },
  jobMeta: { fontSize: 13, color: "#557086", margin: "0 0 12px" },
  jobDesc: { fontSize: 13.5, color: "#47647d", margin: "0 0 14px", lineHeight: 1.6, maxWidth: 560 },

  skillsRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 },
  skillChipMatched: {
    background: "#dce9f2", border: "1px solid #b8cddd", color: "#1f5f8b",
    fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 8,
  },
  skillChipMissing: {
    background: "#f3e5e1", border: "1px solid #e1c2bb", color: "#9b4d57",
    fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 8,
  },

  compatBox: { textAlign: "center", flexShrink: 0, width: 110 },
  compatScore: (score) => ({
    fontSize: 30, fontWeight: 800, margin: 0,
    color: score >= 70 ? "#2f78a8" : score >= 40 ? "#b5964a" : "#bc6b5d",
  }),
  compatLabel: { fontSize: 11, color: "#557086", margin: "2px 0 12px", textTransform: "uppercase", letterSpacing: 0.5 },
  viewBtn: {
    padding: "8px 16px", borderRadius: 8, border: "none",
    background: "#1f5f8b", color: "white",
    fontSize: 12.5, fontWeight: 600, cursor: "pointer",
  },
  simulationBtn: {
    padding: "8px 16px", borderRadius: 8, border: "1px solid #1f5f8b",
    background: "#dce9f2", color: "#1f5f8b",
    fontSize: 12.5, fontWeight: 700, cursor: "pointer", marginTop: 8,
  },
};

function CareerOpportunities({ student, onSelectJob, onStartSimulation }) {
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
              <button style={styles.simulationBtn} onClick={() => onStartSimulation(job.job_id)}>
                Start Simulation
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