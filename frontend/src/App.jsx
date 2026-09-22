import { useState } from "react";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import LoginPageIndustry from "./pages/LoginPageIndustry";
import LoginPageAdmin from "./pages/LoginPageAdmin";
import StudentRegisterPage from "./pages/StudentRegisterPage";
import RegisterPageIndustry from "./pages/RegisterPageIndustry";
import Dashboard from "./pages/student/Dashboard";
import ResumeEvaluation from "./pages/student/ResumeEvaluation";
import CareerOpportunities from "./pages/student/CareerOpportunities";
import JobDetail from "./pages/student/JobDetail";
import MyApplications from "./pages/student/MyApplications";
import CareerSimulation from "./pages/student/CareerSimulation";
import CareerPortfolio from "./pages/student/CareerPortfolio";
import AICareerAdvisor from "./pages/student/AICareerAdvisor";
import IndustryDashboard from "./pages/industry/Dashboard";
import PostJob from "./pages/industry/PostJob";
import Applicants from "./pages/industry/Applicants";
import PostSimulationTask from "./pages/industry/PostSimulationTask";
import AdminDashboard from "./pages/admin/Dashboard";
import IndustryAccounts from "./pages/admin/IndustryAccounts";
import UpskillingCourses from "./pages/admin/UpskillingCourses";
import "./App.css";

const navStyles = {
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", background: "#f5f1e6", borderBottom: "1px solid #c7d7e4" },
  logo: { fontSize: 18, fontWeight: 850, color: "#234e70", marginRight: 28 },
  pillGroup: { display: "flex", alignItems: "center", gap: 4, background: "#eaf1f7", borderRadius: 10, padding: 4, border: "1px solid #c7d7e4" },
  pill: (active) => ({
    padding: "8px 16px", borderRadius: 9, border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 650, background: active ? "#1f5f8b" : "transparent",
    color: active ? "#ffffff" : "#47647d", boxShadow: active ? "0 2px 5px rgba(23,50,77,0.14)" : "none",
  }),
  avatar: { width: 34, height: 34, borderRadius: "50%", background: "#234e70", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" },
};

const studentTabs = [
  { key: "dashboard", label: "Overview" },
  { key: "advisor", label: "AI Advisor" },
  { key: "resume", label: "Resume" },
  { key: "jobs", label: "Jobs" },
  { key: "simulation", label: "Simulation" },
  { key: "portfolio", label: "Portfolio" },
  { key: "applications", label: "Applications" },
];

const industryTabs = [
  { key: "dashboard", label: "Overview" },
  { key: "postJob", label: "Post Job" },
  { key: "postTask", label: "Simulation Tasks" },
  { key: "applicants", label: "Applicants" },
];

const adminTabs = [
  { key: "dashboard", label: "Overview" },
  { key: "industryAccounts", label: "Industry Accounts" },
  { key: "courses", label: "Upskilling Courses" },
];

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [authView, setAuthView] = useState("home");
  const [loginRole, setLoginRole] = useState("student");
  const [employerChoiceOpen, setEmployerChoiceOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [activeJobId, setActiveJobId] = useState(null);

  const handleLoginSuccess = (user, type) => {
    setLoggedInUser(user);
    setUserType(type);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUserType(null);
    setAuthView("home");
    setLoginRole("student");
    setEmployerChoiceOpen(false);
    setCurrentPage("dashboard");
    setActiveJobId(null);
  };

  const navigateTo = (page, jobId = null) => {
    if (jobId) setActiveJobId(jobId);
    setCurrentPage(page);
    setSelectedJobId(null);
  };

  if (!loggedInUser) {
    if (authView === "home") {
      return (
        <>
          <Homepage
            onLoginClick={(role = "student") => { setLoginRole(role); setAuthView("login"); }}
            onRegisterClick={(role = "student") => setAuthView(role === "industry" ? "industryRegister" : "studentRegister")}
            onEmployerClick={() => setEmployerChoiceOpen(true)}
          />
          {employerChoiceOpen && (
            <div
              role="presentation"
              onClick={() => setEmployerChoiceOpen(false)}
              style={{ position: "fixed", inset: 0, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(23, 50, 77, 0.32)" }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="employer-choice-title"
                onClick={(event) => event.stopPropagation()}
                style={{ width: "100%", maxWidth: 420, padding: 30, borderRadius: 14, background: "#f5f1e6", border: "1px solid #c7d7e4", boxShadow: "0 18px 44px rgba(23, 50, 77, 0.22)", textAlign: "center" }}
              >
                <button aria-label="Close" onClick={() => setEmployerChoiceOpen(false)} style={{ float: "right", border: "none", background: "transparent", color: "#47647d", fontSize: 22, cursor: "pointer" }}>x</button>
                <p style={{ margin: "8px 0 6px", color: "#1f5f8b", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>Industry Partner Portal</p>
                <h2 id="employer-choice-title" style={{ margin: "0 0 8px", color: "#17324d", fontSize: 24 }}>Welcome, employer</h2>
                <p style={{ margin: "0 0 24px", color: "#47647d", fontSize: 14 }}>Choose how you would like to continue.</p>
                <div style={{ display: "grid", gap: 10 }}>
                  <button onClick={() => { setEmployerChoiceOpen(false); setAuthView("industryLogin"); }} style={{ minHeight: 46, border: "none", borderRadius: 8, background: "#1f5f8b", color: "#ffffff", fontWeight: 750, cursor: "pointer" }}>Log in as Industry Partner</button>
                  <button onClick={() => { setEmployerChoiceOpen(false); setAuthView("industryRegister"); }} style={{ minHeight: 46, border: "1px solid #1f5f8b", borderRadius: 8, background: "#e5eff7", color: "#1f5f8b", fontWeight: 750, cursor: "pointer" }}>Register as Industry Partner</button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
    if (authView === "studentRegister") {
      return <StudentRegisterPage onRegisterSuccess={(s) => handleLoginSuccess(s, "student")} onBackToLogin={() => { setLoginRole("student"); setAuthView("login"); }} onHomeClick={() => setAuthView("home")} />;
    }
    if (authView === "industryRegister") {
      return <RegisterPageIndustry onBackToLogin={() => setAuthView("industryLogin")} onHomeClick={() => setAuthView("home")} />;
    }
    if (authView === "industryLogin") {
      return <LoginPageIndustry onLoginSuccess={handleLoginSuccess} onRegisterClick={() => setAuthView("industryRegister")} onHomeClick={() => setAuthView("home")} />;
    }
    if (loginRole === "admin") {
      return <LoginPageAdmin onLoginSuccess={handleLoginSuccess} onHomeClick={() => { setLoginRole("student"); setAuthView("home"); }} />;
    }
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onRegisterClick={() => setAuthView("studentRegister")}
        onHomeClick={() => { setLoginRole("student"); setAuthView("home"); }}
      />
    );
  }

  // --- Admin view ---
  if (userType === "admin") {
    return (
      <div style={{ background: "#0d1117", minHeight: "100vh" }}>
        <div style={navStyles.topBar}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={navStyles.logo}>AI-CROS</span>
            <div style={navStyles.pillGroup}>
              {adminTabs.map((t) => (
                <button key={t.key} style={navStyles.pill(currentPage === t.key)} onClick={() => setCurrentPage(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div style={navStyles.avatar} onClick={handleLogout} title="Log out">
            {loggedInUser.username.slice(0, 2).toUpperCase()}
          </div>
        </div>
        {currentPage === "dashboard" && <AdminDashboard admin={loggedInUser} />}
        {currentPage === "industryAccounts" && <IndustryAccounts admin={loggedInUser} />}
        {currentPage === "courses" && <UpskillingCourses admin={loggedInUser} />}
      </div>
    );
  }

  // --- Industry view ---
  if (userType === "industry") {
    return (
      <div style={{ background: "#0d1117", minHeight: "100vh" }}>
        <div style={navStyles.topBar}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={navStyles.logo}>AI-CROS</span>
            <div style={navStyles.pillGroup}>
              {industryTabs.map((t) => (
                <button key={t.key} style={navStyles.pill(currentPage === t.key)} onClick={() => setCurrentPage(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div style={navStyles.avatar} onClick={handleLogout} title="Log out">
            {loggedInUser.company_name.slice(0, 2).toUpperCase()}
          </div>
        </div>
        {currentPage === "dashboard" && <IndustryDashboard industry={loggedInUser} />}
        {currentPage === "postJob" && <PostJob industry={loggedInUser} />}
        {currentPage === "postTask" && <PostSimulationTask industry={loggedInUser} />}
        {currentPage === "applicants" && <Applicants industry={loggedInUser} />}
      </div>
    );
  }

  // --- Student view ---
  return (
    <div className="student-shell" style={{ background: "#eaf1f7", minHeight: "100vh" }}>
      <div style={navStyles.topBar}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={navStyles.logo}>AI-CROS</span>
          <div style={navStyles.pillGroup}>
            {studentTabs.map((t) => (
              <button key={t.key} style={navStyles.pill(currentPage === t.key)} onClick={() => { setCurrentPage(t.key); setSelectedJobId(null); }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={navStyles.avatar} onClick={handleLogout} title="Log out">
          {loggedInUser.fullname.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
      </div>

      {currentPage === "dashboard" && <Dashboard student={loggedInUser} onNavigate={navigateTo} />}
      {currentPage === "advisor" && <AICareerAdvisor student={loggedInUser} activeJobId={activeJobId} onNavigate={navigateTo} />}
      {currentPage === "resume" && <ResumeEvaluation student={loggedInUser} onNavigate={navigateTo} />}
      {currentPage === "jobs" && !selectedJobId && (
        <CareerOpportunities
          student={loggedInUser}
          onSelectJob={(jobId) => setSelectedJobId(jobId)}
          onStartSimulation={(jobId) => { setActiveJobId(jobId); setCurrentPage("simulation"); setSelectedJobId(null); }}
        />
      )}
      {currentPage === "jobs" && selectedJobId && (
        <JobDetail
          jobId={selectedJobId}
          student={loggedInUser}
          onBack={() => setSelectedJobId(null)}
          onStartSimulation={(jobId) => { setActiveJobId(jobId); setCurrentPage("simulation"); setSelectedJobId(null); }}
          onViewPortfolio={(jobId) => { setActiveJobId(jobId); setCurrentPage("portfolio"); setSelectedJobId(null); }}
        />
      )}
      {currentPage === "applications" && <MyApplications student={loggedInUser} />}
      {currentPage === "simulation" && (
        <CareerSimulation
          student={loggedInUser}
          jobId={activeJobId}
          onStartSimulation={(jobId) => { setActiveJobId(jobId); setCurrentPage("simulation"); }}
        />
      )}
      {currentPage === "portfolio" && <CareerPortfolio student={loggedInUser} jobId={activeJobId} />}
    </div>
  );
}

export default App;