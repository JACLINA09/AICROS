import { useState, useEffect } from "react";
import { getMyApplications } from "../../services/jobService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#0d1117", minHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: "#f8fafc" },
  subtitle: { fontSize: 14, color: "#94a3b8", margin: "0 0 24px" },
  loadingText: { textAlign: "center", color: "#94a3b8", padding: 40 },

  card: {
    background: "#161b22", borderRadius: 14, padding: 18, marginBottom: 10,
    border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)", display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  jobTitle: { fontSize: 15, fontWeight: 700, margin: 0, color: "#f8fafc" },
  statusBadge: (status) => {
    const colors = {
      Pending: { bg: "rgba(234, 179, 8, 0.1)", text: "#facc15", border: "rgba(234, 179, 8, 0.2)" },
      Approved: { bg: "rgba(34, 197, 94, 0.1)", text: "#4ade80", border: "rgba(34, 197, 94, 0.2)" },
      Rejected: { bg: "rgba(239, 68, 68, 0.1)", text: "#f87171", border: "rgba(239, 68, 68, 0.2)" },
    };
    const c = colors[status] || colors.Pending;
    return { 
      background: c.bg, 
      color: c.text, 
      border: `1px solid ${c.border}`,
      fontSize: 12, 
      fontWeight: 700, 
      padding: "5px 12px", 
      borderRadius: 8 
    };
  },
};

function MyApplications({ student }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications(student.student_id)
      .then(setApplications)
      .finally(() => setLoading(false));
  }, [student.student_id]);

  if (loading) {
    return <div style={styles.page}><p style={styles.loadingText}>Loading your applications...</p></div>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>My Applications</h1>
      <p style={styles.subtitle}>Track the status of jobs you have applied for.</p>

      {applications.length === 0 ? (
        <p style={styles.loadingText}>You haven't applied to any jobs yet.</p>
      ) : (
        applications.map((app) => (
          <div key={app.application_id} style={styles.card}>
            <p style={styles.jobTitle}>{app.job_title}</p>
            <span style={styles.statusBadge(app.application_status)}>{app.application_status}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default MyApplications;