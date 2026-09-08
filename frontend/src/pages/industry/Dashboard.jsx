import { useState, useEffect } from "react";
import { getJobsByIndustry, getApplicants } from "../../services/industryService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F7F5", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 800, margin: 0 },
  subtitle: { fontSize: 14, color: "#666", margin: "4px 0 0" },
  logoutBtn: { padding: "8px 16px", borderRadius: 10, border: "1px solid #E0E0E0", background: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#555" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  card: { background: "white", borderRadius: 14, padding: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" },
  cardValue: { fontSize: 32, fontWeight: 800, margin: 0 },
  cardLabel: { fontSize: 12.5, color: "#777", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: 0.5 },
};

function IndustryDashboard({ industry, onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    getJobsByIndustry(industry.industry_id)
      .then(setJobs)
      .catch(() => {});

    getApplicants(industry.industry_id)
      .then(setApplicants)
      .catch(() => {});
  }, [industry.industry_id]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Welcome, {industry.company_name}
          </h1>

          <p style={styles.subtitle}>
            Manage your job listings and review applicants.
          </p>
        </div>

        <button
          style={styles.logoutBtn}
          onClick={onLogout}
        >
          Log out
        </button>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.cardValue}>{jobs.length}</p>
          <p style={styles.cardLabel}>Active job listings</p>
        </div>

        <div style={styles.card}>
          <p style={styles.cardValue}>{applicants.length}</p>
          <p style={styles.cardLabel}>Total applicants</p>
        </div>

        <div style={styles.card}>
          <p style={styles.cardValue}>
            {
              applicants.filter(
                (a) => a.application_status === "Pending"
              ).length
            }
          </p>

          <p style={styles.cardLabel}>Pending review</p>
        </div>
      </div>
    </div>
  );
}

export default IndustryDashboard;