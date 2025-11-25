import React, { useState } from "react";

export default function Community() {
  const [activeTab, setActiveTab] = useState("support");
  const [expandedResource, setExpandedResource] = useState(null);
  const [communityActivities, setCommunityActivities] = useState([
    {
      id: 1,
      time: "2h ago",
      user: "Maria",
      avatar: "https://i.pravatar.cc/40?img=1",
      type: "shared a tip:",
      content: "The 5 S's really helped soothe my baby during fussy evenings!",
      likes: 12,
      comments: 3
    },
    {
      id: 2,
      time: "5h ago",
      user: "David",
      avatar: "https://i.pravatar.cc/40?img=2",
      type: "asked:",
      content: "Any recommendations for postpartum anxiety resources?",
      likes: 8,
      comments: 7
    },
    {
      id: 3,
      time: "1d ago",
      user: "Sarah",
      avatar: "https://i.pravatar.cc/40?img=3",
      type: "posted:",
      content: "Finally getting 4-hour sleep stretches - there is light at the end of the tunnel!",
      likes: 24,
      comments: 5
    }
  ]);

  const [newPost, setNewPost] = useState("");

  const supportResources = [
    {
      id: 1,
      icon: "👥",
      title: "Local Meetups",
      description: "Find parents in your area",
      details: "Join local parenting groups and events in your community. Meet other parents facing similar challenges and share experiences.",
      action: "Find Groups",
      link: "https://www.meetup.com/topics/parenting/"
    },
    {
      id: 2,
      icon: "💬",
      title: "Online Forums",
      description: "24/7 discussion boards",
      details: "Access moderated forums anytime. Ask questions, share advice, and connect with parents worldwide.",
      action: "Join Discussion",
      link: "https://www.babycenter.com/forums"
    },
    {
      id: 3,
      icon: "📱",
      title: "Virtual Support Groups",
      description: "Weekly video meetings",
      details: "Participate in scheduled video calls with small groups of parents. Professional facilitators available.",
      action: "Schedule Session",
      link: "https://www.postpartum.net/get-help/virtual-support/"
    }
  ];

  const handleResourceClick = (resourceId) => {
    setExpandedResource(expandedResource === resourceId ? null : resourceId);
  };

  const handleLikeActivity = (activityId) => {
    setCommunityActivities((prev) =>
      prev.map((act) =>
        act.id === activityId ? { ...act, likes: act.likes + 1 } : act
      )
    );
  };

  const handleCommentActivity = (activityId) => {
    setCommunityActivities((prev) =>
      prev.map((act) =>
        act.id === activityId ? { ...act, comments: act.comments + 1 } : act
      )
    );
  };

  const handlePost = () => {
    if (!newPost.trim()) return;

    const newActivity = {
      id: Date.now(),
      time: "Just now",
      user: "You",
      avatar: "https://i.pravatar.cc/40?img=4",
      type: "posted:",
      content: newPost,
      likes: 0,
      comments: 0
    };

    setCommunityActivities([newActivity, ...communityActivities]);
    setNewPost("");
  };

  return (
    <section className="module" data-module="community">
      <div className="module-header">
        <h2 style={{ margin: 0 }}>Community</h2>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>Connect with other parents</div>
        <div className="tabs" style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <button
            onClick={() => setActiveTab("support")}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              background: activeTab === "support" ? "var(--primary)" : "transparent",
              color: activeTab === "support" ? "white" : "var(--text)",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Support Groups
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              background: activeTab === "activity" ? "var(--primary)" : "transparent",
              color: activeTab === "activity" ? "white" : "var(--text)",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Community Activity
          </button>
        </div>
      </div>

      {/* Support Groups */}
      {activeTab === "support" && (
        <div className="grid cols-2" style={{ gap: "1rem" }}>
          <div className="card">
            <h3>Support Groups</h3>
            {supportResources.map((resource) => (
              <div
                key={resource.id}
                className={`resource-card ${expandedResource === resource.id ? "expanded" : ""}`}
                onClick={() => handleResourceClick(resource.id)}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: expandedResource === resource.id ? "2px solid var(--primary)" : "1px solid var(--border)",
                  marginBottom: "0.75rem",
                  padding: "0.5rem",
                  borderRadius: "6px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div className="resource-icon" style={{ fontSize: "1.5rem" }}>{resource.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{resource.title}</div>
                    <div className="small">{resource.description}</div>
                  </div>
                </div>
                {expandedResource === resource.id && (
                  <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "var(--bg-muted)", borderRadius: "4px" }}>
                    <div className="small" style={{ marginBottom: "0.5rem" }}>{resource.details}</div>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer" style={{ padding: "0.25rem 0.75rem", background: "var(--primary)", color: "white", borderRadius: "4px", textDecoration: "none", fontSize: "12px" }}>
                      {resource.action}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a href="https://www.meetup.com/topics/parenting/" target="_blank" rel="noopener noreferrer" style={{ padding: "0.75rem", background: "var(--bg-muted)", border: "1px solid var(--border)", borderRadius: "8px", textDecoration: "none", color: "var(--text)" }}>
                <div style={{ fontWeight: 600 }}>Start Your Own Group</div>
                <div className="small">Create a custom support group</div>
              </a>
              <a href="https://www.postpartum.net/get-help/virtual-support/" target="_blank" rel="noopener noreferrer" style={{ padding: "0.75rem", background: "var(--bg-muted)", border: "1px solid var(--border)", borderRadius: "8px", textDecoration: "none", color: "var(--text)" }}>
                <div style={{ fontWeight: 600 }}>Upcoming Events</div>
                <div className="small">View scheduled meetings and activities</div>
              </a>
              <a href="https://www.babycenter.com/" target="_blank" rel="noopener noreferrer" style={{ padding: "0.75rem", background: "var(--bg-muted)", border: "1px solid var(--border)", borderRadius: "8px", textDecoration: "none", color: "var(--text)" }}>
                <div style={{ fontWeight: 600 }}>Resource Library</div>
                <div className="small">Access parenting guides and materials</div>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Community Activity */}
      {activeTab === "activity" && (
        <div className="grid cols-2" style={{ gap: "1rem" }}>
          <div className="card">
            <h3>Recent Community Activity</h3>
            {communityActivities.map((activity) => (
              <div key={activity.id} className="activity-item" style={{ marginBottom: "0.75rem", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <img src={activity.avatar} alt={activity.user} style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
                  <div style={{ fontWeight: 600 }}>{activity.user} <span style={{ fontWeight: 400 }}>{activity.type}</span></div>
                  <span style={{ fontSize: "10px", color: "var(--muted)", marginLeft: "auto" }}>{activity.time}</span>
                </div>
                <div className="small" style={{ marginBottom: "0.5rem" }}>{activity.content}</div>
                <div style={{ display: "flex", gap: "1rem", fontSize: "12px" }}>
                  <button onClick={() => handleLikeActivity(activity.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>👍 {activity.likes}</button>
                  <button onClick={() => handleCommentActivity(activity.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>💬 {activity.comments}</button>
                  <button style={{ background: "none", border: "none", cursor: "pointer" }}>🔗 Share</button>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Start a Conversation</h3>
            <textarea
              placeholder="Share your experience, ask a question, or offer support..."
              rows="4"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              style={{ padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "8px", resize: "vertical", fontFamily: "inherit", width: "100%", marginBottom: "0.5rem" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button style={{ padding: "0.5rem 1rem", background: "var(--bg-muted)", border: "1px solid var(--border)", borderRadius: "4px", cursor: "pointer" }}>Add Image</button>
              <button onClick={handlePost} style={{ padding: "0.5rem 1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Post to Community</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
