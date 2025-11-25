// src/components/MeditationPanelAdvancedWithTF.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * MeditationPanelAdvancedWithTF.jsx
 * - Full advanced meditation panel (MP3 upload, breathing, sleep tracker)
 * - Right column shows per-day sleep records + advice based on sleep time
 */

export default function MeditationPanelAdvancedWithTF() {
  // THEME
  const THEME = {
    bg: "#0F172A",
    accent: "#8BD3C7",
    highlight: "#FFD6E0",
    text: "#FFFFFF"
  };

  // AUDIO
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => Number(localStorage.getItem("med_volume")) || 0.7);
  const [savedAudioBase64, setSavedAudioBase64] = useState(() => localStorage.getItem("med_music_base64") || null);
  const [audioName, setAudioName] = useState(() => localStorage.getItem("med_music_name") || null);

  // BREATHING
  const phases = [
    { text: "Breathe in…", duration: 4000, scale: 1.45 },
    { text: "Hold…", duration: 2000, scale: 1.45 },
    { text: "Breathe out…", duration: 5000, scale: 1.0 },
    { text: "Hold…", duration: 2000, scale: 1.0 }
  ];
  const [phaseText, setPhaseText] = useState(phases[0].text);
  const [circleScale, setCircleScale] = useState(1);
  const phaseTimerRef = useRef(null);
  const phaseIndexRef = useRef(0);

  // AFFIRMATIONS / TIPS
  const AFFIRMATIONS = [
    "Take a slow breath. You are doing so well.",
    "This moment is yours — gentle and safe.",
    "One small breath at a time; you're not alone.",
    "Your care matters. Your rest matters.",
    "Breathe in patience, breathe out pressure."
  ];
  const TIPS = [
    "Try a 5-minute nap when your baby naps — short rest helps reset.",
    "Hydration supports mood. Keep water nearby during feedings.",
    "Light movement (gentle walk or stretch) can reduce stress.",
    "Share a small gratitude list with a friend or partner tonight.",
    "Prioritize one small restful routine before bed (dim lights, warm drink)."
  ];
  const [affirmation, setAffirmation] = useState(AFFIRMATIONS[0]);
  const [tip, setTip] = useState(TIPS[0]);

  // SLEEP TRACKER
  const [sleepEntries, setSleepEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("med_sleep_entries") || "[]"); } catch { return []; }
  });

  // ---------- Effects: rotate affirmation & tip ----------
  useEffect(() => {
    const a = setInterval(() => setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]), 15000);
    const t = setInterval(() => setTip(TIPS[Math.floor(Math.random() * TIPS.length)]), 25000);
    return () => { clearInterval(a); clearInterval(t); };
  }, []);

  // ---------- init audio element ----------
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = document.createElement("audio");
      audioRef.current.loop = true;
      audioRef.current.crossOrigin = "anonymous";
      audioRef.current.volume = volume;
      if (savedAudioBase64) audioRef.current.src = savedAudioBase64;
    }
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("med_volume", String(volume));
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ---------- helpers ----------
  const fileToBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res(e.target.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  // ---------- upload mp3 ----------
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("audio/") && !file.name.endsWith(".mp3")) {
      alert("Please upload a valid audio file (mp3).");
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      localStorage.setItem("med_music_base64", base64);
      localStorage.setItem("med_music_name", file.name);
      setSavedAudioBase64(base64);
      setAudioName(file.name);
      if (audioRef.current) audioRef.current.src = base64;
      alert("Music uploaded and saved. Click Start to play (user gesture required).");
    } catch (err) {
      console.error(err);
      alert("Failed to read file. Try again.");
    }
  };

  // ---------- breathing ----------
  const startBreathing = () => {
    phaseIndexRef.current = 0;
    const run = () => {
      const p = phases[phaseIndexRef.current];
      setPhaseText(p.text);
      setCircleScale(p.scale);
      phaseTimerRef.current = setTimeout(() => {
        phaseIndexRef.current = (phaseIndexRef.current + 1) % phases.length;
        run();
      }, p.duration);
    };
    run();
  };
  const stopBreathing = () => {
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
    setPhaseText("Take a deep breath…");
    setCircleScale(1);
  };

  // ---------- START / STOP SESSION ----------
  const startSession = async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = document.createElement("audio");
        audioRef.current.loop = true;
        audioRef.current.crossOrigin = "anonymous";
        if (savedAudioBase64) audioRef.current.src = savedAudioBase64;
      }
      if (!audioRef.current.src) {
        alert("No audio found. Upload an MP3 or choose a default.");
        return;
      }
      audioRef.current.volume = volume;
      await audioRef.current.play();
      setIsPlaying(true);
      startBreathing();
    } catch (err) {
      console.error("startSession:", err);
      alert("Playback blocked — interact then try Start again.");
    }
  };

  const stopSession = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    setIsPlaying(false);
    stopBreathing();
  };

  // ---------- SLEEP TRACKER ----------
  const addSleepEntry = (entry) => {
    const updated = [entry, ...sleepEntries].slice(0, 365);
    setSleepEntries(updated);
    localStorage.setItem("med_sleep_entries", JSON.stringify(updated));
  };
  const handleAddSleep = (e) => {
    e.preventDefault();
    const date = e.target.date.value || new Date().toISOString().slice(0, 10);
    const hours = Number(e.target.hours.value) || 0;
    const quality = e.target.quality.value || "Unknown";
    addSleepEntry({ id: Date.now(), date, hours, quality });
    e.target.reset();
  };
  const exportSleepCSV = () => {
    if (!sleepEntries.length) { alert("No sleep entries to export."); return; }
    const header = "date,hours,quality\n";
    const rows = sleepEntries.map(s => `${s.date},${s.hours},${s.quality}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "sleep_entries.csv"; a.click(); URL.revokeObjectURL(url);
  };

  // ---------- cleanup on unmount ----------
  useEffect(() => {
    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // ---------- UI ----------
  return (
    <div style={{ background: THEME.bg, color: THEME.text, minHeight: "100vh", padding: 18, fontFamily: "Inter, system-ui, -apple-system" }}>
      <style>{`
        .card { background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border-radius:12px; padding:14px; box-shadow: 0 8px 24px rgba(2,6,23,0.6); }
        .btn { padding:8px 12px; border-radius:10px; font-weight:600; cursor:pointer; border:none; }
        @media (max-width:900px) { .layout { grid-template-columns: 1fr !important; } .rightCol { padding-top: 12px; } }
      `}</style>

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div>
          <h1 style={{ margin: 0, color: THEME.accent }}>🌸 Calm for New Mothers</h1>
          <div style={{ color: "#9AA6B2", marginTop: 6 }}>Gentle meditations, sleep tools, and postpartum support</div>
        </div>
      </header>

      <div className="layout" style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 16 }}>
        {/* LEFT */}
        <div>
          <div className="card" style={{ marginBottom: 12 }}>
            <h3 style={{ color: THEME.accent, marginTop: 0 }}>Add Music (MP3) — Auto-save</h3>
            <div style={{ color: "#9AA6B2", marginBottom: 8 }}>Upload .mp3 from your device. Saved locally for next visits.</div>
            <input type="file" accept=".mp3,audio/mp3" onChange={handleFileUpload} style={{ display: "block", marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button className="btn" style={{ background: THEME.accent, color: THEME.bg }} onClick={startSession}>Start Session</button>
              <button className="btn" style={{ background: THEME.highlight, color: THEME.bg }} onClick={stopSession}>Stop</button>
              <div style={{ color: "#9AA6B2" }}>{audioName ? `Saved: ${audioName}` : (savedAudioBase64 ? "Custom music saved" : "No saved music")}</div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ color: "#9AA6B2" }}>Volume</label>
              <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e)=>setVolume(Number(e.target.value))} style={{ display: "block", width: "100%" }} />
            </div>
          </div>

          <div className="card" style={{ marginBottom: 12, padding: '20px' }}>
  <h3 style={{ color: THEME.accent, marginTop: 0 }}>Breathing Exercise</h3>
            <div style={{ display: "flex", gap: 50, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{
                width: 100, height: 100, borderRadius: 999, display: "grid", placeItems: "center",
                transform: `scale(${circleScale})`, transition: "transform 700ms cubic-bezier(.2,.8,.2,1)",
                border: `3px solid ${THEME.highlight}`, background: isPlaying ? "rgba(139,211,199,0.08)" : "transparent", marginBottom: 8
              }}>
                <div style={{ fontSize: 36 }}>{isPlaying ? "🧘‍♀️" : "🕊️"}</div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{phaseText}</div>
                <div style={{ color: "#9AA6B2", marginTop: 6 }}>Try 5 full cycles when you feel overwhelmed.</div>
                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  <button className="btn" style={{ background: THEME.accent, color: THEME.bg }} onClick={() => { if (!isPlaying) startSession(); }}>Start</button>
                  <button className="btn" style={{ background: THEME.highlight, color: THEME.bg }} onClick={stopSession}>Stop</button>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 12 }}>
            <h3 style={{ color: THEME.accent, marginTop: 0 }}>Positive Affirmation</h3>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{affirmation}</div>
            <div style={{ color: "#9AA6B2", marginTop: 8 }}>Affirmations rotate every 15 seconds.</div>
          </div>

          <div className="card" style={{ marginBottom: 12 }}>
            <h3 style={{ color: THEME.accent, marginTop: 0 }}>Postpartum Mood Tip</h3>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{tip}</div>
            <div style={{ color: "#9AA6B2", marginTop: 8 }}>Tips rotate every 25 seconds.</div>
          </div>

          <div className="card" style={{ marginBottom: 12 }}>
            <h3 style={{ color: THEME.accent, marginTop: 0 }}>Sleep Tracker</h3>
            <form onSubmit={handleAddSleep} style={{ display: "grid", gap: 8 }}>
              <label style={{ color: "#9AA6B2" }}>Date: <input name="date" type="date" defaultValue={new Date().toISOString().slice(0,10)} /></label>
              <label style={{ color: "#9AA6B2" }}>Hours: <input name="hours" type="number" step="0.25" placeholder="e.g. 6.5" /></label>
              <label style={{ color: "#9AA6B2" }}>Quality:
                <select name="quality">
                  <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option><option>Unknown</option>
                </select>
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" style={{ background: THEME.accent, color: THEME.bg }} type="submit">Save Entry</button>
                <button className="btn" style={{ background: THEME.highlight, color: THEME.bg }} onClick={(e)=>{ e.preventDefault(); exportSleepCSV(); }}>Export CSV</button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rightCol">
          <div className="card" style={{ marginBottom: 12 }}>
            <h3 style={{ color: THEME.accent, marginTop: 0 }}>Today's Sleep Summary</h3>
            <div style={{ color: "#9AA6B2", marginBottom: 8 }}>
              Review your sleep for the past days and get personalized advice based on your average sleep duration.
            </div>

            {sleepEntries.length === 0 ? (
              <div style={{ color: "#9AA6B2" }}>No sleep entries yet — add one above.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#9AA6B2", fontSize: 13 }}>
                    <th>Date</th><th>Hours</th><th>Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {sleepEntries.slice(0, 7).map(s => (
                    <tr key={s.id} style={{ borderBottom: "1px dashed rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "6px 0" }}>{s.date}</td>
                      <td style={{ padding: "6px 0" }}>{s.hours}</td>
                      <td style={{ padding: "6px 0" }}>{s.quality}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

<div style={{ marginTop: 10, fontWeight: 600 }}>
  {sleepEntries.length > 0 ? (() => {
    const avgHours = sleepEntries.reduce((a, b) => a + b.hours, 0) / sleepEntries.length;
    let message = "";
    let color = "";

    if (avgHours >= 7 && avgHours <= 12) {
      message = "Great! You are getting sufficient sleep. Keep it up!";
      color = "#42f584"; // green
    } else if (avgHours < 7) {
      message = "Try to get more sleep — even small naps help improve energy and mood.";
      color = "#f5c142"; // orange
    } else if (avgHours > 12) {
      message = "You are sleeping longer than usual. Make sure it does not affect your daily routine.";
      color = "#f54242"; // red
    }

    return <span style={{ color }}>{message}</span>;
  })() : <span style={{ color: "#FFD6E0" }}>Add your sleep entry to get advice.</span>}
</div>


            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button className="btn" style={{ background: THEME.accent, color: THEME.bg }} onClick={exportSleepCSV}>Export CSV</button>
              <button className="btn" style={{ background: THEME.highlight, color: THEME.bg }} onClick={() => { setSleepEntries([]); localStorage.removeItem("med_sleep_entries"); }}>Clear History</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
