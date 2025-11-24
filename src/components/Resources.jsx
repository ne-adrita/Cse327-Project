import React, { useEffect, useState } from "react";

const DEFAULT_RESOURCES = [
  {
    id: "res-1",
    title: "Postpartum Recovery Guide",
    description: "Evidence‑based guide covering physical and emotional recovery after childbirth.",
    category: "Postpartum Care",
    url: "https://www.who.int/reproductivehealth/publications/maternal_perinatal_health/postpartum-care/en/",
    filename: "WHO-Postpartum-Care.pdf",
    createdAt: new Date().toISOString(),
    icon: "🩺"
  },
  {
    id: "res-2",
    title: "Postpartum Depression Handbook",
    description: "Comprehensive overview of symptoms, risk factors, screening tools, and treatments.",
    category: "Mental Health",
    url: "https://www.apa.org/pi/women/resources/reports/postpartum-depression",
    filename: "APA-PPD-Handbook.pdf",
    createdAt: new Date().toISOString(),
    icon: "🧠"
  },
  {
    id: "res-3",
    title: "Breastfeeding Support Toolkit",
    description: "Practical breastfeeding techniques, troubleshooting, and lactation support resources.",
    category: "Breastfeeding",
    url: "https://www.unicef.org/reports/breastfeeding-support-toolkit",
    filename: "UNICEF-Breastfeeding-Toolkit.pdf",
    createdAt: new Date().toISOString(),
    icon: "🤱"
  },
  {
    id: "res-4",
    title: "Postpartum Nutrition Guide",
    description: "Nutritional guidelines, meal planning, and recovery-focused diet recommendations.",
    category: "Nutrition",
    url: "https://www.cdc.gov/nutrition/resources-publications/pregnancy-infant-toddler-nutrition/index.html",
    filename: "CDC-Postpartum-Nutrition.pdf",
    createdAt: new Date().toISOString(),
    icon: "🍎"
  },
  {
    id: "res-5",
    title: "Newborn Care Essentials",
    description: "Safe sleep, diapering, bathing, feeding, and newborn health guidance.",
    category: "Newborn Care",
    url: "https://www.cdc.gov/reproductivehealth/features/pregnancy-newborn-mother-care/index.html",
    filename: "CDC-Newborn-Care.pdf",
    createdAt: new Date().toISOString(),
    icon: "👶"
  },
  {
    id: "res-6",
    title: "Partner Support Guide",
    description: "How partners can provide emotional and practical support during postpartum recovery.",
    category: "Relationships",
    url: "https://www.postpartum.net/get-help/for-partners/",
    filename: "PSI-Partner-Guide.pdf",
    createdAt: new Date().toISOString(),
    icon: "💑"
  },
];

const styles = {
  page: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    maxWidth: 1200,
    margin: "0 auto",
    padding: "24px",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    minHeight: "100vh"
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "20px",
    padding: "32px",
    color: "white",
    marginBottom: "32px",
    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.2)"
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    border: "1px solid #f1f5f9",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden"
  },
  cardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)"
  },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    outline: "none",
    fontSize: "15px",
    background: "white",
    transition: "all 0.2s ease"
  },
  inputFocus: {
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)"
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "12px 24px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease"
  },
  btnGhost: {
    background: "transparent",
    border: "2px solid #e2e8f0",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#64748b",
    fontWeight: "500",
    fontSize: "14px",
    transition: "all 0.2s ease"
  },
  categoryTag: {
    background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
  },
  iconCircle: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    marginBottom: "16px",
    background: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)"
  }
};

function uid(prefix = "id") {
  return prefix + "-" + Math.random().toString(36).slice(2, 9);
}

export default function Resources() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "Postpartum Care", url: "", filename: "", icon: "📄" });
  const [hoverCard, setHoverCard] = useState(null);

  // Icons for categories
  const categoryIcons = {
    "Postpartum Care": "🩺",
    "Mental Health": "🧠",
    "Breastfeeding": "🤱",
    "Nutrition": "🍎",
    "Newborn Care": "👶",
    "Relationships": "💑",
    "General": "📄"
  };

  useEffect(() => {
    const raw = localStorage.getItem("rs_items");
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch (e) {
        setItems(DEFAULT_RESOURCES);
      }
    } else {
      setItems(DEFAULT_RESOURCES);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("rs_items", JSON.stringify(items));
  }, [items]);

  function handleAddClick() {
    setForm({ title: "", description: "", category: "Postpartum Care", url: "", filename: "", icon: "📄" });
    setEditing(null);
    setShowForm(true);
  }

  function handleEditClick(item) {
    setEditing(item.id);
    setForm({ 
      title: item.title, 
      description: item.description, 
      category: item.category, 
      url: item.url, 
      filename: item.filename || "",
      icon: item.icon || categoryIcons[item.category] || "📄"
    });
    setShowForm(true);
  }

  function handleDeleteClick(id) {
    if (!confirm("Delete this resource?")) return;
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function submitForm(e) {
    e.preventDefault();
    const trimmedTitle = (form.title || "").trim();
    if (!trimmedTitle) return alert("Title is required");

    const finalForm = {
      ...form,
      icon: form.icon || categoryIcons[form.category] || "📄"
    };

    if (editing) {
      setItems((prev) => prev.map((it) => 
        it.id === editing ? { ...it, ...finalForm, updatedAt: new Date().toISOString() } : it
      ));
    } else {
      const newItem = {
        id: uid("res"),
        ...finalForm,
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  }

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category || "General")))];
  
  const results = items.filter((it) => {
    if (category !== "All" && (it.category || "General") !== category) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (it.title || "").toLowerCase().includes(q) || 
           (it.description || "").toLowerCase().includes(q) || 
           (it.category || "").toLowerCase().includes(q);
  });

  function ResourceCard({ r }) {
    return (
      <div 
        style={{ 
          ...styles.card,
          ...(hoverCard === r.id ? styles.cardHover : {})
        }}
        onMouseEnter={() => setHoverCard(r.id)}
        onMouseLeave={() => setHoverCard(null)}
      >
        <div style={styles.iconCircle}>
          {r.icon || categoryIcons[r.category] || "📄"}
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              margin: "0 0 8px 0", 
              fontSize: "18px", 
              fontWeight: "700",
              color: "#1e293b"
            }}>
              {r.title}
            </h3>
            
            <p style={{ 
              margin: "0 0 16px 0", 
              fontSize: "14px", 
              color: "#64748b",
              lineHeight: "1.5"
            }}>
              {r.description}
            </p>
            
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={styles.categoryTag}>
                {r.category}
              </span>
              {r.filename && (
                <span style={{ 
                  fontSize: "12px", 
                  color: "#94a3b8",
                  background: "#f8fafc",
                  padding: "4px 8px",
                  borderRadius: "6px"
                }}>
                  {r.filename}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ 
          display: "flex", 
          gap: "12px", 
          marginTop: "20px",
          borderTop: "1px solid #f1f5f9",
          paddingTop: "16px"
        }}>
          <button
            style={{ ...styles.btnGhost, flex: 1 }}
            onClick={() => window.open(r.url, "_blank")}
          >
            📖 Open
          </button>
          
          <a href={r.url} download style={{ textDecoration: "none", flex: 1 }}>
            <button style={{ ...styles.btnPrimary, width: "100%" }}>
              ⬇️ Download
            </button>
          </a>
        </div>

        <div style={{ 
          display: "flex", 
          gap: "8px", 
          marginTop: "12px"
        }}>
          <button 
            style={{ ...styles.btnGhost, flex: 1, fontSize: "12px" }}
            onClick={() => handleEditClick(r)}
          >
            ✏️ Edit
          </button>
          <button 
            style={{ 
              ...styles.btnGhost, 
              flex: 1, 
              fontSize: "12px",
              borderColor: "#fecaca",
              color: "#dc2626"
            }} 
            onClick={() => handleDeleteClick(r.id)}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: "800" }}>
              Postpartum Resources
            </h1>
            <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
              Access helpful guides and support materials for your postpartum journey.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleAddClick} style={styles.btnPrimary}>
              + Add Resource
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{ display: "flex", gap: "16px", marginTop: "24px", alignItems: "center" }}>
          <input
            placeholder="🔍 Search resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ 
              ...styles.input, 
              flex: 1,
              background: "rgba(255,255,255,0.15)",
              borderColor: "rgba(255,255,255,0.3)",
              color: "white",
              backdropFilter: "blur(10px)"
            }}
            onFocus={(e) => e.target.style.background = "rgba(255,255,255,0.25)"}
            onBlur={(e) => e.target.style.background = "rgba(255,255,255,0.15)"}
          />

          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            style={{ 
              ...styles.input,
              minWidth: "160px",
              background: "rgba(255,255,255,0.15)",
              borderColor: "rgba(255,255,255,0.3)",
              color: "white",
              backdropFilter: "blur(10px)"
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c} style={{ color: "black" }}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
        gap: "24px" 
      }}>
        {results.map((r) => (
          <ResourceCard key={r.id} r={r} />
        ))}
      </div>

      {/* Empty State */}
      {results.length === 0 && (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px",
          color: "#64748b"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📚</div>
          <h3 style={{ margin: "0 0 8px 0", color: "#475569" }}>No resources found</h3>
          <p>Try adjusting your search or add a new resource.</p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div style={{ 
          position: "fixed", 
          inset: 0, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            background: "rgba(0,0,0,0.5)", 
            backdropFilter: "blur(4px)" 
          }} 
          onClick={() => setShowForm(false)} 
          />
          
          <form onSubmit={submitForm} style={{ 
            width: "600px",
            maxWidth: "100%",
            borderRadius: "20px",
            padding: "32px",
            background: "white",
            boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
            zIndex: 1001,
            position: "relative"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>
                {editing ? "Edit Resource" : "Add New Resource"}
              </h2>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} style={styles.btnGhost}>
                  Cancel
                </button>
                <button type="submit" style={styles.btnPrimary}>
                  {editing ? "Save Changes" : "Create Resource"}
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
                  Title *
                </label>
                <input 
                  value={form.title} 
                  onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} 
                  style={{ ...styles.input, width: "100%" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
                  Description
                </label>
                <textarea 
                  value={form.description} 
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} 
                  rows={3}
                  style={{ ...styles.input, width: "100%", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
                    Category
                  </label>
                  <select 
                    value={form.category} 
                    onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} 
                    style={{ ...styles.input, width: "100%" }}
                  >
                    {categories.filter(c => c !== "All").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
                    Icon
                  </label>
                  <input 
                    value={form.icon} 
                    onChange={(e) => setForm((s) => ({ ...s, icon: e.target.value }))} 
                    placeholder="🎯"
                    style={{ ...styles.input, width: "100%" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
                  URL *
                </label>
                <input 
                  value={form.url} 
                  onChange={(e) => setForm((s) => ({ ...s, url: e.target.value }))} 
                  style={{ ...styles.input, width: "100%" }}
                  placeholder="https://example.com/resource.pdf"
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
                  Filename (optional)
                </label>
                <input 
                  value={form.filename} 
                  onChange={(e) => setForm((s) => ({ ...s, filename: e.target.value }))} 
                  style={{ ...styles.input, width: "100%" }}
                  placeholder="Resource-Guide.pdf"
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}