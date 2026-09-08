import { useState, useRef, useEffect } from "react";
import { sendAgentMessage } from "../../services/agentService";

const styles = {
  page: { padding: "28px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#FAFAF9", minHeight: "100vh", display: "flex", flexDirection: "column" },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 800, margin: 0 },
  subtitle: { fontSize: 13.5, color: "#888", margin: "4px 0 0" },

  chatCard: { background: "white", borderRadius: 16, border: "1px solid #F0F0EE", flex: 1, display: "flex", flexDirection: "column", maxWidth: 760, margin: "0 auto", width: "100%", overflow: "hidden" },
  messageList: { flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16, minHeight: 400, maxHeight: 520 },

  bubbleRow: (isUser) => ({ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }),
  bubble: (isUser) => ({
    maxWidth: "78%", padding: "12px 16px", borderRadius: 14,
    fontSize: 13.5, lineHeight: 1.6,
    background: isUser ? "linear-gradient(90deg, #2563eb, #7c3aed)" : "#F5F5F3",
    color: isUser ? "white" : "#222",
    borderBottomRightRadius: isUser ? 4 : 14,
    borderBottomLeftRadius: isUser ? 14 : 4,
  }),

  welcomeBlock: { textAlign: "center", padding: "40px 20px", color: "#999" },
  welcomeIcon: { fontSize: 32, marginBottom: 10 },
  welcomeTitle: { fontSize: 15, fontWeight: 700, color: "#444", margin: "0 0 6px" },
  welcomeSub: { fontSize: 12.5, margin: 0 },

  shortcutGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 24px 16px" },
  shortcutBtn: {
    padding: "10px 14px", borderRadius: 10, border: "1px solid #E5E5E0", background: "white",
    fontSize: 12.5, fontWeight: 600, color: "#444", cursor: "pointer", textAlign: "left",
  },
  actionRow: { display: "flex", gap: 8, padding: "0 24px 16px", flexWrap: "wrap" },
  actionBtn: {
    padding: "8px 14px", borderRadius: 9, border: "1px solid #C7DCFC", background: "#EEF3FF",
    color: "#2563eb", fontSize: 12, fontWeight: 700, cursor: "pointer",
  },

  inputRow: { display: "flex", gap: 8, padding: 16, borderTop: "1px solid #F0F0EE" },
  input: { flex: 1, padding: "11px 14px", borderRadius: 10, border: "1px solid #E0E0E0", fontSize: 13.5, fontFamily: "inherit" },
  sendBtn: { padding: "11px 18px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #2563eb, #7c3aed)", color: "white", fontSize: 13.5, fontWeight: 700, cursor: "pointer" },

  typingDots: { fontSize: 13, color: "#999", fontStyle: "italic" },
};

const shortcuts = [
  "What career suits my current skills?",
  "How ready am I for a software engineering role?",
  "What should I learn first?",
  "How can I improve my resume?",
];

const quickActions = [
  { label: "📄 View resume feedback", page: "resume" },
  { label: "💼 Browse jobs", page: "jobs" },
  { label: "🧩 Take a simulation", page: "simulation" },
  { label: "📊 View my portfolio", page: "portfolio" },
];

function AICareerAdvisor({ student, activeJobId, onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const userMessage = text.trim();
    if (!userMessage || loading) return;

    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const history = newMessages.map((m) => ({ role: m.role, content: m.content }));
      const { reply } = await sendAgentMessage(student.student_id, userMessage, history, activeJobId);
      setMessages((prev) => [...prev, { role: "model", content: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "model", content: `⚠️ ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>AI Career Advisor</h1>
        <p style={styles.subtitle}>Ask anything about your readiness, skills, or job matches — answers are grounded in your real data.</p>
      </div>

      <div style={styles.chatCard}>
        <div style={styles.messageList} ref={scrollRef}>
          {messages.length === 0 && (
            <div style={styles.welcomeBlock}>
              <div style={styles.welcomeIcon}>🎓</div>
              <p style={styles.welcomeTitle}>Hi {student.fullname.split(" ")[0]}, I'm your career advisor.</p>
              <p style={styles.welcomeSub}>Ask me anything, or try a shortcut below.</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={styles.bubbleRow(m.role === "user")}>
              <div style={styles.bubble(m.role === "user")}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div style={styles.bubbleRow(false)}>
              <div style={styles.bubble(false)}>
                <span style={styles.typingDots}>Thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div style={styles.actionRow}>
          {quickActions.map((a) => (
            <button key={a.page} style={styles.actionBtn} onClick={() => onNavigate && onNavigate(a.page)}>{a.label}</button>
          ))}
        </div>

        {messages.length === 0 && (
          <div style={styles.shortcutGrid}>
            {shortcuts.map((s) => (
              <button key={s} style={styles.shortcutBtn} onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask about your readiness, skills, or next steps..."
            disabled={loading}
          />
          <button style={styles.sendBtn} onClick={() => send(input)} disabled={loading || !input.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default AICareerAdvisor;