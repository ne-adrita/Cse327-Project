import React, { useState } from "react";

export default function Community() {
  const [activeTab, setActiveTab] = useState("support");
  const [expandedResource, setExpandedResource] = useState(null);
  const [newPost, setNewPost] = useState("");
  const [selectedMood, setSelectedMood] = useState("happy");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [communityActivities, setCommunityActivities] = useState([
    {
      id: 1,
      time: "2h ago",
      user: "Maria",
      avatar: "https://i.pravatar.cc/40?img=1",
      type: "shared a tip",
      content: "The 5 S's really helped soothe my baby during fussy evenings! Swaddling + shushing = magic ✨",
      likes: 12,
      comments: 3,
      mood: "happy",
      tags: ["baby care", "tips"],
      isLiked: false
    },
    {
      id: 2,
      time: "5h ago",
      user: "David",
      avatar: "https://i.pravatar.cc/40?img=2",
      type: "asked for help",
      content: "Any recommendations for postpartum anxiety resources? Feeling overwhelmed today 😔",
      likes: 8,
      comments: 7,
      mood: "anxious",
      tags: ["support", "mental health"],
      isLiked: false
    },
    {
      id: 3,
      time: "1d ago",
      user: "Sarah",
      avatar: "https://i.pravatar.cc/40?img=3",
      type: "celebrated",
      content: "Finally getting 4-hour sleep stretches - there is light at the end of the tunnel! 🎉",
      likes: 24,
      comments: 5,
      mood: "happy",
      tags: ["sleep", "progress"],
      isLiked: true
    },
    {
      id: 4,
      time: "1d ago",
      user: "Alex",
      avatar: "https://i.pravatar.cc/40?img=5",
      type: "shared experience",
      content: "6 weeks postpartum and finally starting to feel like myself again. The fog is lifting! 🌈",
      likes: 15,
      comments: 4,
      mood: "calm",
      tags: ["recovery", "hope"],
      isLiked: false
    }
  ]);

  const supportResources = [
    {
      id: 1,
      icon: "👥",
      title: "Local Meetups",
      description: "Find parents in your area",
      details: "Join local parenting groups and events in your community. Meet other parents facing similar challenges and share experiences.",
      action: "Find Groups",
      link: "https://www.meetup.com/topics/parenting/",
      members: "1.2k+ parents nearby",
      rating: "4.8 ★"
    },
    {
      id: 2,
      icon: "💬",
      title: "Online Forums",
      description: "24/7 discussion boards",
      details: "Access moderated forums anytime. Ask questions, share advice, and connect with parents worldwide.",
      action: "Join Discussion",
      link: "https://www.babycenter.com/forums",
      members: "50k+ active members",
      rating: "4.9 ★"
    },
    {
      id: 3,
      icon: "📱",
      title: "Virtual Support Groups",
      description: "Weekly video meetings",
      details: "Participate in scheduled video calls with small groups of parents. Professional facilitators available.",
      action: "Schedule Session",
      link: "https://www.postpartum.net/get-help/virtual-support/",
      members: "Small groups of 6-8",
      rating: "4.7 ★"
    },
    {
      id: 4,
      icon: "🤝",
      title: "Peer Mentoring",
      description: "One-on-one support",
      details: "Connect with experienced parents who've been through similar challenges. Get personalized guidance.",
      action: "Find a Mentor",
      link: "#",
      members: "200+ mentors available",
      rating: "4.9 ★"
    }
  ];

  const quickActions = [
    {
      icon: "🚀",
      title: "Start Your Own Group",
      description: "Create a custom support group",
      link: "https://www.meetup.com/topics/parenting/",
      color: "linear-gradient(135deg, #667eea, #764ba2)"
    },
    {
      icon: "📅",
      title: "Upcoming Events",
      description: "View scheduled meetings and activities",
      link: "https://www.postpartum.net/get-help/virtual-support/",
      color: "linear-gradient(135deg, #f093fb, #f5576c)"
    },
    {
      icon: "📚",
      title: "Resource Library",
      description: "Access parenting guides and materials",
      link: "https://www.babycenter.com/",
      color: "linear-gradient(135deg, #4facfe, #00f2fe)"
    },
    {
      icon: "🎯",
      title: "Daily Challenges",
      description: "Join community wellness activities",
      link: "#",
      color: "linear-gradient(135deg, #43e97b, #38f9d7)"
    }
  ];

  const moodEmojis = {
    happy: "😊",
    calm: "😌",
    tired: "😴",
    anxious: "😰",
    sad: "😔",
    angry: "😠"
  };

  const handleResourceClick = (resourceId) => {
    setExpandedResource(expandedResource === resourceId ? null : resourceId);
  };

  const handleLikeActivity = (activityId) => {
    setCommunityActivities((prev) =>
      prev.map((act) =>
        act.id === activityId ? { 
          ...act, 
          likes: act.isLiked ? act.likes - 1 : act.likes + 1,
          isLiked: !act.isLiked 
        } : act
      )
    );
  };

  const handleCommentActivity = (activityId) => {
    // In a real app, this would open a comment modal
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
      user: isAnonymous ? "Anonymous Parent" : "You",
      avatar: isAnonymous ? "https://i.pravatar.cc/40?img=0" : "https://i.pravatar.cc/40?img=4",
      type: "shared",
      content: newPost,
      likes: 0,
      comments: 0,
      mood: selectedMood,
      tags: ["new post"],
      isLiked: false
    };

    setCommunityActivities([newActivity, ...communityActivities]);
    setNewPost("");
    setShowConfetti(true);
    
    // Hide confetti after animation
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: "#10b981",
      calm: "#3b82f6",
      tired: "#f59e0b",
      anxious: "#f59e0b",
      sad: "#ef4444",
      angry: "#dc2626"
    };
    return colors[mood] || "#6b7280";
  };

  return (
    <section className="module" data-module="community">
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '-10px',
                left: `${Math.random() * 100}%`,
                fontSize: '20px',
                animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.7
              }}
            >
              {['🎉', '✨', '🌟', '💫', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="module-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h2 style={{ margin: 0 }}>Community Support</h2>
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {communityActivities.length} active conversations
          </div>
        </div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>
          Connect with parents who understand your journey
        </div>
        
        {/* Enhanced Tabs */}
        <div className="tabs" style={{ 
          marginTop: "1.5rem", 
          display: "flex", 
          gap: "0.5rem",
          background: 'rgba(255,255,255,0.05)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {[
            { id: "support", label: "👥 Support Groups", icon: "🤝" },
            { id: "activity", label: "💬 Community Feed", icon: "🔥" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, rgba(139,211,199,0.2), rgba(139,211,199,0.1))' 
                  : 'transparent',
                border: 'none',
                borderRadius: "8px",
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text)',
                cursor: "pointer",
                fontWeight: activeTab === tab.id ? '600' : '400',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Support Groups */}
      {activeTab === "support" && (
        <div className="grid cols-2" style={{ gap: "1.5rem" }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,211,199,0.05), rgba(139,211,199,0.02))' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <span>🤝</span>
              Support Networks
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {supportResources.map((resource) => (
                <div
                  key={resource.id}
                  className={`resource-card ${expandedResource === resource.id ? "expanded" : ""}`}
                  onClick={() => handleResourceClick(resource.id)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: expandedResource === resource.id 
                      ? "2px solid var(--accent)" 
                      : "1px solid rgba(255,255,255,0.1)",
                    padding: "1rem",
                    borderRadius: "12px",
                    background: expandedResource === resource.id 
                      ? 'rgba(139,211,199,0.1)' 
                      : 'rgba(255,255,255,0.03)',
                    transform: expandedResource === resource.id ? 'translateY(-2px)' : 'none',
                    boxShadow: expandedResource === resource.id 
                      ? '0 8px 25px rgba(0,0,0,0.15)' 
                      : 'none'
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div className="resource-icon" style={{ 
                      fontSize: "2rem",
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      padding: '8px',
                      borderRadius: '10px'
                    }}>{resource.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>{resource.title}</div>
                      <div className="small" style={{ marginBottom: '8px', color: 'var(--muted)' }}>{resource.description}</div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '12px' }}>
                        <span style={{ color: 'var(--accent)' }}>{resource.members}</span>
                        <span style={{ color: 'gold' }}>{resource.rating}</span>
                      </div>
                    </div>
                  </div>
                  {expandedResource === resource.id && (
                    <div style={{ 
                      marginTop: "1rem", 
                      padding: "1rem", 
                      background: "rgba(255,255,255,0.05)", 
                      borderRadius: "8px",
                      animation: 'slideDown 0.3s ease'
                    }}>
                      <div className="small" style={{ marginBottom: "1rem", lineHeight: '1.5' }}>{resource.details}</div>
                      <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ 
                          padding: "0.5rem 1rem", 
                          background: "var(--accent)", 
                          color: "white", 
                          borderRadius: "8px", 
                          textDecoration: "none", 
                          fontSize: "14px",
                          fontWeight: '600',
                          display: 'inline-block',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        {resource.action} →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span>⚡</span>
                Quick Actions
              </h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {quickActions.map((action, index) => (
                  <a 
                    key={index}
                    href={action.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      padding: "1rem", 
                      background: action.color,
                      borderRadius: "12px", 
                      textDecoration: "none", 
                      color: "white",
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{action.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{action.title}</div>
                      <div style={{ fontSize: "12px", opacity: 0.9 }}>{action.description}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span>📊</span>
                Community Stats
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(139,211,199,0.1)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>2.5k+</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Active Parents</div>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(139,211,199,0.1)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>98%</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Support Rate</div>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(139,211,199,0.1)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>24/7</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Availability</div>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(139,211,199,0.1)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>50+</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Activity */}
      {activeTab === "activity" && (
        <div className="grid cols-2" style={{ gap: "1.5rem" }}>
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <span>🔥</span>
              Live Community Feed
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {communityActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="activity-item" 
                  style={{ 
                    padding: "1.25rem", 
                    borderRadius: "12px", 
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: 'rgba(255,255,255,0.03)',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  {/* Mood Indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: getMoodColor(activity.mood),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    {moodEmojis[activity.mood]}
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <img 
                      src={activity.avatar} 
                      alt={activity.user} 
                      style={{ 
                        width: "40px", 
                        height: "40px", 
                        borderRadius: "50%",
                        border: '2px solid rgba(255,255,255,0.1)'
                      }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>
                        {activity.user} 
                        <span style={{ 
                          fontWeight: 400, 
                          color: 'var(--muted)',
                          marginLeft: '4px'
                        }}>
                          {activity.type}
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--muted)" }}>{activity.time}</div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    marginBottom: "0.75rem", 
                    lineHeight: '1.5',
                    fontSize: '14px'
                  }}>
                    {activity.content}
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    {activity.tags.map((tag, index) => (
                      <span 
                        key={index}
                        style={{
                          padding: '2px 8px',
                          background: 'rgba(139,211,199,0.1)',
                          borderRadius: '12px',
                          fontSize: '10px',
                          color: 'var(--accent)',
                          fontWeight: '500'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "1rem", fontSize: "13px" }}>
                    <button 
                      onClick={() => handleLikeActivity(activity.id)}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        cursor: "pointer",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: activity.isLiked ? 'var(--accent)' : 'var(--muted)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {activity.isLiked ? '❤️' : '🤍'} {activity.likes}
                    </button>
                    <button 
                      onClick={() => handleCommentActivity(activity.id)}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        cursor: "pointer",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--muted)'
                      }}
                    >
                      💬 {activity.comments}
                    </button>
                    <button style={{ 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer",
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--muted)'
                    }}>
                      🔗 Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span>💭</span>
                Share Your Thoughts
              </h3>
              
              {/* Mood Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500' }}>
                  How are you feeling?
                </label>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {Object.entries(moodEmojis).map(([key, emoji]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedMood(key)}
                      style={{
                        padding: "8px 12px",
                        background: selectedMood === key 
                          ? getMoodColor(key)
                          : "rgba(255,255,255,0.08)",
                        border: `2px solid ${selectedMood === key ? getMoodColor(key) : 'transparent'}`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "16px",
                        transition: "all 0.3s ease",
                        transform: selectedMood === key ? "scale(1.1)" : "scale(1)"
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="Share your experience, ask a question, or offer support to other parents..."
                rows="5"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                style={{ 
                  padding: "1rem", 
                  border: "1px solid rgba(255,255,255,0.1)", 
                  borderRadius: "12px", 
                  resize: "vertical", 
                  fontFamily: "inherit", 
                  width: "100%", 
                  marginBottom: "1rem",
                  background: 'rgba(255,255,255,0.03)',
                  fontSize: '14px'
                }}
              />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  Post anonymously
                </label>
                
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {newPost.length}/500 characters
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button style={{ 
                  padding: "0.75rem 1.5rem", 
                  background: "rgba(255,255,255,0.08)", 
                  border: "1px solid rgba(255,255,255,0.1)", 
                  borderRadius: "8px", 
                  cursor: "pointer",
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}>
                  📷 Add Image
                </button>
                <button 
                  onClick={handlePost} 
                  disabled={!newPost.trim()}
                  style={{ 
                    padding: "0.75rem 1.5rem", 
                    background: newPost.trim() ? "var(--accent)" : "rgba(139,211,199,0.3)", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    cursor: newPost.trim() ? "pointer" : "not-allowed",
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ✨ Post to Community
                </button>
              </div>
            </div>

            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span>🏆</span>
                Community Guidelines
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--accent)' }}>✓</span>
                  <span>Be kind and supportive</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--accent)' }}>✓</span>
                  <span>Respect different parenting choices</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--accent)' }}>✓</span>
                  <span>Keep discussions judgment-free</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--accent)' }}>✓</span>
                  <span>Share experiences, not medical advice</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </section>
  );
}