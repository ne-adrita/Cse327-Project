// Journal.jsx (Enhanced with engaging UI and features)
import React, { useEffect, useRef, useState } from "react";
import { transcribeAudioBlob } from "../utils/whisper";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("happy");
  const [note, setNote] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState("00:00");
  const [transcript, setTranscript] = useState("No transcript yet");
  const [useTranscriptEnabled, setUseTranscriptEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("write"); // write, voice, past
  const [wordCount, setWordCount] = useState(0);
  const [writingStreak, setWritingStreak] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const animationRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const textareaRef = useRef(null);

  // Load entries and calculate streak on mount
  useEffect(() => {
    const arr = JSON.parse(localStorage.getItem("pc_demo_entries_v1") || "[]");
    setEntries(arr.sort((a,b) => new Date(b.date) - new Date(a.date)));
    calculateWritingStreak(arr);
  }, []);

  // Calculate word count
  useEffect(() => {
    setWordCount(note.trim() ? note.trim().split(/\s+/).length : 0);
  }, [note]);

  // Calculate writing streak
  const calculateWritingStreak = (entries) => {
    if (entries.length === 0) {
      setWritingStreak(0);
      return;
    }

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const entryDates = [...new Set(entries.map(entry => 
      new Date(entry.date).toDateString()
    ))].sort((a, b) => new Date(b) - new Date(a));

    for (let i = 0; i < entryDates.length; i++) {
      const entryDate = new Date(entryDates[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (entryDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    
    setWritingStreak(streak);
  };

  // Create audio visualizer bars with enhanced animation
  useEffect(() => {
    const canvas = document.querySelector(".audio-visualizer");
    if (!canvas) return;
    canvas.innerHTML = '';

    for (let i = 0; i < 32; i++) {
      const bar = document.createElement("div");
      bar.className = "audio-bar";
      bar.style.height = "8%";
      bar.style.width = "3px";
      bar.style.borderRadius = "4px";
      bar.style.background = "var(--accent)";
      bar.style.transition = "height 0.1s ease";
      bar.style.opacity = "0.8";
      canvas.appendChild(bar);
    }
  }, []);

  function updateRecordingTime() {
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, "0");
    const seconds = (elapsed % 60).toString().padStart(2, "0");
    setRecordingTime(`${minutes}:${seconds}`);
  }

  function animateVisualizer() {
    const bars = document.querySelectorAll(".audio-bar");

    function update() {
      bars.forEach((bar, index) => {
        if (isRecording) {
          const baseHeight = Math.sin(Date.now() / 200 + index * 0.3) * 40 + 50;
          const randomVariation = Math.random() * 20;
          const height = Math.max(8, baseHeight + randomVariation);
          bar.style.height = `${height}%`;
          bar.style.opacity = (0.3 + (height / 100) * 0.7).toString();
        } else {
          bar.style.height = "8%";
          bar.style.opacity = "0.3";
        }
      });
      if (isRecording) animationRef.current = requestAnimationFrame(update);
    }
    update();
  }

  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscriptRef.current += text + ' ';
        else interimTranscript += text;
      }

      setTranscript(finalTranscriptRef.current + interimTranscript);
      setUseTranscriptEnabled(finalTranscriptRef.current.length > 0);
    };

    recognition.onerror = (event) => {
      console.log('Speech recognition error:', event.error);
    };

    return recognition;
  };

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      finalTranscriptRef.current = "";

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });

        if (finalTranscriptRef.current.trim()) {
          setTranscript(finalTranscriptRef.current.trim());
          setUseTranscriptEnabled(true);
        } else {
          try {
            const text = await transcribeAudioBlob(audioBlob, { apiKey: "" });
            setTranscript(text || "No transcription returned");
            setUseTranscriptEnabled(true);
          } catch {
            setTranscript(
              "Transcription finished (No API key connected for Whisper)."
            );
            setUseTranscriptEnabled(true);
          }
        }

        stream.getTracks().forEach((t) => t.stop());
      };

      recognitionRef.current = initSpeechRecognition();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {}
      }

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(updateRecordingTime, 1000);
      setTranscript("Listening...");
      animateVisualizer();

    } catch (err) {
      alert("Microphone permission denied. Enable it and try again.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    setIsRecording(false);
    clearInterval(timerRef.current);
    setRecordingTime("00:00");
    cancelAnimationFrame(animationRef.current);

    document.querySelectorAll(".audio-bar").forEach((b) => {
      b.style.height = "8%";
      b.style.opacity = "0.3";
    });

    if (!finalTranscriptRef.current.trim()) {
      setTranscript("Recording completed — speak a bit louder next time.");
    }
  }

  function toggleRecording() {
    isRecording ? stopRecording() : startRecording();
  }

  function saveEntry() {
    const arr = JSON.parse(localStorage.getItem("pc_demo_entries_v1") || "[]");

    const newEntry = {
      id: Date.now(),
      title: title || getDefaultTitle(),
      mood,
      note: note || "",
      date: new Date().toISOString(),
      transcript: transcript !== "No transcript yet" ? transcript : "",
      wordCount: wordCount
    };

    arr.push(newEntry);
    localStorage.setItem("pc_demo_entries_v1", JSON.stringify(arr));
    setEntries(arr.sort((a,b) => new Date(b.date) - new Date(a.date)));
    calculateWritingStreak(arr);

    // Success animation
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
      saveBtn.style.transform = 'scale(0.95)';
      setTimeout(() => saveBtn.style.transform = 'scale(1)', 150);
    }

    // Show success message
    showTempMessage("Journal saved with love 💖", "success");

    // Reset form
    setTitle("");
    setNote("");
    setMood("happy");
    setTranscript("No transcript yet");
    setUseTranscriptEnabled(false);
    setActiveTab("past");
  }

  function getDefaultTitle() {
    const moods = {
      happy: "Feeling Good Today",
      sad: "Working Through Feelings",
      anxious: "Navigating Anxiety",
      tired: "Resting and Recharging",
      angry: "Processing Strong Emotions",
      calm: "Peaceful Moments"
    };
    return moods[mood] || "Today's Reflection";
  }

  function useTranscript() {
    setNote(transcript);
    setActiveTab("write");
    showTempMessage("Transcript added to your journal! ✨", "info");
  }

  function clearRecording() {
    setTranscript("No transcript yet");
    setUseTranscriptEnabled(false);
    setRecordingTime("00:00");
    finalTranscriptRef.current = "";
  }

  function showTempMessage(message, type = "info") {
    const messageEl = document.createElement("div");
    messageEl.className = `temp-message temp-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'var(--accent)' : 'var(--warning)'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      animation: slideInRight 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => document.body.removeChild(messageEl), 300);
    }, 3000);
  }

  function insertPrompt(promptText) {
    setNote(prev => prev + (prev ? "\n\n" : "") + promptText);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }

  const moodEmojis = {
    happy: "😊",
    sad: "😔", 
    anxious: "😰",
    tired: "😴",
    angry: "😠",
    calm: "😌"
  };

  const writingPrompts = [
    "What made me smile today?",
    "What I'm grateful for right now...",
    "Something I learned about myself...",
    "A challenge I overcame...",
    "How I practiced self-care today...",
    "What I need to let go of...",
    "A beautiful moment I witnessed..."
  ];

  const buttonStyles = {
    primary: {
      background: "linear-gradient(135deg, #a78bfa, #c084fc)",
      color: "white",
      padding: "12px 24px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 14px rgba(168, 85, 247, 0.25)"
    },
    ghost: {
      background: "rgba(255,255,255,0.08)",
      color: "#ddd",
      padding: "10px 20px",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.15)",
      cursor: "pointer",
      transition: "all 0.3s ease"
    },
    record: {
      background: isRecording
        ? "linear-gradient(135deg, #fb7185, #ef4444)"
        : "linear-gradient(135deg, #818cf8, #6366f1)",
      color: "white",
      padding: "18px",
      borderRadius: "50%",
      width: "70px",
      height: "70px",
      border: "none",
      cursor: "pointer",
      fontSize: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: isRecording
        ? "0 6px 20px rgba(239,68,68,0.4)"
        : "0 6px 20px rgba(99,102,241,0.4)",
      transform: isRecording ? "scale(1.1)" : "scale(1)",
      transition: "all 0.3s ease"
    }
  };

  return (
    <section className="module" data-module="journal">
      <div className="module-header">
        <h2>Mindful Journal</h2>
        <div className="subtext">Your safe space for thoughts and feelings</div>
        
        {/* Writing Stats */}
        <div style={{ 
          display: 'flex', 
          gap: 16, 
          marginTop: 12,
          fontSize: '13px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6,
            background: 'rgba(139,211,199,0.1)',
            padding: '6px 12px',
            borderRadius: '20px'
          }}>
            <span>🔥</span>
            <span>{writingStreak} day streak</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6,
            background: 'rgba(139,211,199,0.1)',
            padding: '6px 12px',
            borderRadius: '20px'
          }}>
            <span>📝</span>
            <span>{entries.length} entries</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card" style={{ padding: '8px', marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '10px',
          padding: '4px'
        }}>
          {[
            { id: "write", label: "✍️ Write", icon: "📝" },
            { id: "voice", label: "🎤 Voice", icon: "🎙️" },
            { id: "past", label: "📚 Past", icon: "📖" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, rgba(139,211,199,0.2), rgba(139,211,199,0.1))' 
                  : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? '600' : '400',
                transition: 'all 0.3s ease',
                fontSize: '14px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Write Tab */}
      {activeTab === "write" && (
        <div className="card card-enhanced">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3>Write Your Thoughts</h3>
            <div style={{ 
              fontSize: '12px', 
              color: 'var(--muted)',
              background: 'rgba(255,255,255,0.05)',
              padding: '4px 8px',
              borderRadius: '6px'
            }}>
              {wordCount} words
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>How are you feeling?</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {Object.entries(moodEmojis).map(([key, emoji]) => (
                <button
                  key={key}
                  onClick={() => setMood(key)}
                  style={{
                    padding: '10px 16px',
                    background: mood === key 
                      ? 'var(--accent)' 
                      : 'rgba(255,255,255,0.08)',
                    border: `2px solid ${mood === key ? 'var(--accent)' : 'transparent'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    transform: mood === key ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  {emoji} {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <label>Title</label>
          <input 
            type="text"
            placeholder="Give this entry a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginBottom: '16px' }}
          />

          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <label>Your Journal</label>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                Need inspiration?
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              flexWrap: 'wrap',
              marginBottom: '12px'
            }}>
              {writingPrompts.slice(0, 3).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => insertPrompt(prompt)}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(139,211,199,0.1)',
                    border: '1px solid rgba(139,211,199,0.2)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--accent)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
            
            <textarea
              ref={textareaRef}
              placeholder="Write from your heart... What's on your mind today?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ 
                minHeight: '200px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            />
          </div>

          <div className="button-row">
            <button 
              className="save-btn"
              style={buttonStyles.primary} 
              onClick={saveEntry}
              disabled={!note.trim()}
            >
              💾 Save Entry
            </button>
            <button style={buttonStyles.ghost} onClick={() => {
              setTitle(""); setNote(""); setTranscript("No transcript yet");
            }}>
              🗑️ Clear
            </button>
          </div>
        </div>
      )}

      {/* Voice Tab */}
      {activeTab === "voice" && (
        <div className="card card-enhanced">
          <h3>Voice Journaling</h3>
          <p className="small" style={{ marginBottom: '20px' }}>
            Speak your thoughts aloud — we'll transcribe them for you
          </p>

          <div className="voice-recorder">
            <div className="recording-controls" style={{ textAlign: 'center' }}>
              <button
                style={buttonStyles.record}
                onClick={toggleRecording}
              >
                {isRecording ? "■" : "●"}
              </button>

              <div className="record-info" style={{ marginTop: '16px' }}>
                <div className="status" style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: isRecording ? 'var(--accent)' : 'var(--text)'
                }}>
                  {isRecording ? "🎤 Recording… Speak now" : "Ready to record"}
                </div>
                <div className="time" style={{ 
                  fontSize: '24px', 
                  fontWeight: '700',
                  marginTop: '8px',
                  color: isRecording ? '#ef4444' : 'var(--text)'
                }}>
                  {recordingTime}
                </div>
              </div>
            </div>

            <div className="audio-visualizer" style={{ 
              height: '80px', 
              margin: '20px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px'
            }}></div>

            <div className="transcript-box fade-in" style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: '16px'
            }}>
              <div className="label" style={{ 
                fontWeight: '600', 
                marginBottom: '8px',
                color: 'var(--accent)'
              }}>
                Live Transcript:
              </div>
              <div className="content" style={{ 
                minHeight: '60px',
                lineHeight: '1.5',
                color: transcript === "No transcript yet" ? 'var(--muted)' : 'var(--text)'
              }}>
                {transcript}
              </div>
            </div>

            <div className="button-row">
              <button
                style={{ 
                  ...buttonStyles.primary,
                  opacity: useTranscriptEnabled ? 1 : 0.5,
                  cursor: useTranscriptEnabled ? 'pointer' : 'not-allowed'
                }}
                disabled={!useTranscriptEnabled}
                onClick={useTranscript}
              >
                📝 Use in Journal
              </button>

              <button style={buttonStyles.ghost} onClick={clearRecording}>
                🗑️ Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Past Entries Tab */}
      {activeTab === "past" && (
        <div className="card card-enhanced">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3>Your Journal History</h3>
            <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
              {entries.length} entries
            </div>
          </div>

          <div className="entries-list">
            {entries.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: 'var(--muted)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
                <div>No entries yet</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  Start writing to begin your journaling journey
                </div>
              </div>
            ) : (
              entries.map(entry => (
                <div key={entry.id} className="entry-item" style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  marginBottom: '16px',
                  transition: 'all 0.3s ease'
                }}>
                  <div className="entry-header" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <span className="title" style={{ 
                        fontSize: '18px', 
                        fontWeight: '600',
                        color: 'var(--text)'
                      }}>
                        {entry.title}
                      </span>
                      <span className="mood" style={{ 
                        marginLeft: '12px',
                        padding: '4px 8px',
                        background: 'rgba(139,211,199,0.1)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: 'var(--accent)'
                      }}>
                        {moodEmojis[entry.mood]} {entry.mood}
                      </span>
                    </div>
                    <div className="meta" style={{ 
                      fontSize: '12px', 
                      color: 'var(--muted)',
                      textAlign: 'right'
                    }}>
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {entry.wordCount && (
                        <div style={{ marginTop: '4px' }}>
                          {entry.wordCount} words
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="content" style={{
                    lineHeight: '1.6',
                    color: 'var(--text)'
                  }}>
                    {entry.note}

                    {entry.transcript && (
                      <div className="transcript-snippet" style={{
                        marginTop: '12px',
                        padding: '12px',
                        background: 'rgba(139,211,199,0.05)',
                        borderRadius: '8px',
                        borderLeft: '3px solid var(--accent)'
                      }}>
                        <strong style={{ color: 'var(--accent)' }}>🎤 Voice transcript:</strong> 
                        <div style={{ marginTop: '4px' }}>{entry.transcript}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        
        .entry-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
    </section>
  );
}