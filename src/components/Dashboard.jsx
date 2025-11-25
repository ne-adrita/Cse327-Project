import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState("happy");
  const [quickNote, setQuickNote] = useState("");
  const [activeTab, setActiveTab] = useState("today");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Calculate mood statistics
  const [moodStats, setMoodStats] = useState({
    weeklyData: [],
    redFlagStatus: "stable",
    moodTrend: "improving",
    consecutiveSadDays: 0,
    moodStreak: 0,
    mostCommonMood: "happy"
  });

  useEffect(() => {
    const arr = JSON.parse(localStorage.getItem("pc_demo_entries_v1") || "[]");
    const sortedEntries = arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    setEntries(sortedEntries);
    calculateMoodStats(sortedEntries);
  }, []);

  // Calculate dynamic mood statistics
  const calculateMoodStats = (allEntries) => {
    if (allEntries.length === 0) {
      setMoodStats({
        weeklyData: [30, 45, 60, 40, 55, 70, 65],
        redFlagStatus: "stable",
        moodTrend: "stable",
        consecutiveSadDays: 0,
        moodStreak: 0,
        mostCommonMood: "happy"
      });
      return;
    }

    // Get last 7 days of entries
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentEntries = allEntries.filter(entry => 
      new Date(entry.date) >= oneWeekAgo
    );

    // Calculate weekly mood data (0-100 scale)
    const weeklyData = calculateWeeklyMoodData(recentEntries);
    
    // Calculate red flag status
    const redFlagStatus = calculateRedFlagStatus(allEntries);
    
    // Calculate mood trend
    const moodTrend = calculateMoodTrend(weeklyData);
    
    // Calculate consecutive sad days
    const consecutiveSadDays = calculateConsecutiveSadDays(allEntries);

    // Calculate mood streak
    const moodStreak = calculateMoodStreak(allEntries);

    // Calculate most common mood
    const mostCommonMood = calculateMostCommonMood(allEntries);

    setMoodStats({
      weeklyData,
      redFlagStatus,
      moodTrend,
      consecutiveSadDays,
      moodStreak,
      mostCommonMood
    });
  };

  const calculateWeeklyMoodData = (recentEntries) => {
    const moodValues = {
      happy: 85,
      calm: 75,
      tired: 50,
      anxious: 30,
      sad: 20,
      angry: 15
    };

    const daysData = Array(7).fill(null).map(() => []);
    
    recentEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      const dayOfWeek = entryDate.getDay();
      daysData[dayOfWeek].push(moodValues[entry.mood] || 50);
    });

    return daysData.map(dayEntries => {
      if (dayEntries.length === 0) {
        return 40 + Math.random() * 30;
      }
      return dayEntries.reduce((sum, val) => sum + val, 0) / dayEntries.length;
    });
  };

  const calculateRedFlagStatus = (allEntries) => {
    if (allEntries.length === 0) return "stable";

    const recentEntries = allEntries.slice(0, 7);
    
    const moodCounts = {
      sad: 0,
      anxious: 0,
      angry: 0,
      happy: 0,
      calm: 0,
      tired: 0
    };

    recentEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const totalRecent = recentEntries.length;
    const negativeMoodRatio = (moodCounts.sad + moodCounts.anxious + moodCounts.angry) / totalRecent;
    
    if (negativeMoodRatio >= 0.7) return "high_risk";
    if (negativeMoodRatio >= 0.5) return "moderate_risk";
    if (moodCounts.sad >= 3) return "monitor";
    
    return "stable";
  };

  const calculateMoodTrend = (weeklyData) => {
    if (weeklyData.length < 2) return "stable";
    
    const firstHalf = weeklyData.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const secondHalf = weeklyData.slice(4).reduce((a, b) => a + b, 0) / 3;
    
    if (secondHalf > firstHalf + 10) return "improving";
    if (secondHalf < firstHalf - 10) return "declining";
    return "stable";
  };

  const calculateConsecutiveSadDays = (allEntries) => {
    let maxConsecutive = 0;
    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      const hasSadEntry = allEntries.some(entry => 
        new Date(entry.date).toDateString() === dateStr && 
        (entry.mood === 'sad' || entry.mood === 'anxious')
      );
      
      if (hasSadEntry) {
        currentStreak++;
        maxConsecutive = Math.max(maxConsecutive, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxConsecutive;
  };

  const calculateMoodStreak = (allEntries) => {
    if (allEntries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    const sortedByDate = [...allEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    for (let i = 0; i < sortedByDate.length; i++) {
      const entryDate = new Date(sortedByDate[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (entryDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateMostCommonMood = (allEntries) => {
    if (allEntries.length === 0) return "happy";
    
    const moodCounts = {};
    allEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    return Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );
  };

  const getRedFlagMessage = (status) => {
    switch (status) {
      case "high_risk":
        return {
          message: "Multiple concerning mood patterns detected",
          submessage: "Consider speaking with a healthcare provider",
          type: "warning",
          icon: "⚠️",
          color: "#ef4444"
        };
      case "moderate_risk":
        return {
          message: "Some mood patterns need attention",
          submessage: "Monitor your feelings and reach out if needed",
          type: "monitor",
          icon: "🔍",
          color: "#f59e0b"
        };
      case "monitor":
        return {
          message: "Periods of sadness detected",
          submessage: "Keep tracking and practice self-care",
          type: "info",
          icon: "💡",
          color: "#3b82f6"
        };
      default:
        return {
          message: "No prolonged sadness detected",
          submessage: "Your mood patterns appear stable",
          type: "success",
          icon: "✓",
          color: "#10b981"
        };
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving": return "📈";
      case "declining": return "📉";
      default: return "➡️";
    }
  };

  const getTrendMessage = (trend) => {
    switch (trend) {
      case "improving": return "Your mood is improving this week";
      case "declining": return "Your mood trend needs attention";
      default: return "Your mood is stable this week";
    }
  };

  const getMoodInsight = () => {
    const insights = [
      "Taking time for self-care is important during postpartum recovery",
      "Small moments of joy add up - celebrate them!",
      "Your feelings are valid and important",
      "Rest when you can, even short breaks help",
      "Connecting with other moms can provide great support",
      "Be gentle with yourself - you're doing amazing work"
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const handleSaveQuick = () => {
    if (!quickNote.trim()) return;
    const arr = JSON.parse(localStorage.getItem("pc_demo_entries_v1") || "[]");

    const newEntry = {
      id: Date.now(),
      mood: selectedMood,
      title: quickNote.slice(0, 36),
      note: quickNote,
      date: new Date().toISOString(),
    };

    arr.push(newEntry);
    localStorage.setItem("pc_demo_entries_v1", JSON.stringify(arr));
    const sortedEntries = arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    setEntries(sortedEntries);
    calculateMoodStats(sortedEntries);

    setQuickNote("");
  };

  const handleDeleteEntry = (id) => {
    const arr = JSON.parse(localStorage.getItem("pc_demo_entries_v1") || "[]");
    const filteredArr = arr.filter(entry => entry.id !== id);
    localStorage.setItem("pc_demo_entries_v1", JSON.stringify(filteredArr));
    setEntries(filteredArr.sort((a, b) => new Date(b.date) - new Date(a.date)));
    calculateMoodStats(filteredArr);
    setDeleteConfirm(null);
  };

  const handleClearQuick = () => setQuickNote("");

  const moodEmojis = {
    happy: "😊",
    sad: "😔",
    anxious: "😰",
    tired: "😴",
    angry: "😠",
    calm: "😌",
  };

  const moodColors = {
    happy: "#10b981",
    calm: "#3b82f6",
    tired: "#f59e0b",
    anxious: "#f59e0b",
    sad: "#ef4444",
    angry: "#dc2626"
  };

  const formatDateTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  const getFilteredEntries = () => {
    const today = new Date().toDateString();
    switch (activeTab) {
      case "today":
        return entries.filter(entry => new Date(entry.date).toDateString() === today);
      case "week":
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return entries.filter(entry => new Date(entry.date) >= oneWeekAgo);
      default:
        return entries;
    }
  };

  const filteredEntries = getFilteredEntries();

  const redFlagInfo = getRedFlagMessage(moodStats.redFlagStatus);

  return (
    <section className="module fadeIn" data-module="dashboard" style={{ animation: "fadeIn 0.6s ease" }}>
      
      {/* Beautiful Animated Header */}
      <div style={{
        padding: "20px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        marginBottom: "20px",
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-50%",
          width: "100%",
          height: "200%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          animation: "float 6s ease-in-out infinite"
        }}></div>
        
        <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800" }}>Welcome back! 👋</h2>
        <div style={{ fontSize: "15px", opacity: 0.9, marginTop: "8px" }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div style={{ 
          marginTop: "12px", 
          padding: "8px 12px", 
          background: "rgba(255,255,255,0.2)", 
          borderRadius: "20px", 
          display: "inline-block",
          fontSize: "13px"
        }}>
          💡 {getMoodInsight()}
        </div>
      </div>

      {/* Three-card section */}
      <div className="grid cols-3" style={{ alignItems: "stretch", gap: "16px" }}>
        
        {/* TODAY'S MOOD CARD */}
        <div className="card soft-glass pop" style={{
          background: "linear-gradient(135deg, rgba(139, 211, 199, 0.1), rgba(139, 211, 199, 0.05))",
          border: "1px solid rgba(139, 211, 199, 0.2)"
        }}>
          <h3>Today's Mood</h3>
          <div className="mood-emoji big-emoji" style={{ 
            fontSize: "48px",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))"
          }}>
            {moodEmojis[selectedMood]}
          </div>
          <div className="mood-pill" style={{
            background: moodColors[selectedMood],
            color: "white",
            padding: "6px 16px",
            borderRadius: "20px",
            fontWeight: "600",
            marginTop: "8px"
          }}>
            {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}
          </div>
          
          {/* Streak Counter */}
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "4px" }}>
              Tracking Streak
            </div>
            <div style={{ 
              fontSize: "20px", 
              fontWeight: "800", 
              color: moodStats.moodStreak > 0 ? "#10b981" : "var(--muted)" 
            }}>
              {moodStats.moodStreak} days 🔥
            </div>
          </div>
        </div>

        {/* WEEKLY GLANCE - INTERACTIVE */}
        <div className="card soft-glass pop">
          <h3>Weekly Mood Journey</h3>
          <div className="chart-placeholder" style={{ height: "120px", position: "relative" }}>
            <div className="animated-bars" style={{ 
              display: "flex", 
              height: "100%", 
              alignItems: "end", 
              gap: "8px",
              padding: "0 8px"
            }}>
              {moodStats.weeklyData.map((height, i) => (
                <div
                  key={i}
                  className="bar"
                  style={{
                    height: `${height}%`,
                    animationDelay: `${i * 0.12}s`,
                    background: height >= 70 ? "#10b981" : 
                               height >= 40 ? "#f59e0b" : "#ef4444",
                    flex: 1,
                    borderRadius: "4px 4px 0 0",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.opacity = "1";
                  }}
                />
              ))}
            </div>
          </div>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            fontSize: "11px", 
            color: "var(--muted)",
            marginTop: "8px",
            padding: "0 8px"
          }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <span key={i} style={{ 
                fontWeight: new Date().getDay() === i ? "800" : "400",
                color: new Date().getDay() === i ? moodColors[selectedMood] : "var(--muted)"
              }}>
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* MOOD HEALTH STATUS */}
        <div className="card soft-glass pop">
          <h3>Mood Health Status</h3>
          <div className="notification" style={{
            background: `${redFlagInfo.color}15`,
            border: `1px solid ${redFlagInfo.color}30`,
            borderRadius: "12px",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <div className="notification-icon" style={{
              fontSize: "20px",
              background: redFlagInfo.color,
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }}>
              {redFlagInfo.icon}
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px" }}>{redFlagInfo.message}</div>
              <div className="small" style={{ color: "var(--muted)", fontSize: "12px" }}>{redFlagInfo.submessage}</div>
            </div>
          </div>
          
          {/* Most Common Mood */}
          <div style={{ 
            marginTop: "12px", 
            padding: "8px 12px", 
            background: "rgba(139, 211, 199, 0.1)", 
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "11px", color: "var(--muted)" }}>Most Common Mood</div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: moodColors[moodStats.mostCommonMood] }}>
              {moodEmojis[moodStats.mostCommonMood]} {moodStats.mostCommonMood.charAt(0).toUpperCase() + moodStats.mostCommonMood.slice(1)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: "20px" }}></div>

      {/* RECENT ENTRIES + QUICK ADD */}
      <div className="grid cols-2" style={{ gap: "16px" }}>
        
        {/* Recent entries with tabs and delete */}
        <div className="card soft-glass pop">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0 }}>Your Entries</h3>
            <div style={{ display: "flex", gap: "8px", background: "rgba(255,255,255,0.05)", padding: "4px", borderRadius: "8px" }}>
              {["today", "week", "all"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: activeTab === tab ? "var(--accent)" : "transparent",
                    color: activeTab === tab ? "white" : "var(--text)",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "600",
                    transition: "all 0.2s ease"
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div id="entriesList">
            {filteredEntries.slice(0, 6).map((e) => (
              <div key={e.id} className="entry entry-hover" style={{
                position: "relative",
                padding: "12px",
                marginBottom: "8px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.02)",
                transition: "all 0.2s ease"
              }}>
                <div className="entry-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "18px" }}>{moodEmojis[e.mood]}</span>
                    <div>
                      <div className="entry-title" style={{ fontWeight: "600", fontSize: "14px" }}>{e.title}</div>
                      <div className="meta" style={{ fontSize: "11px", color: "var(--muted)" }}>{formatDateTime(e.date)}</div>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteConfirm(e.id)}
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "#ef4444",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "11px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(239, 68, 68, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(239, 68, 68, 0.1)";
                    }}
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="entry-note" style={{ 
                  marginTop: "8px", 
                  fontSize: "13px", 
                  color: "var(--text)",
                  lineHeight: "1.4"
                }}>
                  {e.note}
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === e.id && (
                  <div style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "rgba(0,0,0,0.9)",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    zIndex: 10
                  }}>
                    <div style={{ fontSize: "12px", marginBottom: "8px" }}>Delete this entry?</div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        onClick={() => handleDeleteEntry(e.id)}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "11px"
                        }}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          color: "var(--text)",
                          border: "none",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "11px"
                        }}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {filteredEntries.length === 0 && (
              <div style={{ 
                textAlign: "center", 
                color: "var(--muted)", 
                padding: "40px 20px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "8px",
                border: "1px dashed rgba(255,255,255,0.1)"
              }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>📝</div>
                <div>No entries found for {activeTab}</div>
                <div style={{ fontSize: "12px", marginTop: "4px" }}>Add your first entry to start tracking!</div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Add - Enhanced */}
        <div className="card soft-glass pop" style={{
          background: "linear-gradient(135deg, rgba(139, 211, 199, 0.05), rgba(255, 214, 224, 0.05))"
        }}>
          <h3>Quick Mood Log</h3>

          {/* Mood selector */}
          <label style={{ marginBottom: "8px", fontWeight: "600" }}>How are you feeling right now?</label>
          <div className="mood-selector" style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "8px",
            marginBottom: "16px"
          }}>
            {Object.entries(moodEmojis).map(([m, emoji]) => (
              <div
                key={m}
                className={`mood-option ${selectedMood === m ? "selected" : ""}`}
                onClick={() => setSelectedMood(m)}
                style={{
                  padding: "12px 8px",
                  borderRadius: "8px",
                  border: `2px solid ${selectedMood === m ? moodColors[m] : "rgba(255,255,255,0.1)"}`,
                  background: selectedMood === m ? `${moodColors[m]}15` : "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                  transform: selectedMood === m ? "scale(1.05)" : "scale(1)"
                }}
              >
                <div style={{ fontSize: "20px", marginBottom: "4px" }}>{emoji}</div>
                <div style={{ fontSize: "12px", fontWeight: "600" }}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <label style={{ marginBottom: "8px", fontWeight: "600" }}>What's on your mind?</label>
          <textarea
            placeholder="Share your thoughts, feelings, or anything you'd like to remember..."
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "var(--text)",
              fontSize: "14px",
              resize: "vertical",
              minHeight: "80px",
              outline: "none",
              transition: "all 0.2s ease"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent)";
              e.target.style.background = "rgba(255,255,255,0.08)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.1)";
              e.target.style.background = "rgba(255,255,255,0.05)";
            }}
          />

          <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
            <button 
              className="btn btn-primary hover-lift" 
              onClick={handleSaveQuick}
              disabled={!quickNote.trim()}
              style={{
                flex: 1,
                opacity: !quickNote.trim() ? 0.5 : 1,
                cursor: !quickNote.trim() ? "not-allowed" : "pointer"
              }}
            >
              💾 Save Entry
            </button>
            <button 
              className="btn btn-ghost" 
              onClick={handleClearQuick}
              style={{ padding: "10px 16px" }}
            >
              🗑️ Clear
            </button>
          </div>

          {/* Character counter */}
          <div style={{ 
            textAlign: "right", 
            fontSize: "11px", 
            color: quickNote.length > 200 ? "#ef4444" : "var(--muted)",
            marginTop: "4px"
          }}>
            {quickNote.length}/200
          </div>
        </div>
      </div>

      {/* Add some CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        
        .pop {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .pop:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
      `}</style>
    </section>
  );
}