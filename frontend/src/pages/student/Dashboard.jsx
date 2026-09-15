import { useState, useEffect } from "react";

const styles = {
  page: { padding: "28px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#0d1117", minHeight: "100vh" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 800, margin: 0, color: "#f8fafc" },
  subtitle: { fontSize: 13.5, color: "#94a3b8", margin: "4px 0 0" },

  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 },
  statCard: { background: "#161b22", borderRadius: 16, padding: "18px 20px", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" },
  statTopRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  statLabel: { fontSize: 13, color: "#94a3b8", fontWeight: 600 },
  statBadge: (positive) => ({
    fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
    background: positive ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", 
    color: positive ? "#4ade80" : "#f87171",
    border: `1px solid ${positive ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}`
  }),
  statValue: { fontSize: 28, fontWeight: 800, margin: 0, color: "#f8fafc" },
  statSub: { fontSize: 12, color: "#64748b", margin: "2px 0 0" },

  bodyGrid: { display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, alignItems: "start" },

  mainCard: { background: "#161b22", borderRadius: 16, padding: 24, border: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.4)" },
  mainCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  mainCardTitle: { fontSize: 15, fontWeight: 700, margin: 0, color: "#f8fafc" },

  ringWrap: { display: "flex", alignItems: "center", gap: 28 },
  breakdownList: { flex: 1 },
  breakdownRow: { marginBottom: 14 },
  breakdownTopRow: { display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 },
  breakdownLabel: { color: "#94a3b8", fontWeight: 600 },
  breakdownVal: { color: "#f8fafc", fontWeight: 700 },
  barTrack: { height: 6, background: "rgba(255, 255, 255, 0.06)", borderRadius: 4 },
  barFill: (pct, color) => ({ height: "100%", width: `${pct}%`, background: color, borderRadius: 4 }),

  listCard: { background: "#161b22", borderRadius: 16, padding: 24, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" },
  jobRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" },
  jobTitle: { fontSize: 13.5, fontWeight: 700, margin: 0, color: "#f8fafc" },
  jobMeta: { fontSize: 11.5, color: "#64748b", margin: "2px 0 0" },
  jobScore: (score) => ({ fontSize: 13, fontWeight: 800, color: score >= 70 ? "#4ade80" : score >= 40 ? "#facc15" : "#f87171" }),

  sidebar: { display: "flex", flexDirection: "column", gap: 16 },
  sideCard: { background: "#161b22", borderRadius: 16, padding: 20, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" },
  sideCardTitle: { fontSize: 13.5, fontWeight: 700, margin: "0 0 14px", color: "#f8fafc" },
  taskRow: { display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" },
  taskDot: (done) => ({ width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0, background: done ? "#4ade80" : "rgba(255, 255, 255, 0.2)" }),
  taskLabel: { fontSize: 12.5, fontWeight: 600, color: "#cbd5e1", margin: 0 },
  taskSub: { fontSize: 11, color: "#64748b", margin: "2px 0 0" },

  tipCard: { background: "linear-gradient(135deg, #1f2937, #111827)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: 16, padding: 20, color: "white" },
  tipLabel: { fontSize: 12, fontWeight: 700, opacity: 0.85, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5, color: "#4ade80" },
  tipText: { fontSize: 13, lineHeight: 1.6, margin: "0 0 14px", color: "#cbd5e1" },
  tipBtn: { padding: "8px 14px", borderRadius: 9, border: "none", background: "#22c55e", color: "#ffffff", fontSize: 12.5, fontWeight: 700, cursor: "pointer" },
};

function Dashboard({ student, onNavigate }) {
  const readiness = 0; // wires to real data once portfolio is fetched per-job

  const journey = [
    { label: "Upload & analyse resume", page: "resume" },
    { label: "Talk to your AI Career Advisor", page: "advisor" },
    { label: "Browse career opportunities", page: "jobs" },
    { label: "Complete a career simulation", page: "simulation" },
    { label: "Apply via your portfolio", page: "portfolio" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Welcome back, {student.fullname.split(" ")[0]}</h1>
          <p style={styles.subtitle}>Here's where your career readiness stands today.</p>
        </div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statTopRow}>
            <span style={styles.statLabel}>Career Readiness</span>
          </div>
          <p style={styles.statValue}>{readiness}%</p>
          <p style={styles.statSub}>Combined score across resume, skills & simulation</p>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTopRow}>
            <span style={styles.statLabel}>Applications</span>
          </div>
          <p style={styles.statValue}>0</p>
          <p style={styles.statSub}>Jobs applied to so far</p>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTopRow}>
            <span style={styles.statLabel}>Simulations Taken</span>
          </div>
          <p style={styles.statValue}>0</p>
          <p style={styles.statSub}>Job-specific assessments completed</p>
        </div>
      </div>

      <div style={styles.bodyGrid}>
        <div>
          <div style={styles.mainCard}>
            <div style={styles.mainCardHeader}>
              <p style={styles.mainCardTitle}>Readiness breakdown</p>
            </div>
            <div style={styles.breakdownList}>
              {[
                ["Resume Quality", 0, "#3b82f6"],
                ["ATS Compatibility", 0, "#8b5cf6"],
                ["Skill Match", 0, "#14b8a6"],
                ["Simulation Score", 0, "#eab308"],
              ].map(([label, val, color]) => (
                <div key={label} style={styles.breakdownRow}>
                  <div style={styles.breakdownTopRow}>
                    <span style={styles.breakdownLabel}>{label}</span>
                    <span style={styles.breakdownVal}>{val}</span>
                  </div>
                  <div style={styles.barTrack}><div style={styles.barFill(val, color)} /></div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.listCard}>
            <div style={styles.mainCardHeader}>
              <p style={styles.mainCardTitle}>Recommended jobs</p>
            </div>
            <p style={{ fontSize: 12.5, color: "#64748b" }}>Upload a resume to see jobs ranked by your compatibility.</p>
          </div>
        </div>

        <div style={styles.sidebar}>
          <div style={styles.sideCard}>
            <p style={styles.sideCardTitle}>Next steps</p>
            {journey.map((step) => (
              <div key={step.label} style={{ ...styles.taskRow, cursor: "pointer" }} onClick={() => onNavigate(step.page)}>
                <div style={styles.taskDot(false)} />
                <div>
                  <p style={styles.taskLabel}>{step.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.tipCard}>
            <p style={styles.tipLabel}>Tip</p>
            <p style={styles.tipText}>Not sure where to start? Your AI Career Advisor can walk you through it.</p>
            <button style={styles.tipBtn} onClick={() => onNavigate("advisor")}>Talk to advisor →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;