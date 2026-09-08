import { useState, useEffect } from "react";
import { getMyApplications } from "../../services/jobService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F7F5", minHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 800, margin: "0 0 4px" },
  subtitle: { fontSize: 14, color: "#666", margin: "0 0 24px" },
  loadingText: { textAlign: "center", color: "#888", padding: 40 },

  card: {
    background: "white", borderRadius: 14, padding: 18, marginBottom: 10,
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  jobTitle: { fontSize: 15, fontWeight: 700, margin: 0 },
  statusBadge: (status) => {
    const colors = {
      Pending: { bg: "#FFF6E5", text: "#b8860b" },
      Approved: { bg: "#E9F7EF", text: "#1a7a44" },
      Rejected: { bg: "#FDECEC", text: "#c0392b" },
    };
    const c = colors[status] || colors.Pending;
    return { background: c.bg, color: c.text, fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 8 };
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