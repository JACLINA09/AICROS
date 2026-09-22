import { useState, useEffect } from "react";
import { getStudentCalendarEvents } from "../../services/jobService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", background: "#eaf1f7", minHeight: "100vh" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, padding: "24px 26px", background: "#f5f1e6", border: "1px solid #c7d7e4", borderRadius: 12, boxShadow: "0 5px 14px rgba(23,50,77,0.07)" },
  headerKicker: { display: "inline-block", marginBottom: 8, color: "#1f5f8b", fontSize: 11, fontWeight: 850, letterSpacing: 1.4, textTransform: "uppercase" },
  headerMeta: { display: "flex", alignItems: "center", gap: 10, color: "#557086", fontSize: 12.5, fontWeight: 650 },
  headerDot: { width: 9, height: 9, borderRadius: "50%", background: "#5f8b70", boxShadow: "0 0 0 4px #e4eee7" },
  title: { fontSize: 22, fontWeight: 850, margin: 0, color: "#17324d" },
  subtitle: { fontSize: 13.5, color: "#47647d", margin: "4px 0 0" },

  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 },
  statCard: { background: "#f5f1e6", borderRadius: 10, padding: "20px", border: "1px solid #c7d7e4", borderTop: "4px solid #2f78a8", boxShadow: "0 5px 14px rgba(23,50,77,0.08)", transition: "transform 180ms ease, box-shadow 180ms ease" },
  statTopRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  statLabel: { fontSize: 13, color: "#557086", fontWeight: 600 },
  statBadge: (positive) => ({
    fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
    background: positive ? "#dce9f2" : "#f3e5e1", 
    color: positive ? "#1f5f8b" : "#9b4d57",
    border: `1px solid ${positive ? "#b8cddd" : "#e1c2bb"}`
  }),
  statValue: { fontSize: 28, fontWeight: 800, margin: 0, color: "#17324d" },
  statSub: { fontSize: 12, color: "#557086", margin: "2px 0 0" },

  calendarCard: { background: "#f5f1e6", borderRadius: 10, padding: 24, border: "1px solid #c7d7e4", marginBottom: 16, boxShadow: "0 5px 14px rgba(23,50,77,0.08)" },
  calendarHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  calendarTitle: { fontSize: 15, fontWeight: 750, margin: 0, color: "#17324d" },
  calendarSub: { fontSize: 12, color: "#557086", margin: "4px 0 0" },
  calendarLegend: { display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" },
  legendItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#557086" },
  legendDot: (color) => ({ width: 7, height: 7, borderRadius: "50%", background: color }),
  calendarGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 },
  weekday: { textAlign: "center", color: "#557086", fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", paddingBottom: 5 },
  calendarDay: (isToday, hasEvents) => ({ minHeight: 58, padding: 7, borderRadius: 7, border: isToday ? "1.5px solid #1f5f8b" : "1px solid #d6e1ea", background: hasEvents ? "#eaf1f7" : "#ffffff", boxSizing: "border-box" }),
  dayNumber: (isToday) => ({ color: isToday ? "#1f5f8b" : "#557086", fontSize: 11, fontWeight: isToday ? 850 : 650 }),
  eventLabel: (type) => ({ display: "block", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginTop: 5, padding: "3px 4px", borderRadius: 4, background: type === "application" ? "#e4eee7" : "#dce9f2", color: type === "application" ? "#466b54" : "#1f5f8b", fontSize: 10, fontWeight: 700 }),
  emptyCalendar: { color: "#557086", fontSize: 12.5, padding: "12px 0 0", margin: 0 },

  bodyGrid: { display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, alignItems: "start" },

  mainCard: { background: "#f5f1e6", borderRadius: 10, padding: 24, border: "1px solid #c7d7e4", marginBottom: 16, boxShadow: "0 5px 14px rgba(23,50,77,0.08)" },
  mainCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  mainCardTitle: { fontSize: 15, fontWeight: 750, margin: 0, color: "#17324d" },

  ringWrap: { display: "flex", alignItems: "center", gap: 28 },
  breakdownList: { flex: 1 },
  breakdownRow: { marginBottom: 14 },
  breakdownTopRow: { display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 },
  breakdownLabel: { color: "#557086", fontWeight: 600 },
  breakdownVal: { color: "#17324d", fontWeight: 700 },
  barTrack: { height: 6, background: "#dce9f2", borderRadius: 4 },
  barFill: (pct, color) => ({ height: "100%", width: `${pct}%`, background: color, borderRadius: 4 }),

  listCard: { background: "#f5f1e6", borderRadius: 10, padding: 24, border: "1px solid #c7d7e4", boxShadow: "0 5px 14px rgba(23,50,77,0.08)" },
  jobRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #d6e1ea" },
  jobTitle: { fontSize: 13.5, fontWeight: 700, margin: 0, color: "#17324d" },
  jobMeta: { fontSize: 11.5, color: "#557086", margin: "2px 0 0" },
  jobScore: (score) => ({ fontSize: 13, fontWeight: 800, color: score >= 70 ? "#2f78a8" : score >= 40 ? "#b5964a" : "#bc6b5d" }),

  sidebar: { display: "flex", flexDirection: "column", gap: 16 },
  sideCard: { background: "#f5f1e6", borderRadius: 10, padding: 20, border: "1px solid #c7d7e4", boxShadow: "0 5px 14px rgba(23,50,77,0.08)" },
  sideCardTitle: { fontSize: 13.5, fontWeight: 700, margin: "0 0 14px", color: "#17324d" },
  taskRow: { display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #d6e1ea" },
  taskDot: (done) => ({ width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0, background: done ? "#2f78a8" : "#b8cddd" }),
  taskLabel: { fontSize: 12.5, fontWeight: 600, color: "#234e70", margin: 0 },
  taskSub: { fontSize: 11, color: "#557086", margin: "2px 0 0" },

  tipCard: { background: "#1f5f8b", border: "1px solid #2f78a8", borderRadius: 10, padding: 20, color: "white" },
  tipLabel: { fontSize: 12, fontWeight: 700, opacity: 0.85, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5, color: "#dce9f2" },
  tipText: { fontSize: 13, lineHeight: 1.6, margin: "0 0 14px", color: "#f5f1e6" },
  tipBtn: { padding: "8px 14px", borderRadius: 8, border: "none", background: "#f5f1e6", color: "#234e70", fontSize: 12.5, fontWeight: 700, cursor: "pointer" },
};

function Dashboard({ student, onNavigate }) {
  const readiness = 0; // wires to real data once portfolio is fetched per-job
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(true);

  useEffect(() => {
    getStudentCalendarEvents(student.student_id)
      .then(setCalendarEvents)
      .catch(() => setCalendarEvents([]))
      .finally(() => setCalendarLoading(false));
  }, [student.student_id]);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthLabel = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarCells = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => index < firstWeekday ? null : index - firstWeekday + 1);
  const eventsByDay = calendarEvents.reduce((events, event) => {
    const eventDate = new Date(event.date);
    if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
      const day = eventDate.getDate();
      events[day] = [...(events[day] || []), event];
    }
    return events;
  }, {});

  const journey = [
    { label: "Upload & analyse resume", page: "resume" },
    { label: "Talk to your AI Career Advisor", page: "advisor" },
    { label: "Browse career opportunities", page: "jobs" },
    { label: "Choose a job simulation", page: "jobs" },
    { label: "Apply via your portfolio", page: "portfolio" },
  ];

  return (
    <div style={styles.page}>
      <style>{`
        .student-stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(23, 50, 77, 0.12) !important;
        }
        .student-stat-card:nth-child(2) { border-top-color: #bc6b5d !important; }
        .student-stat-card:nth-child(3) { border-top-color: #5f8b70 !important; }
        .student-dashboard-card { transition: transform 180ms ease, box-shadow 180ms ease; }
        .student-dashboard-card:hover { transform: translateY(-3px); box-shadow: 0 9px 18px rgba(23, 50, 77, 0.11) !important; }
      `}</style>

      <div style={styles.headerRow}>
        <div>
          <span style={styles.headerKicker}>Student workspace</span>
          <h1 style={styles.title}>Welcome back, {student.fullname.split(" ")[0]}</h1>
          <p style={styles.subtitle}>Here's where your career readiness stands today.</p>
        </div>
        <div style={styles.headerMeta}><span style={styles.headerDot} /> Profile active</div>
      </div>

      <div style={styles.statsRow}>
        <div className="student-stat-card" style={styles.statCard}>
          <div style={styles.statTopRow}>
            <span style={styles.statLabel}>Career Readiness</span>
          </div>
          <p style={styles.statValue}>{readiness}%</p>
          <p style={styles.statSub}>Combined score across resume, skills & simulation</p>
        </div>
        <div className="student-stat-card" style={styles.statCard}>
          <div style={styles.statTopRow}>
            <span style={styles.statLabel}>Applications</span>
          </div>
          <p style={styles.statValue}>0</p>
          <p style={styles.statSub}>Jobs applied to so far</p>
        </div>
        <div className="student-stat-card" style={styles.statCard}>
          <div style={styles.statTopRow}>
            <span style={styles.statLabel}>Simulations Taken</span>
          </div>
          <p style={styles.statValue}>0</p>
          <p style={styles.statSub}>Job-specific assessments completed</p>
        </div>
      </div>

      <section className="student-dashboard-card" style={styles.calendarCard} aria-label="Career calendar">
        <div style={styles.calendarHeader}>
          <div>
            <p style={styles.calendarTitle}>Career calendar</p>
            <p style={styles.calendarSub}>{monthLabel} · opportunities and application activity</p>
          </div>
          <div style={styles.calendarLegend}>
            <span style={styles.legendItem}><span style={styles.legendDot("#1f5f8b")} /> Opportunity</span>
            <span style={styles.legendItem}><span style={styles.legendDot("#5f8b70")} /> Application</span>
          </div>
        </div>
        <div style={styles.calendarGrid}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day} style={styles.weekday}>{day}</span>)}
          {calendarCells.map((day, index) => {
            const dayEvents = day ? eventsByDay[day] || [] : [];
            const isToday = day === today.getDate();
            return (
              <div key={`${day || "empty"}-${index}`} style={styles.calendarDay(isToday, dayEvents.length > 0)}>
                {day && <span style={styles.dayNumber(isToday)}>{day}</span>}
                {dayEvents.slice(0, 2).map((event) => <span key={event.id} title={event.title} style={styles.eventLabel(event.type)}>{event.type === "application" ? "Applied" : "New job"}</span>)}
              </div>
            );
          })}
        </div>
        {!calendarLoading && calendarEvents.length === 0 && <p style={styles.emptyCalendar}>No activity scheduled yet. New opportunities and your applications will appear here.</p>}
        {!calendarLoading && calendarEvents.length > 0 && !calendarEvents.some((event) => event.type === "interview") && <p style={styles.emptyCalendar}>No interviews or deadlines are scheduled yet.</p>}
      </section>

      <div style={styles.bodyGrid}>
        <div>
          <div className="student-dashboard-card" style={styles.mainCard}>
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

          <div className="student-dashboard-card" style={styles.listCard}>
            <div style={styles.mainCardHeader}>
              <p style={styles.mainCardTitle}>Recommended jobs</p>
            </div>
            <p style={{ fontSize: 12.5, color: "#557086" }}>Upload a resume to see jobs ranked by your compatibility.</p>
          </div>
        </div>

        <div style={styles.sidebar}>
          <div className="student-dashboard-card" style={styles.sideCard}>
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

          <div className="student-dashboard-card" style={styles.tipCard}>
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