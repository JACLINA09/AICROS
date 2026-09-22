import { useState } from "react";
import { registerIndustry } from "../services/industryService";

const styles = {
	page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#eaf1f7", fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", padding: 20, boxSizing: "border-box" },
	card: { width: "100%", maxWidth: 620, background: "#f5f1e6", border: "1px solid #c7d7e4", borderRadius: 12, padding: "34px 32px", boxShadow: "0 10px 24px rgba(23,50,77,0.12)", boxSizing: "border-box" },
	brand: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24, border: "none", background: "transparent", cursor: "pointer", width: "100%" },
	logo: { width: 38, height: 38, objectFit: "contain" },
	brandText: { color: "#234e70", fontSize: 22, fontWeight: 850 },
	heading: { color: "#17324d", fontSize: 24, margin: "0 0 6px" },
	subheading: { color: "#47647d", fontSize: 13.5, margin: "0 0 22px" },
	label: { display: "block", color: "#234e70", fontSize: 12.5, fontWeight: 750, marginBottom: 6 },
	input: { width: "100%", height: 42, padding: "0 12px", marginBottom: 14, borderRadius: 8, border: "1px solid #b8cddd", background: "#ffffff", color: "#17324d", fontSize: 13.5, boxSizing: "border-box" },
	row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
	button: { width: "100%", minHeight: 46, marginTop: 8, border: "none", borderRadius: 8, background: "#1f5f8b", color: "#ffffff", fontSize: 14, fontWeight: 750, cursor: "pointer" },
	error: { color: "#b42318", background: "#fce8e6", padding: "10px 12px", borderRadius: 8, fontSize: 12.5, margin: "14px 0 0" },
	footer: { textAlign: "center", color: "#47647d", fontSize: 12.5, margin: "22px 0 0" },
	link: { border: "none", background: "transparent", color: "#1f5f8b", fontWeight: 750, cursor: "pointer", padding: 0 },
};

function RegisterPageIndustry({ onBackToLogin, onHomeClick }) {
	const [form, setForm] = useState({ company_name: "", industry_sector: "", website_url: "", contact_person: "", phone_number: "", email: "", password: "", logo_url: "" });
	const [error, setError] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);

	const update = (field) => (event) => {
		setForm((current) => ({ ...current, [field]: event.target.value }));
		setError("");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!form.company_name.trim() || !form.industry_sector.trim() || !form.contact_person.trim() || !form.phone_number.trim() || !form.email.trim() || !form.password.trim()) {
			setError("Company, sector, contact person, phone, email, and password are required.");
			return;
		}
		setLoading(true);
		try {
			await registerIndustry(form);
			setSubmitted(true);
		} catch (requestError) {
			setError(requestError.message || "Registration failed. Please try again.");
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
				{submitted ? (
					<div>
						<h1 style={styles.heading}>Registration submitted</h1>
						<p style={styles.subheading}>Your account is pending admin approval. You can log in after an administrator approves it.</p>
						<button type="button" style={styles.button} onClick={onBackToLogin}>Go to industry login</button>
					</div>
				) : (
					<>
						<h1 style={styles.heading}>Register your company</h1>
						<p style={styles.subheading}>Create an industry partner profile to post opportunities and review student applicants.</p>
						<div style={styles.row}>
							<div><label style={styles.label}>Company name *</label><input style={styles.input} value={form.company_name} onChange={update("company_name")} /></div>
							<div><label style={styles.label}>Industry sector *</label><input style={styles.input} value={form.industry_sector} onChange={update("industry_sector")} /></div>
						</div>
						<div style={styles.row}>
							<div><label style={styles.label}>Contact person *</label><input style={styles.input} value={form.contact_person} onChange={update("contact_person")} /></div>
							<div><label style={styles.label}>Phone number *</label><input style={styles.input} value={form.phone_number} onChange={update("phone_number")} /></div>
						</div>
						<label style={styles.label}>Website URL</label>
						<input style={styles.input} value={form.website_url} onChange={update("website_url")} placeholder="https://company.com" />
						<label style={styles.label}>Logo URL</label>
						<input style={styles.input} value={form.logo_url} onChange={update("logo_url")} placeholder="https://company.com/logo.png" />
						<div style={styles.row}>
							<div><label style={styles.label}>Email *</label><input type="email" style={styles.input} value={form.email} onChange={update("email")} /></div>
							<div><label style={styles.label}>Password *</label><input type="password" style={styles.input} value={form.password} onChange={update("password")} /></div>
						</div>
						<button type="submit" style={styles.button} disabled={loading}>{loading ? "Submitting..." : "Register Industry Partner"}</button>
						{error && <p style={styles.error} role="alert">{error}</p>}
						<p style={styles.footer}>Already registered? <button type="button" style={styles.link} onClick={onBackToLogin}>Industry login</button></p>
					</>
				)}
			</form>
		</div>
	);
}

export default RegisterPageIndustry;
