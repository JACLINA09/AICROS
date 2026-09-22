import { useState, useEffect } from "react";
import { uploadResume, getLatestResume, downloadResumeReport } from "../../services/resumeService";

const styles = {
  page: { padding: "32px 40px", fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", background: "#eaf1f7", minHeight: "100vh" },
  title: { fontSize: 24, fontWeight: 850, margin: "0 0 4px", color: "#17324d" },
  subtitle: { fontSize: 14, color: "#47647d", margin: "0 0 24px" },

  dropzone: {
    border: "2px dashed #b8cddd", borderRadius: 10, padding: "48px 24px",
    textAlign: "center", background: "#f5f1e6", cursor: "pointer",
  },
  dropzoneActive: { borderColor: "#1f5f8b", background: "#dce9f2" },
  hiddenInput: { display: "none" },
  uploadIcon: { fontSize: 32, marginBottom: 12 },
  uploadText: { fontSize: 14, fontWeight: 600, color: "#17324d", margin: "0 0 4px" },
  uploadSub: { fontSize: 12.5, color: "#557086" },

  card: { background: "#f5f1e6", borderRadius: 10, padding: 24, marginBottom: 16, border: "1px solid #c7d7e4", boxShadow: "0 5px 14px rgba(23,50,77,0.08)" },
  scoreRow: { display: "flex", gap: 24, marginBottom: 20 },
  scoreBox: { flex: 1, textAlign: "center", padding: 20, borderRadius: 10, background: "#dce9f2", border: "1px solid #c7d7e4" },
  scoreValue: { fontSize: 36, fontWeight: 800, margin: 0, color: "#17324d" },
  scoreLabel: { fontSize: 12.5, color: "#557086", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: 0.5 },

  sectionTitle: { fontSize: 14, fontWeight: 700, margin: "0 0 10px", color: "#17324d" },
  issueItem: { fontSize: 13, color: "#47647d", padding: "8px 0", borderBottom: "1px solid #d6e1ea" },
  suggestionBox: { background: "#e4eee7", border: "1px solid #b9d2c0", borderRadius: 10, padding: 14, fontSize: 13, color: "#466b54", lineHeight: 1.6 },

  error: { color: "#f87171", fontSize: 13, marginTop: 12, textAlign: "center" },
  loadingText: { textAlign: "center", color: "#557086", padding: 40 },

  fileNameBadge: { fontSize: 12.5, color: "#557086", marginBottom: 16 },
  reuploadBtn: {
    padding: "8px 16px", borderRadius: 8, border: "1px solid #b8cddd", background: "#f5f1e6",
    fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: "#234e70", marginBottom: 16,
  },
  downloadBtn: {
    padding: "8px 16px", borderRadius: 8, border: "1.5px solid #1f5f8b", background: "#f5f1e6",
    color: "#1f5f8b", fontSize: 12.5, fontWeight: 600, cursor: "pointer", marginBottom: 16, marginLeft: 10,
  },

  skillCategoryGroup: { marginBottom: 14 },
  skillCategoryLabel: { fontSize: 12, fontWeight: 700, color: "#557086", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 },
  skillChipRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  skillChip: {
    background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", color: "#4ade80",
    fontSize: 12.5, fontWeight: 600, padding: "6px 12px", borderRadius: 8,
  },
  noSkillsText: { fontSize: 13, color: "#557086", fontStyle: "italic" },
  advisorBanner: {
    background: "#1f5f8b", border: "1px solid #2f78a8", borderRadius: 10, padding: "18px 20px",
    color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16,
  },
  advisorBtn: { padding: "9px 16px", borderRadius: 8, border: "none", background: "#f5f1e6", color: "#234e70", fontSize: 12.5, fontWeight: 700, cursor: "pointer" },
};

function groupSkillsByCategory(skills) {
  const grouped = {};
  for (const skill of skills) {
    if (!grouped[skill.skill_category]) grouped[skill.skill_category] = [];
    grouped[skill.skill_category].push(skill);
  }
  return grouped;
}

function ResumeEvaluation({ student, onNavigate }) {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getLatestResume(student.student_id)
      .then(setResume)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [student.student_id]);

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const result = await uploadResume(student.student_id, file);
      setResume(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  if (loading) {
    return <div style={styles.page}><p style={styles.loadingText}>Loading your resume...</p></div>;
  }

  const groupedSkills = resume?.skills ? groupSkillsByCategory(resume.skills) : {};

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Resume Evaluation</h1>
      <p style={styles.subtitle}>Upload your resume — our pipeline analyses it automatically.</p>

      {!resume || uploading ? (
        <label
          style={{ ...styles.dropzone, ...(dragging ? styles.dropzoneActive : {}) }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div style={styles.uploadIcon}>📄</div>
          <p style={styles.uploadText}>
            {uploading ? "Analysing your resume..." : "Drag & drop your resume here, or click to browse"}
          </p>
          <p style={styles.uploadSub}>Supports PDF and DOCX</p>
          <input
            type="file"
            accept=".pdf,.docx"
            style={styles.hiddenInput}
            disabled={uploading}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </label>
      ) : (
        <>
          <button style={styles.reuploadBtn} onClick={() => setResume(null)}>
            ↻ Upload a different resume
          </button>
          <button style={styles.downloadBtn} onClick={() => downloadResumeReport(resume.resume_id)}>
            📄 Download PDF report
          </button>
          <p style={styles.fileNameBadge}>File: {resume.file_name} · Status: {resume.extraction_status}</p>

          <div style={styles.card}>
            <div style={styles.scoreRow}>
              <div style={styles.scoreBox}>
                <p style={styles.scoreValue}>{resume.resume_quality_score ?? "—"}</p>
                <p style={styles.scoreLabel}>Resume Quality</p>
              </div>
              <div style={styles.scoreBox}>
                <p style={styles.scoreValue}>{resume.ats_compatibility_score ?? "—"}</p>
                <p style={styles.scoreLabel}>ATS Compatibility</p>
              </div>
            </div>

            {resume.evaluation && (
              <>
                {resume.evaluation.missing_sections.length > 0 && (
                  <>
                    <p style={styles.sectionTitle}>Missing sections</p>
                    {resume.evaluation.missing_sections.map((s) => (
                      <p key={s} style={styles.issueItem}>⚠️ {s.charAt(0).toUpperCase() + s.slice(1)}</p>
                    ))}
                  </>
                )}

                {resume.evaluation.detected_issues.length > 0 && (
                  <>
                    <p style={{ ...styles.sectionTitle, marginTop: 16 }}>Detected issues</p>
                    {resume.evaluation.detected_issues.map((issue, i) => (
                      <p key={i} style={styles.issueItem}>• {issue}</p>
                    ))}
                  </>
                )}

                <p style={{ ...styles.sectionTitle, marginTop: 16 }}>Improvement suggestions</p>
                <div style={styles.suggestionBox}>{resume.evaluation.improvement_suggestions}</div>
              </>
            )}
          </div>

          <div style={styles.card}>
            <p style={styles.sectionTitle}>Extracted skills ({resume.skills?.length || 0})</p>
            {(!resume.skills || resume.skills.length === 0) ? (
              <p style={styles.noSkillsText}>No recognised skills were found in this resume yet.</p>
            ) : (
              Object.entries(groupedSkills).map(([category, skills]) => (
                <div key={category} style={styles.skillCategoryGroup}>
                  <p style={styles.skillCategoryLabel}>{category}</p>
                  <div style={styles.skillChipRow}>
                    {skills.map((skill) => (
                      <span key={skill.skill_name} style={styles.skillChip}>{skill.skill_name}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
          {resume && (
            <div style={styles.advisorBanner}>
              <div>
                <p style={{ fontWeight: 700, margin: "0 0 3px", fontSize: 14 }}>Not sure what this means for you?</p>
                <p style={{ fontSize: 12.5, opacity: 0.9, margin: 0, color: "#dce9f2" }}>Ask your AI Career Advisor to explain your results and suggest next steps.</p>
              </div>
              <button style={styles.advisorBtn} onClick={() => onNavigate && onNavigate("advisor")}>Talk to advisor →</button>
            </div>
          )}
        </>
      )}

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

export default ResumeEvaluation;