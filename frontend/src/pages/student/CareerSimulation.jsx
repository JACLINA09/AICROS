import { useState } from "react";
import { startAttempt, submitAnswer, finishAttempt } from "../../services/simulationService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F7F5", minHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 800, margin: "0 0 4px" },
  subtitle: { fontSize: 14, color: "#666", margin: "0 0 24px" },

  card: { background: "white", borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" },
  startBtn: {
    padding: "13px 22px", borderRadius: 10, border: "none",
    background: "linear-gradient(90deg, #2563eb, #7c3aed)", color: "white",
    fontSize: 14.5, fontWeight: 700, cursor: "pointer",
  },

  progressText: { fontSize: 12.5, color: "#888", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 },
  taskTitle: { fontSize: 18, fontWeight: 800, margin: "0 0 8px" },
  scenario: { fontSize: 13.5, color: "#555", lineHeight: 1.6, margin: "0 0 14px", background: "#F7F7F5", padding: 14, borderRadius: 10 },
  instructions: { fontSize: 14, fontWeight: 600, margin: "0 0 14px" },

  textarea: {
    width: "100%", minHeight: 100, padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid #E0E0E0", fontSize: 13.5, fontFamily: "inherit",
    resize: "vertical", boxSizing: "border-box",
  },
  submitBtn: {
    marginTop: 14, padding: "11px 20px", borderRadius: 10, border: "none",
    background: "linear-gradient(90deg, #2563eb, #7c3aed)", color: "white",
    fontSize: 13.5, fontWeight: 700, cursor: "pointer",
  },
  feedbackBox: (score) => ({
    marginTop: 14, padding: "12px 14px", borderRadius: 10,
    background: score >= 70 ? "#E9F7EF" : score >= 40 ? "#FFF6E5" : "#FDECEC",
    color: score >= 70 ? "#1a7a44" : score >= 40 ? "#b8860b" : "#c0392b",
    fontSize: 13,
  }),
  nextBtn: {
    marginTop: 14, padding: "11px 20px", borderRadius: 10, border: "1px solid #D0D0D0",
    background: "white", fontSize: 13.5, fontWeight: 700, cursor: "pointer", color: "#444",
  },

  resultScore: { fontSize: 48, fontWeight: 800, margin: "0 0 6px", textAlign: "center" },
  resultLabel: { fontSize: 13, color: "#888", textAlign: "center", margin: "0 0 20px", textTransform: "uppercase", letterSpacing: 0.5 },
  feedbackRow: { display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #F0F0EE" },
  feedbackScore: { fontSize: 13, fontWeight: 700, minWidth: 40 },

  error: { color: "#dc2626", fontSize: 13, marginTop: 10, textAlign: "center" },
};

function CareerSimulation({ student, jobId = 1 }) {
  const [phase, setPhase] = useState("intro"); // intro | running | finished
  const [attemptId, setAttemptId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await startAttempt(student.student_id, jobId);
      setAttemptId(data.attempt_id);
      setTasks(data.tasks);
      setCurrentIndex(0);
      setPhase("running");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await submitAnswer(attemptId, tasks[currentIndex].task_id, answer);
      setFeedback(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setAnswer("");
    setFeedback(null);

    if (currentIndex < tasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    // last task — finish the attempt
    setLoading(true);
    try {
      const finalResult = await finishAttempt(attemptId);
      setResult(finalResult);
      setPhase("finished");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (phase === "intro") {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Career Simulation</h1>
        <p style={styles.subtitle}>Practice with real scenarios and get scored on objective and open-ended questions.</p>
        <div style={styles.card}>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 18 }}>
            This simulation contains a mix of multiple-choice and open-ended questions
            related to the job you're targeting. Your answers are scored automatically.
          </p>
          <button style={styles.startBtn} onClick={handleStart} disabled={loading}>
            {loading ? "Starting..." : "Start assessment →"}
          </button>
          {error && (
          <p style={styles.error}>
          {error.includes("No simulation tasks") 
           ? "This company hasn't published a simulation for this role yet. Check back later, or explore other jobs."
           : error}
         </p>
)}
        </div>
      </div>
    );
  }

  if (phase === "running") {
    const task = tasks[currentIndex];
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Career Simulation</h1>
        <div style={styles.card}>
          <p style={styles.progressText}>Question {currentIndex + 1} of {tasks.length} · {task.question_type}</p>
          <p style={styles.taskTitle}>{task.task_title}</p>
          {task.task_scenario && <p style={styles.scenario}>{task.task_scenario}</p>}
          <p style={styles.instructions}>{task.instructions}</p>

          <textarea
            style={styles.textarea}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            disabled={!!feedback}
          />

          {!feedback ? (
            <button style={styles.submitBtn} onClick={handleSubmit} disabled={loading || !answer.trim()}>
              {loading ? "Checking..." : "Submit answer"}
            </button>
          ) : (
            <>
              <div style={styles.feedbackBox(feedback.task_score)}>
                <strong>Score: {feedback.task_score}/100 — </strong>{feedback.ai_feedback}
              </div>
              <button style={styles.nextBtn} onClick={handleNext} disabled={loading}>
                {currentIndex < tasks.length - 1 ? "Next question →" : (loading ? "Finishing..." : "Finish assessment →")}
              </button>
            </>
          )}

          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    );
  }

  // phase === "finished"
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Assessment Complete</h1>
      <div style={styles.card}>
        <p style={styles.resultScore}>{result.simulation_score}</p>
        <p style={styles.resultLabel}>Overall simulation score</p>

        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Mission-by-mission feedback</p>
        {result.submissions.map((s, i) => (
          <div key={i} style={styles.feedbackRow}>
            <span style={styles.feedbackScore}>{s.task_score}/100</span>
            <span style={{ fontSize: 13, color: "#555" }}>{s.ai_feedback}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CareerSimulation;