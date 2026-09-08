import { useState, useEffect } from "react";
import { getCourses, createCourse, deleteCourse } from "../../services/adminService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F7F5", minHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 800, margin: "0 0 4px" },
  subtitle: { fontSize: 14, color: "#666", margin: "0 0 24px" },
  formCard: { background: "white", borderRadius: 16, padding: 22, marginBottom: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", maxWidth: 560 },
  label: { fontSize: 12.5, fontWeight: 600, color: "#555", display: "block", marginBottom: 6, marginTop: 12 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0E0E0", fontSize: 14, boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0E0E0", fontSize: 14, boxSizing: "border-box", minHeight: 60, fontFamily: "inherit" },
  submitBtn: { padding: "11px 20px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #2563eb, #7c3aed)", color: "white", fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginTop: 16 },
  error: { color: "#dc2626", fontSize: 13, marginTop: 10 },

  courseCard: { background: "white", borderRadius: 14, padding: 16, marginBottom: 10, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  courseTitle: { fontSize: 14.5, fontWeight: 700, margin: "0 0 3px" },
  courseMeta: { fontSize: 12, color: "#888", margin: "0 0 6px" },
  skillTag: { display: "inline-block", background: "#EEF3FF", color: "#2563eb", fontSize: 11.5, fontWeight: 600, padding: "3px 10px", borderRadius: 6, marginBottom: 6 },
  deleteBtn: { padding: "6px 12px", borderRadius: 8, border: "none", background: "#FDECEC", color: "#c0392b", fontSize: 12, fontWeight: 600, cursor: "pointer" },
};

function UpskillingCourses({ admin }) {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ target_skill: "", course_title: "", provider: "", course_url: "", course_description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () => getCourses().then(setCourses).catch(() => {});

  useEffect(() => { load(); }, []);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    if (!form.target_skill.trim() || !form.course_title.trim()) {
      setError("Target skill and course title are required.");
      return;
    }
    setLoading(true);
    try {
      await createCourse({ admin_id: admin.admin_id, ...form });
      setForm({ target_skill: "", course_title: "", provider: "", course_url: "", course_description: "" });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    await deleteCourse(courseId);
    load();
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Upskilling Courses</h1>
      <p style={styles.subtitle}>Manage the course recommendations shown to students with skill gaps.</p>

      <div style={styles.formCard}>
        <label style={styles.label}>Target skill *</label>
        <input style={styles.input} value={form.target_skill} onChange={update("target_skill")} placeholder="e.g. Node.js" />

        <label style={styles.label}>Course title *</label>
        <input style={styles.input} value={form.course_title} onChange={update("course_title")} placeholder="e.g. Node.js Complete Guide" />

        <label style={styles.label}>Provider</label>
        <input style={styles.input} value={form.provider} onChange={update("provider")} placeholder="e.g. Coursera, Udemy" />

        <label style={styles.label}>Course URL</label>
        <input style={styles.input} value={form.course_url} onChange={update("course_url")} placeholder="https://..." />

        <label style={styles.label}>Description</label>
        <textarea style={styles.textarea} value={form.course_description} onChange={update("course_description")} />

        <button style={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add course"}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </div>

      {courses.map((c) => (
        <div key={c.course_id} style={styles.courseCard}>
          <div>
            <span style={styles.skillTag}>{c.target_skill}</span>
            <p style={styles.courseTitle}>{c.course_title}</p>
            <p style={styles.courseMeta}>{c.provider}</p>
          </div>
          <button style={styles.deleteBtn} onClick={() => handleDelete(c.course_id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default UpskillingCourses;