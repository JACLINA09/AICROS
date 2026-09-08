import { useState, useEffect } from "react";
import { getApplicants, updateApplicationStatus } from "../../services/industryService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F7F5", minHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 800, margin: "0 0 4px" },
  subtitle: { fontSize: 14, color: "#666", margin: "0 0 24px" },
  loadingText: { textAlign: "center", color: "#888", padding: 40 },
  card: { background: "white", borderRadius: 14, padding: 18, marginBottom: 10, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 15, fontWeight: 700, margin: 0 },
  jobTitle: { fontSize: 12.5, color: "#777", margin: "2px 0 0" },
  select: { padding: "7px 12px", borderRadius: 8, border: "1px solid #D0D0D0", fontSize: 13, fontWeight: 600 },
};

function Applicants({ industry }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApplicants(industry.industry_id).then(setApplicants).finally(() => setLoading(false));
  }, [industry.industry_id]);

  const handleStatusChange = async (applicationId, newStatus) => {
    await updateApplicationStatus(applicationId, newStatus);
    setApplicants((prev) => prev.map((a) => (a.application_id === applicationId ? { ...a, application_status: newStatus } : a)));
  };

  if (loading) return <div style={styles.page}><p style={styles.loadingText}>Loading applicants...</p></div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Applicants</h1>
      <p style={styles.subtitle}>Review students who applied to your job listings.</p>

      {applicants.length === 0 ? (
        <p style={styles.loadingText}>No applicants yet.</p>
      ) : (
        applicants.map((a) => (
          <div key={a.application_id} style={styles.card}>
            <div>
              <p style={styles.name}>{a.student_name}</p>
              <p style={styles.jobTitle}>Applied for: {a.job_title}</p>
            </div>
            <select
              style={styles.select}
              value={a.application_status}
              onChange={(e) => handleStatusChange(a.application_id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}

export default Applicants;