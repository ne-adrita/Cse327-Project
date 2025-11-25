import React, { useState, useEffect } from "react";

export default function Insights() {
  const [entries, setEntries] = useState([]);
  const [aiInsight, setAiInsight] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week"); // week, month, all
  const [insightHistory, setInsightHistory] = useState([]);

  const API_KEY = "hf_vXMzE6Nvw0XPenzT06CP8kcFAL3AIxmjcc";

  useEffect(() => {
    // Load entries for analysis
    const arr = JSON.parse(localStorage.getItem("pc_demo_entries_v1") || "[]");
    setEntries(arr);
    
    // Load insight history
    const history = JSON.parse(localStorage.getItem("pc_insight_history") || "[]");
    setInsightHistory(history);
    
    // Generate AI insights if we have entries
    if (arr.length > 0) {
      generateAIInsights(arr);
    }
  }, []);

  // Filter entries based on selected timeframe
  const getFilteredEntries = () => {
    const now = new Date();
    const filtered = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const diffTime = Math.abs(now - entryDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (selectedTimeframe) {
        case "week":
          return diffDays <= 7;
        case "month":
          return diffDays <= 30;
        default:
          return true;
      }
    });
    return filtered;
  };

  async function generateAIInsights(entries) {
    const filteredEntries = getFilteredEntries();
    
    if (filteredEntries.length === 0) {
      setAiInsight("Start adding journal entries to get personalized insights about your emotional patterns.");
      return;
    }

    setIsGenerating(true);

    try {
      // Enhanced mood analysis
      const moodCount = {};
      const timePatterns = {};
      const commonTriggers = [];
      const positiveMoments = [];
      
      filteredEntries.forEach(entry => {
        // Mood counting
        moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
        
        // Time pattern analysis
        const hour = new Date(entry.date).getHours();
        const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
        if (!timePatterns[timeOfDay]) timePatterns[timeOfDay] = {};
        timePatterns[timeOfDay][entry.mood] = (timePatterns[timeOfDay][entry.mood] || 0) + 1;
        
        // Trigger detection
        const note = (entry.note || "").toLowerCase();
        if (note.includes("sleep") || note.includes("tired")) commonTriggers.push("sleep");
        if (note.includes("baby") || note.includes("feed")) commonTriggers.push("baby care");
        if (note.includes("support") || note.includes("partner") || note.includes("family")) commonTriggers.push("support system");
        if (note.includes("self care") || note.includes("rest") || note.includes("break")) commonTriggers.push("self care");
        
        // Positive moment detection
        if (entry.mood === "happy" || entry.mood === "calm") {
          positiveMoments.push(entry.note || entry.title);
        }
      });

      const recentEntries = filteredEntries.slice(0, 15);
      const entriesText = recentEntries.map(entry => 
        `[${entry.mood}] ${entry.note || entry.title}`
      ).join(". ");

      const prompt = `As a compassionate postpartum support specialist, analyze these mood journal entries and provide warm, personalized insights.
      
      Entries: ${entriesText}
      
      Mood distribution: ${JSON.stringify(moodCount)}
      Time patterns: ${JSON.stringify(timePatterns)}
      Common themes: ${[...new Set(commonTriggers)].slice(0, 3).join(", ")}
      Positive moments: ${positiveMoments.slice(0, 3).join(", ")}
      
      Please provide a supportive analysis that:
      1. Identifies emotional patterns and trends
      2. Highlights strengths and positive developments
      3. Notes any time-of-day patterns in mood
      4. Offers 1-2 gentle, practical suggestions
      5. Validates the normalcy of postpartum emotions
      6. Ends with an encouraging affirmation
      
      Keep it warm, personal, and focused on empowerment.`;

      const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 300,
              temperature: 0.8,
              repetition_penalty: 1.1,
              do_sample: true,
              return_full_text: false
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      let insight = "I'm analyzing your patterns to provide personalized insights...";

      if (Array.isArray(data) && data[0] && data[0].generated_text) {
        insight = data[0].generated_text.trim();
      } else if (typeof data === 'string') {
        insight = data.trim();
      } else if (data.generated_text) {
        insight = data.generated_text.trim();
      }

      // Clean up the insight
      insight = insight.replace(/Analysis:|Response:|Output:/g, '').trim();
      
      if (!insight || insight.length < 50) {
        insight = getFallbackInsight(filteredEntries, moodCount, timePatterns);
      }

      setAiInsight(insight);
      
      // Save to history
      const newInsight = {
        text: insight,
        date: new Date().toISOString(),
        entryCount: filteredEntries.length,
        timeframe: selectedTimeframe
      };
      
      const updatedHistory = [newInsight, ...insightHistory.slice(0, 4)]; // Keep last 5 insights
      setInsightHistory(updatedHistory);
      localStorage.setItem("pc_insight_history", JSON.stringify(updatedHistory));

    } catch (error) {
      console.error("AI Insights error:", error);
      const filteredEntries = getFilteredEntries();
      setAiInsight(getFallbackInsight(filteredEntries, {}, {}));
    } finally {
      setIsGenerating(false);
    }
  }

  function getFallbackInsight(entries, moodCount, timePatterns) {
    if (entries.length === 0) {
      return "Your insights will appear here as you add journal entries. Tracking your moods helps identify patterns and celebrate progress.";
    }

    const totalEntries = entries.length;
    const happyPct = Math.round(((moodCount.happy || 0) / totalEntries) * 100);
    const calmPct = Math.round(((moodCount.calm || 0) / totalEntries) * 100);
    const challengingPct = Math.round(((moodCount.anxious || 0) + (moodCount.sad || 0) + (moodCount.tired || 0)) / totalEntries * 100);

    let insight = `Based on your ${totalEntries} entries from the past ${selectedTimeframe}, `;

    // Mood patterns
    if (happyPct + calmPct > 60) {
      insight += `you're experiencing many positive moments (${happyPct + calmPct}% happy/calm entries). This resilience is inspiring! `;
    } else if (challengingPct > 50) {
      insight += `you're navigating some challenging days (${challengingPct}% tired/anxious/sad entries). Remember that these feelings are normal and temporary. `;
    } else {
      insight += `you're showing a balanced mix of emotions, which is very common in postpartum adjustment. `;
    }

    // Time patterns
    if (timePatterns.morning) {
      const morningMoods = Object.keys(timePatterns.morning);
      if (morningMoods.includes('tired') || morningMoods.includes('anxious')) {
        insight += `Mornings seem to be a more challenging time - consider gentle morning routines. `;
      }
    }

    if (timePatterns.evening && timePatterns.evening.calm) {
      insight += `Evenings appear to be a peaceful time for you - that's wonderful to notice. `;
    }

    insight += "Each entry helps you understand yourself better during this transition. You're doing important work by paying attention to your feelings.";

    return insight;
  }

  function refreshInsights() {
    generateAIInsights(entries);
  }

  // Calculate enhanced mood statistics
  const filteredEntries = getFilteredEntries();
  const moodStats = filteredEntries.reduce((acc, entry) => {
    acc.total = (acc.total || 0) + 1;
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const moodPercentages = {};
  if (moodStats.total > 0) {
    ['happy', 'calm', 'tired', 'anxious', 'sad', 'angry'].forEach(mood => {
      moodPercentages[mood] = Math.round(((moodStats[mood] || 0) / moodStats.total) * 100);
    });
  }

  // Calculate weekly trends with real data
  const getWeeklyTrendData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const weekData = days.map((day, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEntries = filteredEntries.filter(entry => 
        entry.date.startsWith(dateStr)
      );
      
      // Calculate average mood score for the day
      if (dayEntries.length === 0) return { day, count: 0, moodScore: 0 };
      
      const moodScores = dayEntries.map(entry => {
        const scores = { happy: 5, calm: 4, tired: 3, anxious: 2, sad: 1, angry: 1 };
        return scores[entry.mood] || 3;
      });
      
      const avgScore = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;
      return { day, count: dayEntries.length, moodScore: avgScore };
    });
    
    return weekData;
  };

  const weeklyData = getWeeklyTrendData();
  const maxMoodScore = Math.max(...weeklyData.map(d => d.moodScore), 1);

  return (
    <section className="module" data-module="insights">
      <div className="module-header">
        <h2 style={{ margin: 0 }}>AI Insights</h2>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>
          Understand your emotional patterns with AI analysis
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0 }}>Analysis Period</h4>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              {filteredEntries.length} entries in selected period
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["week", "month", "all"].map(timeframe => (
              <button
                key={timeframe}
                className={`btn ${selectedTimeframe === timeframe ? "btn-primary" : "btn-ghost"}`}
                onClick={() => {
                  setSelectedTimeframe(timeframe);
                  setTimeout(() => generateAIInsights(entries), 100);
                }}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
            <button 
              className="btn btn-ghost" 
              onClick={refreshInsights}
              disabled={isGenerating}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              {isGenerating ? "🔄" : "↻"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid cols-2">
        {/* Enhanced Mood Distribution */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Mood Distribution</h3>
            <div className="small" style={{ color: "var(--muted)" }}>
              {selectedTimeframe}
            </div>
          </div>
          
          {moodStats.total > 0 ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: 140, 
                height: 140, 
                borderRadius: "50%", 
                background: `conic-gradient(
                  #10b981 0% ${moodPercentages.happy}%,
                  #3b82f6 ${moodPercentages.happy}% ${moodPercentages.happy + moodPercentages.calm}%,
                  #f59e0b ${moodPercentages.happy + moodPercentages.calm}% ${moodPercentages.happy + moodPercentages.calm + moodPercentages.tired}%,
                  #f59e0b ${moodPercentages.happy + moodPercentages.calm + moodPercentages.tired}% ${moodPercentages.happy + moodPercentages.calm + moodPercentages.tired + moodPercentages.anxious}%,
                  #ef4444 ${moodPercentages.happy + moodPercentages.calm + moodPercentages.tired + moodPercentages.anxious}% ${moodPercentages.happy + moodPercentages.calm + moodPercentages.tired + moodPercentages.anxious + moodPercentages.sad}%,
                  #dc2626 ${moodPercentages.happy + moodPercentages.calm + moodPercentages.tired + moodPercentages.anxious + moodPercentages.sad}% 100%
                )`,
                margin: '0 auto 16px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'var(--card-bg)',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Total</div>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--accent)' }}>
                    {moodStats.total}
                  </div>
                </div>
              </div>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {Object.entries(moodPercentages)
                  .filter(([_, percentage]) => percentage > 0)
                  .map(([mood, percentage]) => (
                    <MoodLegend 
                      key={mood}
                      color={
                        mood === 'happy' ? '#10b981' :
                        mood === 'calm' ? '#3b82f6' :
                        mood === 'tired' ? '#f59e0b' :
                        mood === 'anxious' ? '#f59e0b' :
                        mood === 'sad' ? '#ef4444' : '#dc2626'
                      } 
                      label={`${mood.charAt(0).toUpperCase() + mood.slice(1)} (${percentage}%)`} 
                    />
                  ))
                }
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px' }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>📊</div>
              No entries in this period
            </div>
          )}
        </div>

        {/* Enhanced Weekly Trends */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Weekly Trends</h3>
            <div className="small" style={{ color: "var(--muted)" }}>
              Mood intensity
            </div>
          </div>
          
          {weeklyData.some(day => day.count > 0) ? (
            <div>
              <div style={{ display: "flex", height: 120, alignItems: "end", gap: 8, padding: '0 8px', marginBottom: 16 }}>
                {weeklyData.map((day, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                      flex: 1, 
                      background: day.moodScore > 3 ? '#10b981' : day.moodScore > 2 ? '#f59e0b' : '#ef4444',
                      height: `${(day.moodScore / maxMoodScore) * 80}%`, 
                      width: '70%',
                      borderRadius: 4,
                      opacity: day.count > 0 ? 0.8 : 0.3,
                      minHeight: 4,
                      transition: 'all 0.3s ease'
                    }} />
                    <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>
                      {day.day}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--muted)" }}>
                      {day.count > 0 ? `${day.count}📝` : ''}
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: 8,
                background: 'rgba(139,211,199,0.05)',
                padding: 12,
                borderRadius: 8
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Best Day</div>
                  <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                    {weeklyData.reduce((best, day) => day.moodScore > best.moodScore ? day : best).day}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Entries</div>
                  <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                    {weeklyData.filter(day => day.count > 0).length}/7
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Avg Mood</div>
                  <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                    {(weeklyData.reduce((sum, day) => sum + day.moodScore, 0) / 7).toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px' }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>📈</div>
              Track your mood to see trends
            </div>
          )}
        </div>
      </div>

      <div style={{ height: 18 }} />
      
      {/* Enhanced AI Insight */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>AI Insight Summary</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="small" style={{ color: "var(--muted)" }}>
              {filteredEntries.length} entries • {selectedTimeframe}
            </div>
            {insightHistory.length > 0 && (
              <select 
                className="btn btn-ghost"
                style={{ fontSize: '12px', padding: '4px 8px' }}
                onChange={(e) => {
                  if (e.target.value === 'current') return;
                  setAiInsight(insightHistory[e.target.value].text);
                }}
              >
                <option value="current">Latest</option>
                {insightHistory.map((insight, index) => (
                  <option key={index} value={index}>
                    {new Date(insight.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        <div style={{ 
          background: "rgba(139,211,199,0.05)", 
          padding: "20px", 
          borderRadius: 12,
          border: "1px solid rgba(139,211,199,0.1)",
          position: 'relative'
        }}>
          {isGenerating ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--muted)' }}>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              Analyzing your patterns with AI...
            </div>
          ) : (
            <>
              <div style={{ 
                position: 'absolute',
                top: 12,
                left: 12,
                fontSize: 20
              }}>
                💭
              </div>
              <div style={{ paddingLeft: 28 }}>
                <div style={{ fontWeight: 600, marginBottom: 12, color: "var(--accent)" }}>
                  Personalized Analysis
                </div>
                <div style={{ lineHeight: 1.6, fontSize: '14px' }}>
                  {aiInsight || "Add journal entries to get AI-powered insights about your emotional patterns."}
                </div>
              </div>
            </>
          )}
        </div>
        
        {filteredEntries.length > 0 && !isGenerating && (
          <div style={{ 
            marginTop: 12, 
            fontSize: 12, 
            color: "var(--muted)", 
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8
          }}>
            <span>💡 Insights update automatically</span>
            <button 
              className="btn btn-ghost" 
              onClick={refreshInsights}
              style={{ padding: '2px 6px', fontSize: '10px' }}
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .typing-indicator {
          display: flex;
          gap: 3px;
        }
        .typing-indicator span {
          height: 6px;
          width: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) { animation-delay: 0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </section>
  );
}

// Enhanced Mood Legend component
function MoodLegend({ color, label }) {
  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: 6,
      padding: '6px 10px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 6,
      border: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ 
        width: 10, 
        height: 10, 
        background: color, 
        borderRadius: 2,
        boxShadow: `0 0 4px ${color}40`
      }}></div>
      <span className="small" style={{ fontSize: 11, fontWeight: 500 }}>{label}</span>
    </div>
  );
}