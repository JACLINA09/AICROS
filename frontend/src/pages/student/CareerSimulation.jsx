import { useState, useEffect } from "react";
import { getPublishedTasks, startAttempt, submitAnswer, finishAttempt } from "../../services/simulationService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", background: "#eaf1f7", minHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 850, margin: "0 0 4px", color: "#17324d" },
  subtitle: { fontSize: 14, color: "#47647d", margin: "0 0 24px" },

  card: { background: "#f5f1e6", borderRadius: 10, padding: 24, marginBottom: 16, border: "1px solid #c7d7e4", boxShadow: "0 5px 14px rgba(23,50,77,0.08)" },
  startBtn: {
    padding: "13px 22px", borderRadius: 10, border: "none",
    background: "#1f5f8b", color: "white",
    fontSize: 14.5, fontWeight: 700, cursor: "pointer",
  },

  progressText: { fontSize: 12.5, color: "#557086", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 },
  taskTitle: { fontSize: 18, fontWeight: 800, margin: "0 0 8px", color: "#17324d" },
  scenario: { fontSize: 13.5, color: "#47647d", lineHeight: 1.6, margin: "0 0 14px", background: "#dce9f2", padding: 14, borderRadius: 10, border: "1px solid #c7d7e4" },
  instructions: { fontSize: 14, fontWeight: 600, margin: "0 0 14px", color: "#17324d" },

  textarea: {
    width: "100%", minHeight: 100, padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid #b8cddd", background: "#ffffff", color: "#17324d", fontSize: 13.5, fontFamily: "inherit",
    resize: "vertical", boxSizing: "border-box",
  },
  submitBtn: {
    marginTop: 14, padding: "11px 20px", borderRadius: 10, border: "none",
    background: "#1f5f8b", color: "white",
    fontSize: 13.5, fontWeight: 700, cursor: "pointer",
  },
  feedbackBox: (score) => ({
    marginTop: 14, padding: "12px 14px", borderRadius: 10,
    background: score >= 70 ? "#e4eee7" : score >= 40 ? "#eee3bf" : "#f3e5e1",
    color: score >= 70 ? "#466b54" : score >= 40 ? "#7a5a08" : "#9b4d57",
    border: `1px solid ${score >= 70 ? "#b9d2c0" : score >= 40 ? "#d9c98e" : "#e1c2bb"}`,
    fontSize: 13,
  }),
  nextBtn: {
    marginTop: 14, padding: "11px 20px", borderRadius: 10, border: "1px solid #b8cddd",
    background: "#eaf1f7", fontSize: 13.5, fontWeight: 700, cursor: "pointer", color: "#234e70",
  },

  resultScore: { fontSize: 48, fontWeight: 800, margin: "0 0 6px", textAlign: "center", color: "#17324d" },
  resultLabel: { fontSize: 13, color: "#557086", textAlign: "center", margin: "0 0 20px", textTransform: "uppercase", letterSpacing: 0.5 },
  feedbackRow: { display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #d6e1ea" },
  feedbackScore: { fontSize: 13, fontWeight: 700, minWidth: 40, color: "#2f78a8" },

  error: { color: "#bc6b5d", fontSize: 13, marginTop: 10, textAlign: "center" },
  taskGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 14 },
  taskCard: { background: "#ffffff", border: "1px solid #c7d7e4", borderRadius: 9, padding: 18 },
  taskMeta: { display: "flex", justifyContent: "space-between", gap: 8, color: "#557086", fontSize: 11, fontWeight: 750, textTransform: "uppercase", letterSpacing: 0.4 },
  taskDescription: { color: "#47647d", fontSize: 13, lineHeight: 1.55, margin: "10px 0 14px" },
  browseButton: { padding: "9px 14px", borderRadius: 8, border: "none", background: "#1f5f8b", color: "#ffffff", fontWeight: 750, cursor: "pointer" },
};

function CareerSimulation({ student, jobId, onStartSimulation }) {
  const [phase, setPhase] = useState(jobId ? "intro" : "browse"); // browse | intro | running | finished
  const [attemptId, setAttemptId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableTasks, setAvailableTasks] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(!jobId);

  useEffect(() => {
    if (jobId) return;
    getPublishedTasks()
      .then(setAvailableTasks)
      .catch((err) => setError(err.message))
      .finally(() => setCatalogLoading(false));
  }, [jobId]);

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

  useEffect(() => {
    if (jobId) {
      handleStart();
    }
  }, [jobId, student.student_id]);

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

  if (phase === "browse") {
    const groupedTasks = availableTasks.reduce((groups, task) => {
      const group = groups[task.job_id] || { jobTitle: task.job_title, tasks: [] };
      group.tasks.push(task);
      groups[task.job_id] = group;
      return groups;
    }, {});

    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Simulation practice</h1>
        <p style={styles.subtitle}>Explore published job simulations and practise any role for experience.</p>
        {catalogLoading && <div style={styles.card}><p style={styles.subtitle}>Loading available simulations...</p></div>}
        {!catalogLoading && error && <div style={styles.card}><p style={styles.error}>{error}</p></div>}
        {!catalogLoading && !error && availableTasks.length === 0 && <div style={styles.card}><p style={styles.subtitle}>No published simulation tasks are available yet.</p></div>}
        <div style={styles.taskGrid}>
          {Object.entries(groupedTasks).map(([simulationJobId, group]) => (
            <div key={simulationJobId} style={styles.card}>
              <p style={styles.taskTitle}>{group.jobTitle}</p>
              <p style={styles.subtitle}>{group.tasks.length} practice task{group.tasks.length === 1 ? "" : "s"}</p>
              <div style={styles.taskGrid}>
                {group.tasks.map((task) => (
                  <article key={task.task_id} style={styles.taskCard}>
                    <div style={styles.taskMeta}><span>{task.question_type}</span><span>{task.time_limit_minutes || 10} min</span></div>
                    <p style={{ ...styles.taskTitle, fontSize: 15, marginTop: 10 }}>{task.task_title}</p>
                    <p style={styles.taskDescription}>{task.task_scenario || task.instructions || "Practise a realistic workplace scenario."}</p>
                    <button style={styles.browseButton} onClick={() => onStartSimulation(Number(simulationJobId))}>Start this simulation</button>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Job Simulation</h1>
        <p style={styles.subtitle}>Loading the published simulation tasks for your selected job.</p>
        <div style={styles.card}>
          {!error && <p style={{ fontSize: 14, color: "#47647d", marginBottom: 0 }}>Preparing job-specific tasks...</p>}
          {error && (
            <>
              <p style={styles.error}>
                {error.includes("No simulation tasks")
                  ? "This company hasn't published a simulation for this role yet. Check back later, or explore other jobs."
                  : error}
              </p>
              <button style={styles.startBtn} onClick={handleStart} disabled={loading}>
                {loading ? "Loading..." : "Try again"}
              </button>
            </>
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

        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: "#17324d" }}>Mission-by-mission feedback</p>
        {result.submissions.map((s, i) => (
          <div key={i} style={styles.feedbackRow}>
            <span style={styles.feedbackScore}>{s.task_score}/100</span>
            <span style={{ fontSize: 13, color: "#47647d" }}>{s.ai_feedback}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CareerSimulation;