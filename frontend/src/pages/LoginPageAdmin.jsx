import { useState } from "react";
import { loginAdmin } from "../services/adminService";

const styles = {
	page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#eaf1f7", fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", padding: 20, boxSizing: "border-box" },
	layout: { width: "100%", maxWidth: 900, display: "grid", gridTemplateColumns: "0.9fr 1.1fr", background: "#f5f1e6", border: "1px solid #c7d7e4", borderRadius: 14, overflow: "hidden", boxShadow: "0 14px 30px rgba(23,50,77,0.14)" },
	intro: { padding: 42, background: "#17324d", color: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 430, boxSizing: "border-box" },
	brand: { display: "flex", alignItems: "center", gap: 10, border: "none", background: "transparent", color: "#ffffff", cursor: "pointer", padding: 0, fontSize: 21, fontWeight: 850, textAlign: "left" },
	logo: { width: 38, height: 38, objectFit: "contain" },
	eyebrow: { color: "#c9ddec", fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase" },
	introTitle: { color: "#ffffff", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 32, lineHeight: 1.12, margin: "12px 0" },
	introText: { color: "#dce9f2", fontSize: 14, lineHeight: 1.6, margin: 0 },
	form: { padding: "48px 44px", boxSizing: "border-box" },
	heading: { color: "#17324d", fontSize: 25, margin: "0 0 6px" },
	subheading: { color: "#47647d", fontSize: 13.5, margin: "0 0 24px" },
	label: { display: "block", color: "#234e70", fontSize: 12.5, fontWeight: 750, marginBottom: 6 },
	input: { width: "100%", height: 46, padding: "0 12px", marginBottom: 17, borderRadius: 8, border: "1px solid #b8cddd", background: "#ffffff", color: "#17324d", fontSize: 13.5, boxSizing: "border-box" },
	button: { width: "100%", minHeight: 46, marginTop: 5, border: "none", borderRadius: 8, background: "#1f5f8b", color: "#ffffff", fontSize: 14, fontWeight: 750, cursor: "pointer" },
	error: { color: "#b42318", background: "#fce8e6", padding: "10px 12px", borderRadius: 8, fontSize: 12.5, margin: "14px 0 0", lineHeight: 1.45 },
	footer: { textAlign: "center", color: "#47647d", fontSize: 12.5, margin: "22px 0 0" },
	link: { border: "none", background: "transparent", color: "#1f5f8b", fontWeight: 750, cursor: "pointer", padding: 0 },
};

function LoginPageAdmin({ onLoginSuccess, onHomeClick }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		if (!email.trim() || !password) {
			setError("Email and password are required.");
			return;
		}
		setLoading(true);
		try {
			const admin = await loginAdmin(email.trim(), password);
			onLoginSuccess(admin, "admin");
		} catch (requestError) {
			setError(requestError.message || "Admin login failed. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={styles.page}>
			<div style={styles.layout}>
				<section style={styles.intro}>
					<button type="button" onClick={onHomeClick} title="Back to homepage" style={styles.brand}>
						<img src="/ai-cros-logo.png" alt="AI-CROS Logo" style={styles.logo} />
						<span>AI-CROS Admin</span>
					</button>
					<div>
						<span style={styles.eyebrow}>System Administration</span>
						<h1 style={styles.introTitle}>Keep the career network moving.</h1>
						<p style={styles.introText}>Review industry accounts, approve trusted partners, and maintain the platform from one focused workspace.</p>
					</div>
				</section>
				<form style={styles.form} onSubmit={handleSubmit}>
					<h2 style={styles.heading}>Admin sign in</h2>
					<p style={styles.subheading}>Use your administrator credentials to continue.</p>
					<label style={styles.label}>Admin email</label>
					<input type="email" style={styles.input} value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} autoComplete="username" />
					<label style={styles.label}>Password</label>
					<input type="password" style={styles.input} value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} autoComplete="current-password" />
					<button type="submit" style={styles.button} disabled={loading}>{loading ? "Signing in..." : "Enter Admin Workspace"}</button>
					{error && <p style={styles.error} role="alert">{error}</p>}
					<p style={styles.footer}><button type="button" style={styles.link} onClick={onHomeClick}>Back to homepage</button></p>
				</form>
			</div>
		</div>
	);
}

export default LoginPageAdmin;
