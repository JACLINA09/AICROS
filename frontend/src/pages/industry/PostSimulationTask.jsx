import { useState, useEffect } from "react";
import { getJobsByIndustry, createSimulationTask } from "../../services/industryService";

const styles = {
  page: { padding: "28px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#FAFAF9", minHeight: "100vh" },
  title: { fontSize: 22, fontWeight: 800, margin: "0 0 4px" },
  subtitle: { fontSize: 13.5, color: "#888", margin: "0 0 24px" },
  card: { background: "white", borderRadius: 16, padding: 24, border: "1px solid #F0F0EE", maxWidth: 620 },
  label: { fontSize: 12.5, fontWeight: 600, color: "#555", display: "block", marginBottom: 6, marginTop: 14 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0E0E0", fontSize: 14, boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0E0E0", fontSize: 14, boxSizing: "border-box", minHeight: 70, fontFamily: "inherit", resize: "vertical" },
  select: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0E0E0", fontSize: 14, boxSizing: "border-box", background: "white" },
  row: { display: "flex", gap: 10 },
  typeRow: { display: "flex", gap: 8, marginTop: 6 },
  typeBtn: (active) => ({
    flex: 1, padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontSize: 12.5, fontWeight: 600, textAlign: "center",
    border: active ? "1.5px solid #2563eb" : "1px solid #E0E0E0",
    background: active ? "#EEF3FF" : "white", color: active ? "#2563eb" : "#555",
  }),
  submitBtn: { width: "100%", padding: "13px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #2563eb, #7c3aed)", color: "white", fontSize: 14.5, fontWeight: 700, cursor: "pointer", marginTop: 20 },
  success: { color: "#16a34a", fontSize: 13, marginTop: 12, textAlign: "center" },
  error: { color: "#dc2626", fontSize: 13, marginTop: 12, textAlign: "center" },
  emptyText: { fontSize: 13, color: "#999", padding: 20, textAlign: "center" },
};

function PostSimulationTask({ industry }) {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    job_id: "", task_title: "", task_scenario: "", instructions: "",
    question_type: "Objective", correct_answer: "", evaluation_guide: "",
    task_level: "Beginner", time_limit_minutes: 10,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getJobsByIndustry(industry.industry_id).then((data) => {
      setJobs(data);
      if (data.length > 0) setForm((f) => ({ ...f, job_id: data[0].job_id }));
    }).catch(() => {});
  }, [industry.industry_id]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    if (!form.job_id || !form.task_title.trim() || !form.instructions.trim()) {
      setError("Please select a job and fill in the task title and instructions.");
      return;
    }
    if (form.question_type === "Objective" && !form.correct_answer.trim()) {
      setError("Objective questions need a correct answer.");
      return;
    }
    if (form.question_type === "Open-Ended" && !form.evaluation_guide.trim()) {
      setError("Open-ended questions need an evaluation guide (what a strong answer should cover).");
      return;
    }

    setLoading(true);
    try {
      await createSimulationTask({
        industry_id: industry.industry_id,
        job_id: Number(form.job_id),
        task_title: form.task_title,
        task_scenario: form.task_scenario,
        instructions: form.instructions,
        question_type: form.question_type,
        correct_answer: form.question_type === "Objective" ? form.correct_answer : null,
        evaluation_guide: form.question_type === "Open-Ended" ? form.evaluation_guide : null,
        task_level: form.task_level,
        time_limit_minutes: Number(form.time_limit_minutes),
      });
      setSuccess(true);
      setForm((f) => ({ ...f, task_title: "", task_scenario: "", instructions: "", correct_answer: "", evaluation_guide: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (jobs.length === 0) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Simulation Tasks</h1>
        <p style={styles.subtitle}>Create scored assessment questions for students applying to your jobs.</p>
        <div style={styles.card}>
          <p style={styles.emptyText}>Post a job first — simulation tasks are attached to a specific job listing.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Simulation Tasks</h1>
      <p style={styles.subtitle}>Create scored assessment questions students take before applying to your jobs.</p>

      <div style={styles.card}>
        <label style={styles.label}>Which job is this task for? *</label>
        <select style={styles.select} value={form.job_id} onChange={update("job_id")}>
          {jobs.map((j) => (
            <option key={j.job_id} value={j.job_id}>{j.job_title}</option>
          ))}
        </select>

        <label style={styles.label}>Task title *</label>
        <input style={styles.input} value={form.task_title} onChange={update("task_title")} placeholder="e.g. Debugging, REST API" />

        <label style={styles.label}>Scenario (optional context)</label>
        <textarea style={styles.textarea} value={form.task_scenario} onChange={update("task_scenario")} placeholder="Set up the situation the question is based on" />

        <label style={styles.label}>Question / instructions *</label>
        <textarea style={styles.textarea} value={form.instructions} onChange={update("instructions")} placeholder="What is being asked?" />

        <label style={styles.label}>Question type</label>
        <div style={styles.typeRow}>
          <div style={styles.typeBtn(form.question_type === "Objective")} onClick={() => setForm((f) => ({ ...f, question_type: "Objective" }))}>
            Objective (right/wrong)
          </div>
          <div style={styles.typeBtn(form.question_type === "Open-Ended")} onClick={() => setForm((f) => ({ ...f, question_type: "Open-Ended" }))}>
            Open-ended (AI graded)
          </div>
        </div>

        {form.question_type === "Objective" ? (
          <>
            <label style={styles.label}>Correct answer *</label>
            <input style={styles.input} value={form.correct_answer} onChange={update("correct_answer")} placeholder="Exact correct answer text" />
          </>
        ) : (
          <>
            <label style={styles.label}>Evaluation guide *</label>
            <textarea style={styles.textarea} value={form.evaluation_guide} onChange={update("evaluation_guide")} placeholder="What should a strong answer cover?" />
          </>
        )}

        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Difficulty level</label>
            <select style={styles.select} value={form.task_level} onChange={update("task_level")}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Time limit (minutes)</label>
            <input type="number" style={styles.input} value={form.time_limit_minutes} onChange={update("time_limit_minutes")} min={1} />
          </div>
        </div>

        <button style={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Publishing..." : "Publish task →"}
        </button>
        {success && <p style={styles.success}>Task published successfully!</p>}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default PostSimulationTask;
