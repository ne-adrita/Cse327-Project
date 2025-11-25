import React, { useState, useEffect } from "react";

export default function Progress() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [moodData, setMoodData] = useState([]);
  const [streakData, setStreakData] = useState({ current: 0, longest: 0 });
  const [goals, setGoals] = useState({ monthlyGoal: 20, currentProgress: 0 });
  const [stats, setStats] = useState({
    entries: 0,
    mood: 0,
    positiveDays: 0,
    meditation: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  // Achievement definitions
  const achievementDefinitions = [
    { id: 1, name: "First Step", description: "Log your first entry", icon: "🚀", unlocked: false },
    { id: 2, name: "Week Warrior", description: "Log entries for 7 consecutive days", icon: "🏆", unlocked: false },
    { id: 3, name: "Mood Master", description: "Maintain positive mood for 5+ days", icon: "😊", unlocked: false },
    { id: 4, name: "Meditation Guru", description: "Complete 10 meditation sessions", icon: "🧘", unlocked: false },
    { id: 5, name: "Goal Getter", description: "Reach your monthly goal", icon: "🎯", unlocked: false }
  ];

  // Generate realistic mock data with trends
  const generateMoodData = (days) => {
    const data = [];
    let currentMood = 4 + Math.random() * 2;
    let trend = Math.random() > 0.5 ? 0.1 : -0.1; // Slight upward or downward trend
    
    for (let i = 0; i < days; i++) {
      // Add trend and random variation
      currentMood += trend + (Math.random() - 0.5) * 0.6;
      currentMood = Math.max(1, Math.min(7, currentMood));
      
      // Weekend effect
      const date = new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      if (isWeekend) currentMood += 0.3; // Slightly better mood on weekends
      
      data.push({
        day: i + 1,
        date: date,
        mood: Number(currentMood.toFixed(1)),
        activities: Math.floor(Math.random() * 6),
        meditation: Math.random() > 0.7,
        notes: Math.random() > 0.8,
        isWeekend: isWeekend
      });
    }
    return data;
  };

  const calculateStats = (data) => {
    const entries = data.length;
    const mood = data.reduce((sum, day) => sum + day.mood, 0) / entries;
    const positiveDays = data.filter(day => day.mood >= 5).length;
    const meditation = data.filter(day => day.meditation).length;
    
    return {
      entries,
      mood: Number(mood.toFixed(1)),
      positiveDays: Math.round((positiveDays / entries) * 100),
      meditation
    };
  };

  const calculateStreak = (data) => {
    const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    let expectedDate = new Date(today);
    
    for (let i = 0; i < sortedData.length; i++) {
      const entryDate = new Date(sortedData[i].date);
      expectedDate.setDate(today.getDate() - i);
      
      if (entryDate.toDateString() === expectedDate.toDateString()) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return { current: currentStreak, longest: longestStreak };
  };

  const calculateProgress = (data, monthlyGoal) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyEntries = data.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });
    
    return monthlyEntries.length;
  };

  const getMoodTrend = (currentData, previousData) => {
    if (previousData.length === 0) return 0;
    
    const currentAvg = currentData.reduce((sum, day) => sum + day.mood, 0) / currentData.length;
    const previousAvg = previousData.reduce((sum, day) => sum + day.mood, 0) / previousData.length;
    
    return Number(((currentAvg - previousAvg) / previousAvg * 100).toFixed(1));
  };

  const checkAchievements = (data, stats, streak, progress) => {
    const unlocked = [];
    
    if (stats.entries >= 1) {
      unlocked.push({ ...achievementDefinitions[0], unlocked: true });
    }
    if (streak.current >= 7) {
      unlocked.push({ ...achievementDefinitions[1], unlocked: true });
    }
    if (stats.positiveDays >= 70) {
      unlocked.push({ ...achievementDefinitions[2], unlocked: true });
    }
    if (stats.meditation >= 10) {
      unlocked.push({ ...achievementDefinitions[3], unlocked: true });
    }
    if (progress >= goals.monthlyGoal) {
      unlocked.push({ ...achievementDefinitions[4], unlocked: true });
    }
    
    return unlocked;
  };

  const [moodTrend, setMoodTrend] = useState(0);

  // Initialize and update data when period changes
  useEffect(() => {
    const days = selectedPeriod === "week" ? 7 : 30;
    const previousDays = selectedPeriod === "week" ? 7 : 30;
    
    const currentPeriodData = generateMoodData(days);
    const previousPeriodData = generateMoodData(previousDays);
    
    setMoodData(currentPeriodData);
    const newStats = calculateStats(currentPeriodData);
    setStats(newStats);
    const newStreakData = calculateStreak(currentPeriodData);
    setStreakData(newStreakData);
    
    const progress = calculateProgress(currentPeriodData, goals.monthlyGoal);
    setGoals(prev => ({ ...prev, currentProgress: progress }));
    
    setMoodTrend(getMoodTrend(currentPeriodData, previousPeriodData));
    
    // Check for new achievements
    const newAchievements = checkAchievements(currentPeriodData, newStats, newStreakData, progress);
    setAchievements(newAchievements);
    
    // Generate recent activity log
    const activityLog = currentPeriodData.slice(0, 5).map(day => ({
      date: day.date,
      mood: day.mood,
      meditation: day.meditation,
      activities: day.activities,
      type: day.meditation ? "meditation" : "mood_check"
    }));
    setRecentActivity(activityLog);
  }, [selectedPeriod]);

  const handleAddEntry = () => {
    const newEntry = {
      day: moodData.length + 1,
      date: new Date(),
      mood: Number((4 + Math.random() * 2).toFixed(1)),
      activities: Math.floor(Math.random() * 6),
      meditation: Math.random() > 0.7,
      notes: false,
      isWeekend: new Date().getDay() === 0 || new Date().getDay() === 6
    };
    
    const newMoodData = [newEntry, ...moodData.slice(0, -1)];
    setMoodData(newMoodData);
    const newStats = calculateStats(newMoodData);
    setStats(newStats);
    const newStreakData = calculateStreak(newMoodData);
    setStreakData(newStreakData);
    
    const progress = calculateProgress(newMoodData, goals.monthlyGoal);
    setGoals(prev => ({ ...prev, currentProgress: progress }));
    
    // Check for achievements
    const newAchievements = checkAchievements(newMoodData, newStats, newStreakData, progress);
    if (newAchievements.length > achievements.length) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    setAchievements(newAchievements);
    
    // Add to recent activity
    setRecentActivity(prev => [{
      date: new Date(),
      mood: newEntry.mood,
      meditation: newEntry.meditation,
      activities: newEntry.activities,
      type: newEntry.meditation ? "meditation" : "mood_check"
    }, ...prev.slice(0, 4)]);
    
    // Success animation
    const successMessages = [
      "Great job tracking your mood! 🌟",
      "Another step in your wellness journey! 💫",
      "Consistency is key! Keep it up! 🔑",
      "Your future self will thank you! 🙏"
    ];
    const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
    alert(`✅ ${randomMessage}\nMood: ${newEntry.mood}/7, Activities: ${newEntry.activities}`);
  };

  const handleSetGoal = () => {
    const newGoal = prompt("Set your monthly goal (number of entries):", goals.monthlyGoal);
    if (newGoal && !isNaN(newGoal)) {
      const goalNum = parseInt(newGoal);
      if (goalNum > 0 && goalNum <= 100) {
        setGoals(prev => ({ ...prev, monthlyGoal: goalNum }));
      } else {
        alert("Please enter a number between 1 and 100");
      }
    }
  };

  const handleShareProgress = () => {
    const periodText = selectedPeriod === "week" ? "week" : "month";
    const moodEmoji = getMoodEmoji(stats.mood);
    const message = `I've logged ${stats.entries} entries this ${periodText} with an average mood of ${stats.mood}/7 ${moodEmoji}! 🎉\n\n#WellnessJourney #MoodTracking`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Wellness Progress',
        text: message
      });
    } else {
      navigator.clipboard.writeText(message);
      alert('Progress copied to clipboard! 📋\n\n' + message);
    }
  };

  const getMoodColor = (moodScore) => {
    if (moodScore >= 6) return "#10b981";
    if (moodScore >= 5) return "#f59e0b";
    if (moodScore >= 4) return "#8b5cf6";
    return "#ef4444";
  };

  const getProgressPercentage = () => {
    return Math.min((goals.currentProgress / goals.monthlyGoal) * 100, 100);
  };

  const getMoodEmoji = (moodScore) => {
    if (moodScore >= 6) return "😊";
    if (moodScore >= 5) return "🙂";
    if (moodScore >= 4) return "😐";
    if (moodScore >= 3) return "😕";
    return "😢";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTrendIcon = (trend) => {
    if (trend > 5) return "📈";
    if (trend > 0) return "↗️";
    if (trend < -5) return "📉";
    if (trend < 0) return "↘️";
    return "➡️";
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'meditation': return '🧘';
      case 'mood_check': return '😊';
      default: return '📝';
    }
  };

  return (
    <section className="module" data-module="progress">
      {showCelebration && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '-10px',
                left: `${Math.random() * 100}%`,
                fontSize: '24px',
                animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.8
              }}
            >
              {['🎉', '✨', '🌟', '🏆', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="module-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ margin: 0 }}>Progress & Achievements</h2>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>Track your wellness journey with style</div>
          </div>
          
          <div style={{ display: "flex", gap: "0.5rem", background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px' }}>
            {["week", "month"].map(period => (
              <button 
                key={period}
                onClick={() => setSelectedPeriod(period)}
                style={{
                  padding: "0.5rem 1rem",
                  border: "none",
                  background: selectedPeriod === period 
                    ? 'linear-gradient(135deg, rgba(139,211,199,0.2), rgba(139,211,199,0.1))' 
                    : 'transparent',
                  color: selectedPeriod === period ? 'var(--accent)' : 'var(--text)',
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: selectedPeriod === period ? '600' : '400',
                  transition: 'all 0.3s ease'
                }}
              >
                {period === "week" ? "📅 Week" : "📊 Month"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: 'wrap' }}>
        <button 
          onClick={handleAddEntry}
          style={{
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: '600',
            flex: 1,
            minWidth: '140px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.25)'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          ✨ Add Today's Entry
        </button>
        <button 
          onClick={handleShareProgress}
          style={{
            padding: "0.75rem 1.5rem",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            color: 'var(--text)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          📤 Share Progress
        </button>
      </div>

      {/* Stats Overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,211,199,0.05), rgba(139,211,199,0.02))' }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            📈 {selectedPeriod === "week" ? "Weekly" : "Monthly"} Overview
          </h3>
          <div className="small" style={{ 
            color: "var(--muted)",
            background: 'rgba(255,255,255,0.05)',
            padding: '4px 8px',
            borderRadius: '6px'
          }}>
            {selectedPeriod === "week" ? "Last 7 days" : "Last 30 days"}
          </div>
        </div>
        
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {[
            { 
              label: "Entries", 
              value: stats.entries, 
              subtitle: selectedPeriod === 'week' ? '7 days' : '30 days',
              icon: '📝',
              color: '#8b5cf6'
            },
            { 
              label: "Avg. Mood", 
              value: stats.mood, 
              subtitle: getMoodEmoji(stats.mood) + ' /7',
              icon: '😊',
              color: getMoodColor(stats.mood)
            },
            { 
              label: "Positive Days", 
              value: `${stats.positiveDays}%`, 
              subtitle: 'Mood ≥ 5/7',
              icon: '🌟',
              color: stats.positiveDays >= 70 ? "#10b981" : "#f59e0b"
            },
            { 
              label: "Meditation", 
              value: stats.meditation, 
              subtitle: 'Sessions',
              icon: '🧘',
              color: '#3b82f6'
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className="stat-card"
              style={{ 
                cursor: "pointer",
                padding: '1.25rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              onClick={() => alert(`${stat.label}: ${stat.value} ${stat.subtitle}`)}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div className="stat-value" style={{ 
                fontSize: '1.75rem', 
                fontWeight: '700',
                color: stat.color,
                marginBottom: '0.25rem'
              }}>
                {stat.value}
              </div>
              <div className="stat-label" style={{ 
                fontSize: '14px', 
                fontWeight: '600',
                marginBottom: '0.25rem'
              }}>
                {stat.label}
              </div>
              <div className="small" style={{ color: "var(--muted)" }}>
                {stat.subtitle}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 18 }} />

      <div className="grid cols-2" style={{ gap: "1.5rem" }}>
        {/* Streak & Goals */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔥 Consistency & Goals
            </h3>
            <button 
              onClick={() => alert(`Your longest streak is ${streakData.longest} days! 🏆`)}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                cursor: "pointer",
                fontSize: "12px",
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(139,211,199,0.1)'
              }}
            >
              View History
            </button>
          </div>
          
          {/* Streak Display */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16, 
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'rgba(139,211,199,0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(139,211,199,0.1)'
          }}>
            <div style={{ 
              fontSize: 48, 
              fontWeight: 700, 
              color: streakData.current > 0 ? "#10b981" : "var(--muted)",
              textShadow: streakData.current > 0 ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none'
            }}>
              {streakData.current}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>Day Streak</div>
              <div className="small" style={{ lineHeight: '1.4' }}>
                {streakData.current > 0 
                  ? `🔥 You're on fire! ${streakData.current} days in a row`
                  : "Start logging to build your streak!"
                }
              </div>
            </div>
          </div>
          
          {/* Goal Progress */}
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', marginBottom: "0.75rem" }}>
              <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                🎯 Monthly Goal
              </span>
              <span style={{ fontWeight: 600, color: 'var(--accent)' }}>
                {goals.currentProgress}/{goals.monthlyGoal}
              </span>
            </div>
            <div 
              className="progress-bar" 
              style={{ 
                marginTop: 0,
                cursor: "pointer",
                height: '12px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '20px',
                overflow: 'hidden'
              }}
              onClick={handleSetGoal}
            >
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${getProgressPercentage()}%`,
                  height: '100%',
                  background: getProgressPercentage() >= 100 
                    ? "linear-gradient(135deg, #10b981, #34d399)"
                    : "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                  borderRadius: '20px',
                  transition: 'width 0.5s ease',
                  boxShadow: getProgressPercentage() >= 100 ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none'
                }} 
              />
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '8px'
            }}>
              <span className="small" style={{ color: 'var(--muted)' }}>
                {Math.round(getProgressPercentage())}% complete
              </span>
              <button 
                onClick={handleSetGoal}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent)",
                  cursor: "pointer",
                  fontSize: "12px",
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(139,211,199,0.1)'
                }}
              >
                Adjust goal
              </button>
            </div>
          </div>
        </div>

        {/* Mood Trend & Achievements */}
        <div className="card">
          <h3 style={{ marginBottom: "1.5rem", display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 Trends & Achievements
          </h3>
          
          {/* Mood Trend */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 16, 
            marginBottom: "1.5rem",
            padding: '1rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px'
          }}>
            <div style={{ 
              fontSize: 32, 
              fontWeight: 700, 
              color: moodTrend > 0 ? "#10b981" : moodTrend < 0 ? "#ef4444" : "var(--muted)" 
            }}>
              {getTrendIcon(moodTrend)} {moodTrend > 0 ? '+' : ''}{moodTrend}%
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                {moodTrend > 0 ? 'Trending Up' : moodTrend < 0 ? 'Trending Down' : 'Stable'}
              </div>
              <div className="small" style={{ lineHeight: '1.4' }}>
                {moodTrend > 0 
                  ? 'Your average mood is improving!' 
                  : moodTrend < 0 
                    ? 'Your average mood needs attention'
                    : 'Your mood is holding steady'
                }
              </div>
            </div>
          </div>
          
          {/* Mini Mood Chart */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="small" style={{ fontWeight: '600' }}>Mood Timeline</span>
              <span className="small" style={{ color: "var(--muted)" }}>Click bars for details</span>
            </div>
            <div style={{ display: "flex", height: 60, alignItems: "end", gap: 4 }}>
              {moodData.map((day, index) => (
                <div
                  key={day.day}
                  style={{
                    flex: 1,
                    background: getMoodColor(day.mood),
                    height: `${(day.mood / 7) * 100}%`,
                    borderRadius: '4px 4px 0 0',
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    opacity: 0.8,
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "scaleY(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0.8";
                    e.currentTarget.style.transform = "scaleY(1)";
                  }}
                  onClick={() => alert(
                    `📅 ${formatDate(day.date)}\n😊 Mood: ${day.mood}/7 ${getMoodEmoji(day.mood)}\n🎯 Activities: ${day.activities}\n🧘 Meditation: ${day.meditation ? 'Yes' : 'No'}\n📝 Notes: ${day.notes ? 'Yes' : 'No'}`
                  )}
                >
                  {day.meditation && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '10px'
                    }}>
                      🧘
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Preview */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="small" style={{ fontWeight: '600' }}>Recent Achievements</span>
              <span className="small" style={{ color: "var(--muted)" }}>
                {achievements.length}/{achievementDefinitions.length}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {achievements.slice(0, 3).map(achievement => (
                <div
                  key={achievement.id}
                  style={{
                    padding: '6px 10px',
                    background: 'rgba(139,211,199,0.1)',
                    borderRadius: '20px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid rgba(139,211,199,0.2)'
                  }}
                  title={achievement.description}
                >
                  <span>{achievement.icon}</span>
                  <span>{achievement.name}</span>
                </div>
              ))}
              {achievements.length === 0 && (
                <div className="small" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
                  Complete activities to unlock achievements!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Achievements */}
      <div style={{ height: 18 }} />
      
      <div className="grid cols-2" style={{ gap: "1.5rem" }}>
        {/* Recent Activity */}
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            📝 Recent Activity
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentActivity.map((activity, index) => (
              <div 
                key={index} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "12px",
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ fontSize: '1.25rem' }}>
                  {getActivityIcon(activity.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {activity.type === 'meditation' ? 'Meditation Session' : 'Mood Check'}
                  </div>
                  <div className="small" style={{ color: 'var(--muted)' }}>
                    {formatDate(activity.date)}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: getMoodColor(activity.mood)
                }}>
                  {activity.mood}/7
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Achievements */}
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            🏆 Your Achievements
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {achievementDefinitions.map(achievement => (
              <div 
                key={achievement.id}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "12px",
                  padding: '0.75rem',
                  background: achievement.unlocked 
                    ? 'rgba(139,211,199,0.1)' 
                    : 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  border: `1px solid ${achievement.unlocked ? 'rgba(139,211,199,0.2)' : 'rgba(255,255,255,0.05)'}`,
                  opacity: achievement.unlocked ? 1 : 0.6
                }}
              >
                <div style={{ fontSize: '1.5rem' }}>
                  {achievement.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '500',
                    color: achievement.unlocked ? 'var(--accent)' : 'var(--text)'
                  }}>
                    {achievement.name}
                  </div>
                  <div className="small" style={{ color: 'var(--muted)' }}>
                    {achievement.description}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '12px',
                  color: achievement.unlocked ? '#10b981' : 'var(--muted)'
                }}>
                  {achievement.unlocked ? '✅ Unlocked' : '🔒 Locked'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </section>
  );
}