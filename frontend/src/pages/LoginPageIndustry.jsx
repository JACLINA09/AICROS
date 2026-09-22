import { useState } from "react";
import { loginIndustry } from "../services/industryService";

const styles = {
	page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#eaf1f7", fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", padding: 20, boxSizing: "border-box" },
	card: { width: "100%", maxWidth: 470, background: "#f5f1e6", border: "1px solid #c7d7e4", borderRadius: 12, padding: "38px 34px", boxShadow: "0 10px 24px rgba(23,50,77,0.12)", boxSizing: "border-box" },
	brand: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 28, border: "none", background: "transparent", cursor: "pointer", width: "100%" },
	logo: { width: 38, height: 38, objectFit: "contain" },
	brandText: { color: "#234e70", fontSize: 22, fontWeight: 850 },
	heading: { color: "#17324d", fontSize: 24, margin: "0 0 6px" },
	subheading: { color: "#47647d", fontSize: 13.5, margin: "0 0 24px" },
	label: { display: "block", color: "#234e70", fontSize: 12.5, fontWeight: 750, marginBottom: 6 },
	input: { width: "100%", height: 46, padding: "0 12px", marginBottom: 16, borderRadius: 8, border: "1px solid #b8cddd", background: "#ffffff", color: "#17324d", fontSize: 13.5, boxSizing: "border-box" },
	button: { width: "100%", minHeight: 46, marginTop: 4, border: "none", borderRadius: 8, background: "#1f5f8b", color: "#ffffff", fontSize: 14, fontWeight: 750, cursor: "pointer" },
	error: { color: "#b42318", background: "#fce8e6", padding: "10px 12px", borderRadius: 8, fontSize: 12.5, margin: "14px 0 0", lineHeight: 1.45 },
	footer: { textAlign: "center", color: "#47647d", fontSize: 12.5, margin: "22px 0 0" },
	link: { border: "none", background: "transparent", color: "#1f5f8b", fontWeight: 750, cursor: "pointer", padding: 0 },
};

function LoginPageIndustry({ onLoginSuccess, onRegisterClick, onHomeClick }) {
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
			const industry = await loginIndustry(email.trim(), password);
			onLoginSuccess(industry, "industry");
		} catch (requestError) {
			setError(requestError.message || "Login failed. Your account may still be pending approval.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={styles.page}>
			<form style={styles.card} onSubmit={handleSubmit}>
				<button type="button" onClick={onHomeClick} title="Back to homepage" style={styles.brand}>
					<img src="/ai-cros-logo.png" alt="AI-CROS Logo" style={styles.logo} />
					<span style={styles.brandText}>AI-CROS Industry</span>
				</button>
				<h1 style={styles.heading}>Industry partner login</h1>
				<p style={styles.subheading}>Approved partners can manage opportunities and review applicants.</p>
				<label style={styles.label}>Company email</label>
				<input type="email" style={styles.input} value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} />
				<label style={styles.label}>Password</label>
				<input type="password" style={styles.input} value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} />
				<button type="submit" style={styles.button} disabled={loading}>{loading ? "Signing in..." : "Sign in as Industry Partner"}</button>
				{error && <p style={styles.error} role="alert">{error}</p>}
				<p style={styles.footer}>Need an account? <button type="button" style={styles.link} onClick={onRegisterClick}>Register your company</button></p>
			</form>
		</div>
	);
}

export default LoginPageIndustry;
