import { useState, useEffect } from "react";
import { getMyApplications } from "../../services/jobService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", background: "#eaf1f7", minHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 850, margin: "0 0 4px", color: "#17324d" },
  subtitle: { fontSize: 14, color: "#47647d", margin: "0 0 24px" },
  loadingText: { textAlign: "center", color: "#557086", padding: 40 },

  card: {
    background: "#f5f1e6", borderRadius: 10, padding: 18, marginBottom: 10,
    border: "1px solid #c7d7e4", boxShadow: "0 5px 14px rgba(23,50,77,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  jobTitle: { fontSize: 15, fontWeight: 700, margin: 0, color: "#17324d" },
  statusBadge: (status) => {
    const colors = {
      Pending: { bg: "#eee3bf", text: "#7a5a08", border: "#d9c98e" },
      Approved: { bg: "#dce9f2", text: "#1f5f8b", border: "#b8cddd" },
      Rejected: { bg: "#f3e5e1", text: "#9b4d57", border: "#e1c2bb" },
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