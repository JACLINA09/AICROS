import { useState } from "react";
import { startAttempt, submitAnswer, finishAttempt } from "../../services/simulationService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#0d1117", minHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: "#f8fafc" },
  subtitle: { fontSize: 14, color: "#94a3b8", margin: "0 0 24px" },

  card: { background: "#161b22", borderRadius: 16, padding: 24, marginBottom: 16, border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" },
  startBtn: {
    padding: "13px 22px", borderRadius: 10, border: "none",
    background: "#22c55e", color: "white",
    fontSize: 14.5, fontWeight: 700, cursor: "pointer",
  },

  progressText: { fontSize: 12.5, color: "#94a3b8", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 },
  taskTitle: { fontSize: 18, fontWeight: 800, margin: "0 0 8px", color: "#f8fafc" },
  scenario: { fontSize: 13.5, color: "#cbd5e1", lineHeight: 1.6, margin: "0 0 14px", background: "#0d1117", padding: 14, borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.05)" },
  instructions: { fontSize: 14, fontWeight: 600, margin: "0 0 14px", color: "#f8fafc" },

  textarea: {
    width: "100%", minHeight: 100, padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid rgba(255, 255, 255, 0.12)", background: "#0d1117", color: "#f8fafc", fontSize: 13.5, fontFamily: "inherit",
    resize: "vertical", boxSizing: "border-box",
  },
  submitBtn: {
    marginTop: 14, padding: "11px 20px", borderRadius: 10, border: "none",
    background: "#22c55e", color: "white",
    fontSize: 13.5, fontWeight: 700, cursor: "pointer",
  },
  feedbackBox: (score) => ({
    marginTop: 14, padding: "12px 14px", borderRadius: 10,
    background: score >= 70 ? "rgba(34, 197, 94, 0.1)" : score >= 40 ? "rgba(234, 179, 8, 0.1)" : "rgba(239, 68, 68, 0.1)",
    color: score >= 70 ? "#4ade80" : score >= 40 ? "#facc15" : "#f87171",
    border: `1px solid ${score >= 70 ? "rgba(34, 197, 94, 0.2)" : score >= 40 ? "rgba(234, 179, 8, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
    fontSize: 13,
  }),
  nextBtn: {
    marginTop: 14, padding: "11px 20px", borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.12)",
    background: "#161b22", fontSize: 13.5, fontWeight: 700, cursor: "pointer", color: "#cbd5e1",
  },

  resultScore: { fontSize: 48, fontWeight: 800, margin: "0 0 6px", textAlign: "center", color: "#f8fafc" },
  resultLabel: { fontSize: 13, color: "#94a3b8", textAlign: "center", margin: "0 0 20px", textTransform: "uppercase", letterSpacing: 0.5 },
  feedbackRow: { display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" },
  feedbackScore: { fontSize: 13, fontWeight: 700, minWidth: 40, color: "#4ade80" },

  error: { color: "#f87171", fontSize: 13, marginTop: 10, textAlign: "center" },
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
          <p style={{ fontSize: 14, color: "#cbd5e1", marginBottom: 18 }}>
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

        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: "#f8fafc" }}>Mission-by-mission feedback</p>
        {result.submissions.map((s, i) => (
          <div key={i} style={styles.feedbackRow}>
            <span style={styles.feedbackScore}>{s.task_score}/100</span>
            <span style={{ fontSize: 13, color: "#cbd5e1" }}>{s.ai_feedback}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CareerSimulation;