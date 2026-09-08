import { useState, useEffect } from "react";
import { getIndustryAccounts, getCourses } from "../../services/adminService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F7F5", minHeight: "100vh" },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 800, margin: 0 },
  subtitle: { fontSize: 14, color: "#666", margin: "4px 0 0" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 },
  card: { background: "white", borderRadius: 14, padding: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" },
  cardValue: { fontSize: 32, fontWeight: 800, margin: 0 },
  cardLabel: { fontSize: 12.5, color: "#777", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: 0.5 },
};

function AdminDashboard({ admin }) {
  const [accounts, setAccounts] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getIndustryAccounts(admin.admin_id).then(setAccounts).catch(() => {});
    getCourses().then(setCourses).catch(() => {});
  }, [admin.admin_id]);

  const pending = accounts.filter((a) => a.verification_status === "Pending");
  const approved = accounts.filter((a) => a.verification_status === "Approved").length;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome, {admin.username}</h1>
        <p style={styles.subtitle}>Manage industry accounts and upskilling courses.</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.cardValue}>{accounts.length}</p>
          <p style={styles.cardLabel}>Total industry accounts</p>
        </div>
        <div style={styles.card}>
          <p style={{ ...styles.cardValue, color: "#b8860b" }}>{pending.length}</p>
          <p style={styles.cardLabel}>Pending approval</p>
        </div>
        <div style={styles.card}>
          <p style={{ ...styles.cardValue, color: "#1a7a44" }}>{approved}</p>
          <p style={styles.cardLabel}>Approved accounts</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardValue}>{courses.length}</p>
          <p style={styles.cardLabel}>Upskilling courses</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;