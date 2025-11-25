import React, { useEffect, useState } from "react";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sharing, setSharing] = useState("Private (default)");
  const [daily, setDaily] = useState(true);
  const [weekly, setWeekly] = useState(true);
  const [community, setCommunity] = useState(false);

  // Load saved settings
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("pc_settings_v1") || "{}");

    setName(saved.name || "Noshin Adrita");
    setEmail(saved.email || "noshin@example.com");
    setSharing(saved.sharing || "Private (default)");
    setDaily(saved.daily ?? true);
    setWeekly(saved.weekly ?? true);
    setCommunity(saved.community ?? false);
  }, []);

  function saveSettings() {
    const obj = {
      name,
      email,
      sharing,
      daily,
      weekly,
      community,
    };

    localStorage.setItem("pc_settings_v1", JSON.stringify(obj));
    alert("Settings saved successfully 🎉");
  }

  return (
    <section className="module" data-module="settings">
      <div className="module-header">
        <h2 style={{ margin: 0 }}>Settings</h2>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>
          Customize your experience
        </div>
      </div>

      <div className="grid cols-2">
        {/* Account & Privacy */}
        <div className="card">
          <h3>Account & Privacy</h3>

          <label>Name</label>
          <input
            type="text"
            value={name}
            id="settingName"
            onChange={(e) => setName(e.target.value)}
          />

          <label style={{ marginTop: 8 }}>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={{ marginTop: 8 }}>Data sharing</label>
          <select
            id="sharing"
            value={sharing}
            onChange={(e) => setSharing(e.target.value)}
          >
            <option>Private (default)</option>
            <option>Share anonymized data</option>
          </select>

          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={saveSettings}>
              Save settings
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <h3>Notifications</h3>

          {/* Daily reminders */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div>Daily reminders</div>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={daily}
                onChange={() => setDaily(!daily)}
                style={{ marginRight: 8 }}
              />
              <span className="slider" />
            </label>
          </div>

          {/* Weekly insights */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div>Weekly insights</div>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={weekly}
                onChange={() => setWeekly(!weekly)}
                style={{ marginRight: 8 }}
              />
              <span className="slider" />
            </label>
          </div>

          {/* Community updates */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div>Community updates</div>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={community}
                onChange={() => setCommunity(!community)}
                style={{ marginRight: 8 }}
              />
              <span className="slider" />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
