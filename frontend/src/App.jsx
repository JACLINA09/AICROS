import { useState } from "react";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/student/Dashboard";
import ResumeEvaluation from "./pages/student/ResumeEvaluation";
import CareerOpportunities from "./pages/student/CareerOpportunities";
import JobDetail from "./pages/student/JobDetail";
import MyApplications from "./pages/student/MyApplications";
import CareerSimulation from "./pages/student/CareerSimulation";
import CareerPortfolio from "./pages/student/CareerPortfolio";
import AICareerAdvisor from "./pages/student/AICareerAdvisor";
import IndustryRegisterPage from "./pages/industry/RegisterPage";
import IndustryDashboard from "./pages/industry/Dashboard";
import PostJob from "./pages/industry/PostJob";
import Applicants from "./pages/industry/Applicants";
import PostSimulationTask from "./pages/industry/PostSimulationTask";
import AdminDashboard from "./pages/admin/Dashboard";
import IndustryAccounts from "./pages/admin/IndustryAccounts";
import UpskillingCourses from "./pages/admin/UpskillingCourses";
import "./App.css";

const navStyles = {
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 40px", background: "white", borderBottom: "1px solid #F0F0EE" },
  logo: { fontSize: 18, fontWeight: 800, background: "linear-gradient(90deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginRight: 28 },
  pillGroup: { display: "flex", alignItems: "center", gap: 4, background: "#F5F5F3", borderRadius: 12, padding: 4 },
  pill: (active) => ({
    padding: "8px 16px", borderRadius: 9, border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 600, background: active ? "white" : "transparent",
    color: active ? "#1A1A1A" : "#888", boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
  }),
  avatar: { width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(90deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" },
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
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [activeJobId, setActiveJobId] = useState(1);

  const handleLoginSuccess = (user, type) => {
    setLoggedInUser(user);
    setUserType(type);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUserType(null);
    setAuthView("home");
    setCurrentPage("dashboard");
  };

  const navigateTo = (page, jobId = null) => {
    if (jobId) setActiveJobId(jobId);
    setCurrentPage(page);
    setSelectedJobId(null);
  };

  if (!loggedInUser) {
    if (authView === "home") {
      return <Homepage onLoginClick={() => setAuthView("login")} onRegisterClick={() => setAuthView("register")} />;
    }
    if (authView === "register") {
      return <RegisterPage onRegisterSuccess={(s) => handleLoginSuccess(s, "student")} onBackToLogin={() => setAuthView("login")} />;
    }
    if (authView === "industryRegister") {
      return <IndustryRegisterPage onBackToLogin={() => setAuthView("login")} />;
    }
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onRegisterClick={() => setAuthView("register")}
        onIndustryRegisterClick={() => setAuthView("industryRegister")}
      />
    );
  }

  // --- Admin view ---
  if (userType === "admin") {
    return (
      <div>
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
      <div>
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
    <div>
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
        <CareerOpportunities student={loggedInUser} onSelectJob={(jobId) => setSelectedJobId(jobId)} />
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
      {currentPage === "simulation" && <CareerSimulation student={loggedInUser} jobId={activeJobId} />}
      {currentPage === "portfolio" && <CareerPortfolio student={loggedInUser} jobId={activeJobId} />}
    </div>
  );
}

export default App;