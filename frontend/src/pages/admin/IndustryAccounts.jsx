import { useState, useEffect } from "react";
import { getIndustryAccounts, approveIndustry, rejectIndustry } from "../../services/adminService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F7F5", minHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 800, margin: "0 0 4px" },
  subtitle: { fontSize: 14, color: "#666", margin: "0 0 24px" },
  loadingText: { textAlign: "center", color: "#888", padding: 40 },
  card: { background: "white", borderRadius: 14, padding: 18, marginBottom: 10, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 15, fontWeight: 700, margin: 0 },
  meta: { fontSize: 12.5, color: "#777", margin: "2px 0 0" },
  statusBadge: (status) => {
    const colors = {
      Pending: { bg: "#FFF6E5", text: "#b8860b" },
      Approved: { bg: "#E9F7EF", text: "#1a7a44" },
      Rejected: { bg: "#FDECEC", text: "#c0392b" },
    };
    const c = colors[status] || colors.Pending;
    return { background: c.bg, color: c.text, fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 8, marginRight: 10 };
  },
  actionRow: { display: "flex", alignItems: "center", gap: 8 },
  approveBtn: { padding: "7px 14px", borderRadius: 8, border: "none", background: "#1a7a44", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" },
  rejectBtn: { padding: "7px 14px", borderRadius: 8, border: "none", background: "#c0392b", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" },
};

function IndustryAccounts({ admin }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getIndustryAccounts(admin.admin_id).then(setAccounts).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [admin.admin_id]);

  const handleApprove = async (industryId) => {
    await approveIndustry(industryId, admin.admin_id);
    load();
  };

  const handleReject = async (industryId) => {
    await rejectIndustry(industryId);
    load();
  };

  if (loading) return <div style={styles.page}><p style={styles.loadingText}>Loading industry accounts...</p></div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Industry Accounts</h1>
      <p style={styles.subtitle}>Approve or reject company registrations.</p>

      {accounts.length === 0 ? (
        <p style={styles.loadingText}>No industry accounts yet.</p>
      ) : (
        accounts.map((a) => (
          <div key={a.industry_id} style={styles.card}>
            <div>
              <p style={styles.name}>{a.company_name}</p>
              <p style={styles.meta}>{a.contact_person} · {a.email}</p>
            </div>
            <div style={styles.actionRow}>
              <span style={styles.statusBadge(a.verification_status)}>{a.verification_status}</span>
              {a.verification_status === "Pending" && (
                <>
                  <button style={styles.approveBtn} onClick={() => handleApprove(a.industry_id)}>Approve</button>
                  <button style={styles.rejectBtn} onClick={() => handleReject(a.industry_id)}>Reject</button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default IndustryAccounts;