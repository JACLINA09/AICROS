import { useState } from "react";
import { createJob } from "../../services/industryService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F7F5", minHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 800, margin: "0 0 4px" },
  subtitle: { fontSize: 14, color: "#666", margin: "0 0 24px" },
  card: { background: "white", borderRadius: 16, padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", maxWidth: 600 },
  label: { fontSize: 12.5, fontWeight: 600, color: "#555", display: "block", marginBottom: 6, marginTop: 14 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0E0E0", fontSize: 14, boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0E0E0", fontSize: 14, boxSizing: "border-box", minHeight: 70, fontFamily: "inherit", resize: "vertical" },
  row: { display: "flex", gap: 10 },
  skillRow: { display: "flex", gap: 8, marginTop: 8, alignItems: "center" },
  addSkillBtn: { padding: "8px 14px", borderRadius: 8, border: "1px solid #D0D0D0", background: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer", marginTop: 8 },
  removeBtn: { padding: "6px 10px", borderRadius: 8, border: "none", background: "#FDECEC", color: "#c0392b", fontSize: 12, cursor: "pointer" },
  submitBtn: { width: "100%", padding: "13px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #2563eb, #7c3aed)", color: "white", fontSize: 14.5, fontWeight: 700, cursor: "pointer", marginTop: 20 },
  success: { color: "#16a34a", fontSize: 13, marginTop: 12, textAlign: "center" },
  error: { color: "#dc2626", fontSize: 13, marginTop: 12, textAlign: "center" },
};

function PostJob({ industry }) {
  const [form, setForm] = useState({ job_title: "", job_description: "", responsibilities: "", location: "", salary: "", job_type: "" });
  const [skills, setSkills] = useState([{ skill_name: "", proficiency_level: "" }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const updateSkill = (i, field) => (e) => {
    const newSkills = [...skills];
    newSkills[i][field] = e.target.value;
    setSkills(newSkills);
  };
  const addSkillRow = () => setSkills([...skills, { skill_name: "", proficiency_level: "" }]);
  const removeSkillRow = (i) => setSkills(skills.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    setError("");
    if (!form.job_title.trim()) {
      setError("Job title is required.");
      return;
    }
    setLoading(true);
    try {
      await createJob({
        industry_id: industry.industry_id,
        ...form,
        required_skills: skills.filter((s) => s.skill_name.trim()),
      });
      setSuccess(true);
      setForm({ job_title: "", job_description: "", responsibilities: "", location: "", salary: "", job_type: "" });
      setSkills([{ skill_name: "", proficiency_level: "" }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Post a Job</h1>
      <p style={styles.subtitle}>Create a new job listing for students to apply to.</p>

      <div style={styles.card}>
        <label style={styles.label}>Job title *</label>
        <input style={styles.input} value={form.job_title} onChange={update("job_title")} placeholder="Junior Full Stack Developer" />

        <label style={styles.label}>Job description</label>
        <textarea style={styles.textarea} value={form.job_description} onChange={update("job_description")} />

        <label style={styles.label}>Responsibilities</label>
        <textarea style={styles.textarea} value={form.responsibilities} onChange={update("responsibilities")} />

        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Location</label>
            <input style={styles.input} value={form.location} onChange={update("location")} placeholder="Kuala Lumpur" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Job type</label>
            <input style={styles.input} value={form.job_type} onChange={update("job_type")} placeholder="Hybrid / Remote / On-site" />
          </div>
        </div>

        <label style={styles.label}>Salary</label>
        <input style={styles.input} value={form.salary} onChange={update("salary")} placeholder="RM 3,000 - 4,000" />

        <label style={styles.label}>Required skills</label>
        {skills.map((skill, i) => (
          <div key={i} style={styles.skillRow}>
            <input style={styles.input} value={skill.skill_name} onChange={updateSkill(i, "skill_name")} placeholder="e.g. React" />
            <input style={styles.input} value={skill.proficiency_level} onChange={updateSkill(i, "proficiency_level")} placeholder="Basic / Intermediate" />
            {skills.length > 1 && <button style={styles.removeBtn} onClick={() => removeSkillRow(i)}>✕</button>}
          </div>
        ))}
        <button style={styles.addSkillBtn} onClick={addSkillRow}>+ Add another skill</button>

        <button style={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Posting..." : "Post job →"}
        </button>
        {success && <p style={styles.success}>Job posted successfully!</p>}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default PostJob;