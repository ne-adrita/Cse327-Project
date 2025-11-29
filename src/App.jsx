import React, { useState } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Journal from "./components/Journal";
import CalendarView from "./components/CalendarView";
import Insights from "./components/Insights";
import Resources from "./components/Resources";
import Community from "./components/Community";
import Meditation from "./components/Meditation";
import Progress from "./components/Progress";
import AIChat from "./components/AIChat";
import Settings from "./components/Settings";
import { getLoggedInUser, logoutUser } from "./auth/authService";

export default function App() {
  const [user, setUser] = useState(getLoggedInUser());
  const [activeModule, setActiveModule] = useState("dashboard");

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard": return <Dashboard />;
      case "journal": return <Journal />;
      case "calendar": return <CalendarView />;
      case "insights": return <Insights />;
      case "resources": return <Resources />;
      case "community": return <Community />;
      case "meditation": return <Meditation />;
      case "progress": return <Progress />;
      case "ai-chat": return <AIChat />;
      case "settings": return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar active={activeModule} onNavigate={setActiveModule} />
      <div className="main-content">
      <Header 
        onNavigate={setActiveModule} 
        onLogout={() => { 
          logoutUser();      // clear localStorage
          setUser(null);     // reset React state → triggers Login screen
        }} 
      />
        <div className="module-container">
          {renderModule(activeModule)}
        </div>
      </div>
    </div>
  );
}
