import React, { useEffect, useState } from "react";
import { getMoodEmoji } from "../utils/helpers";

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [entries, setEntries] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState("calendar"); // calendar, stats, heatmap
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const arr = JSON.parse(localStorage.getItem("pc_demo_entries_v1") || "[]");
    setEntries(arr);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const moodColors = {
    happy: "#10b981",
    calm: "#3b82f6", 
    tired: "#f59e0b",
    anxious: "#f59e0b",
    sad: "#ef4444",
    angry: "#dc2626"
  };

  const isToday = (y, m, d) => {
    const t = new Date();
    return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
  };

  const buildCalendar = () => {
    const first = new Date(currentYear, currentMonth, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < startDay; i++) cells.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEntries = entries.filter(e => e.date && e.date.startsWith(dateStr));
      
      // Calculate dominant mood for the day
      const moodCounts = {};
      dayEntries.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      });
      const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
        moodCounts[a] > moodCounts[b] ? a : b, 'neutral'
      );

      cells.push({
        day,
        date: dateStr,
        entries: dayEntries,
        isToday: isToday(currentYear, currentMonth, day),
        dominantMood,
        moodCount: dayEntries.length
      });
    }

    return cells;
  };

  const prevMonth = () => {
    setAnimationKey(prev => prev + 1);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    setAnimationKey(prev => prev + 1);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const goToToday = () => {
    setAnimationKey(prev => prev + 1);
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDay(null);
  };

  const handleDayClick = (cell) => {
    if (!cell) return;
    
    setSelectedDay(cell);
    
    // Add click animation
    const element = document.getElementById(`day-${cell.day}`);
    if (element) {
      element.style.transform = "scale(0.95)";
      setTimeout(() => {
        element.style.transform = "scale(1)";
      }, 150);
    }
  };

  const getMoodIntensity = (cell) => {
    if (!cell || cell.entries.length === 0) return 0;
    return Math.min(cell.entries.length / 3, 1); // Scale intensity based on entry count
  };

  const getDayBackground = (cell) => {
    if (!cell || cell.entries.length === 0) return "rgba(255,255,255,0.02)";
    
    const intensity = getMoodIntensity(cell);
    const color = moodColors[cell.dominantMood] || "#6b7280";
    
    return `linear-gradient(135deg, ${color}${Math.floor(intensity * 30)}, rgba(255,255,255,0.05))`;
  };

  const getMonthStats = () => {
    const monthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });

    const moodStats = {};
    monthEntries.forEach(entry => {
      moodStats[entry.mood] = (moodStats[entry.mood] || 0) + 1;
    });

    const totalEntries = monthEntries.length;
    const mostCommonMood = Object.keys(moodStats).reduce((a, b) => 
      moodStats[a] > moodStats[b] ? a : b, 'none'
    );

    return {
      totalEntries,
      mostCommonMood,
      moodStats,
      trackedDays: new Set(monthEntries.map(e => e.date.split('T')[0])).size
    };
  };

  const calendarCells = buildCalendar();
  const monthStats = getMonthStats();

  const renderCalendarView = () => (
    <div key={animationKey} className="calendar-animation">
      {/* Calendar grid - SMALLER CELLS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 4 // Reduced gap
      }}>
        {calendarCells.map((cell, i) => (
          <div
            id={cell ? `day-${cell.day}` : `empty-${i}`}
            key={i}
            onClick={() => handleDayClick(cell)}
            style={{
              aspectRatio: "1",
              borderRadius: 8, // Slightly smaller radius
              padding: 2, // Reduced padding
              cursor: cell ? "pointer" : "default",
              background: getDayBackground(cell),
              border: cell?.isToday 
                ? "2px solid var(--accent)" 
                : selectedDay?.date === cell?.date 
                ? "2px solid #8b5cf6"
                : "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              transition: "all 0.3s ease",
              transform: "scale(1)"
            }}
            onMouseEnter={(e) => {
              if (cell) {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }
            }}
            onMouseLeave={(e) => {
              if (cell) {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            {cell && (
              <>
                <span style={{ 
                  fontSize: 12, // Smaller font
                  fontWeight: 600,
                  color: cell.isToday ? "white" : "var(--text)",
                  marginBottom: 2 // Reduced margin
                }}>
                  {cell.day}
                </span>
                
                {/* Mood indicators */}
                {cell.entries.length > 0 && (
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center",
                    gap: 1 // Reduced gap
                  }}>
                    <div style={{ 
                      fontSize: cell.entries.length > 2 ? 14 : 12, // Smaller emoji
                      filter: `saturate(${getMoodIntensity(cell) * 100}%)`
                    }}>
                      {getMoodEmoji(cell.dominantMood)}
                    </div>
                    
                    {cell.entries.length > 1 && (
                      <div style={{
                        fontSize: 8, // Smaller font
                        background: "rgba(0,0,0,0.3)",
                        color: "white",
                        borderRadius: 6,
                        padding: "1px 3px",
                        minWidth: 14,
                        textAlign: "center"
                      }}>
                        {cell.entries.length}
                      </div>
                    )}
                  </div>
                )}

                {/* Today indicator */}
                {cell.isToday && (
                  <div style={{
                    position: "absolute",
                    top: 1,
                    right: 1,
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    animation: "pulse 2s infinite"
                  }} />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStatsView = () => {
    const stats = monthStats;
    
    return (
      <div style={{ padding: "20px 0" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
          marginBottom: 24
        }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(139, 211, 199, 0.1), rgba(139, 211, 199, 0.05))",
            padding: 16,
            borderRadius: 12,
            textAlign: "center"
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)" }}>
              {stats.totalEntries}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Total Entries</div>
          </div>
          
          <div style={{
            background: "linear-gradient(135deg, rgba(139, 211, 199, 0.1), rgba(139, 211, 199, 0.05))",
            padding: 16,
            borderRadius: 12,
            textAlign: "center"
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)" }}>
              {stats.trackedDays}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Days Tracked</div>
          </div>
        </div>

        <h4 style={{ marginBottom: 16 }}>Mood Distribution</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Object.entries(stats.moodStats).map(([mood, count]) => (
            <div key={mood} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: 8, 
                background: moodColors[mood] || "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16
              }}>
                {getMoodEmoji(mood)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: 14, 
                  fontWeight: 600,
                  textTransform: "capitalize",
                  marginBottom: 4
                }}>
                  {mood}
                </div>
                <div style={{
                  height: 6,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 3,
                  overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    background: moodColors[mood] || "#6b7280",
                    width: `${(count / stats.totalEntries) * 100}%`,
                    transition: "width 1s ease",
                    borderRadius: 3
                  }} />
                </div>
              </div>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 600,
                color: "var(--accent)",
                minWidth: 40,
                textAlign: "right"
              }}>
                {count}
              </div>
            </div>
          ))}
        </div>

        {stats.totalEntries === 0 && (
          <div style={{ 
            textAlign: "center", 
            padding: "40px 20px",
            color: "var(--muted)"
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <div>No entries this month</div>
            <div style={{ fontSize: 12 }}>Start tracking to see your mood statistics</div>
          </div>
        )}
      </div>
    );
  };

  const renderHeatmapView = () => (
    <div style={{ padding: "20px 0" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 4
      }}>
        {calendarCells.map((cell, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1",
              borderRadius: 4,
              background: cell && cell.entries.length > 0 
                ? moodColors[cell.dominantMood] || "#6b7280"
                : "rgba(255,255,255,0.05)",
              opacity: cell ? Math.max(0.3, getMoodIntensity(cell)) : 0.1,
              border: cell?.isToday ? "2px solid var(--accent)" : "none",
              cursor: cell ? "pointer" : "default",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (cell) e.target.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              if (cell) e.target.style.transform = "scale(1)";
            }}
            onClick={() => handleDayClick(cell)}
          />
        ))}
      </div>
      
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginTop: 16,
        padding: "12px",
        background: "rgba(255,255,255,0.02)",
        borderRadius: 8
      }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Less</div>
        <div style={{ display: "flex", gap: 4 }}>
          {[0.3, 0.5, 0.7, 1].map(opacity => (
            <div
              key={opacity}
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: "var(--accent)",
                opacity
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>More</div>
      </div>
    </div>
  );

  return (
    <section className="module">
      <div className="module-header">
        <h2>Emotion Calendar</h2>
        <div className="module-subtitle">Visualize your mood journey through time</div>
      </div>

      <div className="card">
        {/* Enhanced Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn btn-ghost hover-lift" onClick={prevMonth}>
              ←
            </button>
            <h3 style={{ margin: 0, fontSize: 20 }}>
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <button className="btn btn-ghost hover-lift" onClick={nextMonth}>
              →
            </button>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button 
              className={`btn ${viewMode === "calendar" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setViewMode("calendar")}
            >
              📅 Calendar
            </button>
            <button 
              className={`btn ${viewMode === "stats" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setViewMode("stats")}
            >
              📊 Stats
            </button>
            <button 
              className={`btn ${viewMode === "heatmap" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setViewMode("heatmap")}
            >
              🔥 Heatmap
            </button>
            <button className="btn btn-ghost hover-lift" onClick={goToToday}>
              Today
            </button>
          </div>
        </div>

        {/* Month Summary */}
        {monthStats.totalEntries > 0 && (
          <div style={{
            background: "linear-gradient(135deg, rgba(139, 211, 199, 0.1), rgba(139, 211, 199, 0.05))",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            border: "1px solid rgba(139, 211, 199, 0.2)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Month Summary:</span>
              <span style={{ color: "var(--accent)" }}>{monthStats.totalEntries} entries</span>
              <span>•</span>
              <span>{monthStats.trackedDays} days tracked</span>
              <span>•</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                Most common: {getMoodEmoji(monthStats.mostCommonMood)} 
                <span style={{ textTransform: "capitalize" }}>{monthStats.mostCommonMood}</span>
              </span>
            </div>
          </div>
        )}

        {/* Day names */}
        {viewMode === "calendar" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 4, // Reduced gap to match smaller cells
            textAlign: "center",
            marginBottom: 8 // Reduced margin
          }}>
            {dayNames.map(day => (
              <div key={day} style={{ 
                fontSize: 11, // Slightly smaller font
                fontWeight: 600, 
                color: "var(--muted)",
                padding: "4px 0" // Reduced padding
              }}>
                {day}
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Content */}
        {viewMode === "calendar" && renderCalendarView()}
        {viewMode === "stats" && renderStatsView()}
        {viewMode === "heatmap" && renderHeatmapView()}

        {/* Selected Day Details */}
        {selectedDay && selectedDay.entries.length > 0 && (
          <div style={{ 
            marginTop: 20, 
            padding: 16,
            background: "rgba(255,255,255,0.02)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.05)",
            animation: "slideUp 0.3s ease"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: 12
            }}>
              <h4 style={{ margin: 0 }}>
                {new Date(selectedDay.date).toLocaleDateString("en-US", { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              <button 
                className="btn btn-ghost" 
                onClick={() => setSelectedDay(null)}
                style={{ padding: "4px 8px", fontSize: 12 }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedDay.entries.map((entry, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: 12,
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 8
                }}>
                  <div style={{ 
                    fontSize: 20,
                    flexShrink: 0
                  }}>
                    {getMoodEmoji(entry.mood)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: 14, 
                      fontWeight: 600,
                      textTransform: "capitalize",
                      color: moodColors[entry.mood]
                    }}>
                      {entry.mood}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text)", marginTop: 4 }}>
                      {entry.note}
                    </div>
                    <div style={{ 
                      fontSize: 11, 
                      color: "var(--muted)", 
                      marginTop: 4 
                    }}>
                      {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div style={{ 
          marginTop: 20, 
          borderTop: "1px solid rgba(255,255,255,0.1)", 
          paddingTop: 16 
        }}>
          <div style={{ 
            fontSize: 12, 
            color: "var(--muted)", 
            marginBottom: 12,
            fontWeight: 600
          }}>
            Mood Legend
          </div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)", 
            gap: 12 
          }}>
            {Object.entries(moodColors).map(([mood, color]) => (
              <div key={mood} style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 8,
                padding: 8,
                background: "rgba(255,255,255,0.02)",
                borderRadius: 8
              }}>
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: color
                }} />
                <span style={{ fontSize: 14 }}>{getMoodEmoji(mood)}</span>
                <span style={{ 
                  fontSize: 12, 
                  color: "var(--text)",
                  textTransform: "capitalize"
                }}>
                  {mood}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .calendar-animation {
          animation: slideUp 0.4s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </section>
  );
}