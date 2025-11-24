import React, { useEffect, useState } from "react";
import { getMoodEmoji } from "../utils/helpers";

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const arr = JSON.parse(localStorage.getItem("pc_demo_entries_v1") || "[]");
    setEntries(arr);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
      cells.push({
        day,
        date: dateStr,
        entries: dayEntries,
        isToday: isToday(currentYear, currentMonth, day)
      });
    }

    return cells;
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleDayClick = (cell) => {
    if (!cell || !cell.entries.length) return;

    const data = cell.entries
      .map(e => `${getMoodEmoji(e.mood)} ${e.mood}\n${e.title || ""}\n${e.note || ""}`)
      .join("\n----------------\n");

    alert(`${new Date(cell.date).toDateString()}\n\n${data}`);
  };

  const calendarCells = buildCalendar();

  return (
    <section className="module">
      <div className="module-header">
        <h2>Emotion Calendar</h2>
        <div className="module-subtitle">Your monthly mood overview</div>
      </div>

      <div className="card">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button className="btn btn-ghost" onClick={prevMonth}>←</button>
          <h3 style={{ margin: 0 }}>
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button className="btn btn-ghost" onClick={nextMonth}>→</button>
        </div>

        {/* Day names */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
          textAlign: "center",
          marginBottom: 10
        }}>
          {dayNames.map(day => (
            <div key={day} style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6
        }}>
          {calendarCells.map((cell, i) => (
            <div
              key={i}
              onClick={() => handleDayClick(cell)}
              style={{
                aspectRatio: "1",
                borderRadius: 12,
                padding: 6,
                cursor: cell ? "pointer" : "default",
                background: cell
                  ? cell.isToday
                    ? "var(--accent)"
                    : "var(--glass)"
                  : "transparent",
                border: cell?.isToday
                  ? "1px solid var(--accent)"
                  : "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {cell && (
                <>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{cell.day}</span>
                  {cell.entries.length > 0 && (
                    <div style={{ marginTop: 4, display: "flex", gap: 2 }}>
                      {cell.entries.slice(0, 3).map((e, idx) => (
                        <span key={idx}>{getMoodEmoji(e.mood)}</span>
                      ))}
                      {cell.entries.length > 3 && (
                        <span style={{ fontSize: 10, color: "var(--muted)" }}>
                          +{cell.entries.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12 }}>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>Mood Legend</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {['happy', 'sad', 'anxious', 'tired', 'angry', 'calm'].map(mood => (
              <div key={mood} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>{getMoodEmoji(mood)}</span>
                <span style={{ color: "var(--muted)" }}>{mood}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}