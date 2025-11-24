// AIChat.jsx (Complete with Dynamic Context System)
import React, { useState, useRef, useEffect } from "react";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { id: 0, sender: "ai", text: "Hi! I'm your postpartum support assistant. I'm here to listen and offer practical suggestions. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // OpenAI API configuration
  const OPENAI_API_KEY = "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";
  const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getDynamicAIResponse = async (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    let contextInstruction = "Provide empathetic postpartum support with varied, contextual suggestions.";

    if (lowerMsg.includes("cry") || lowerMsg.includes("crying")) {
      contextInstruction = "Offer dynamic, randomized strategies for soothing a crying baby postpartum. Focus on practical techniques that are easy to implement.";
    } else if (lowerMsg.includes("anxious") || lowerMsg.includes("worry") || lowerMsg.includes("panic")) {
      contextInstruction = "Generate varied coping strategies for postpartum anxiety, with empathy and practical advice. Include grounding techniques and reassurance.";
    } else if (lowerMsg.includes("tired") || lowerMsg.includes("sleep") || lowerMsg.includes("exhaust") || lowerMsg.includes("fatigue")) {
      contextInstruction = "Suggest creative, randomized tips for managing postpartum exhaustion and sleep challenges. Focus on realistic rest strategies.";
    } else if (lowerMsg.includes("overwhelm") || lowerMsg.includes("stress") || lowerMsg.includes("can't cope")) {
      contextInstruction = "Provide supportive, varied advice for feeling overwhelmed postpartum. Break down tasks and offer perspective.";
    } else if (lowerMsg.includes("lonely") || lowerMsg.includes("alone") || lowerMsg.includes("isolat")) {
      contextInstruction = "Offer contextual, randomized ideas for reducing postpartum loneliness and isolation. Suggest connection opportunities.";
    } else if (lowerMsg.includes("guilt") || lowerMsg.includes("bad mom") || lowerMsg.includes("failure")) {
      contextInstruction = "Give empathetic, varied reframing strategies for postpartum guilt. Normalize these feelings and offer compassion.";
    } else if (lowerMsg.includes("breast") || lowerMsg.includes("nurs") || lowerMsg.includes("feed") || lowerMsg.includes("lactat")) {
      contextInstruction = "Provide diverse, non-judgmental feeding support and troubleshooting for postpartum feeding challenges.";
    } else if (lowerMsg.includes("pain") || lowerMsg.includes("hurt") || lowerMsg.includes("recover") || lowerMsg.includes("heal")) {
      contextInstruction = "Offer varied recovery advice for postpartum physical healing and pain management with empathy.";
    } else if (lowerMsg.includes("body") || lowerMsg.includes("weight") || lowerMsg.includes("shape") || lowerMsg.includes("look")) {
      contextInstruction = "Give body-positive, varied support for postpartum body changes and self-image concerns.";
    } else if (lowerMsg.includes("partner") || lowerMsg.includes("husband") || lowerMsg.includes("wife") || lowerMsg.includes("relationship")) {
      contextInstruction = "Provide diverse advice for navigating postpartum relationship changes and communication challenges.";
    } else if (lowerMsg.includes("sex") || lowerMsg.includes("intimacy") || lowerMsg.includes("physical relationship")) {
      contextInstruction = "Offer sensitive, varied guidance on postpartum intimacy and physical relationship concerns.";
    } else if (lowerMsg.includes("sad") || lowerMsg.includes("depress") || lowerMsg.includes("hopeless") || lowerMsg.includes("empty")) {
      contextInstruction = "Provide compassionate, varied support for postpartum sadness and depression symptoms with resources.";
    } else if (lowerMsg.includes("anger") || lowerMsg.includes("angry") || lowerMsg.includes("rage") || lowerMsg.includes("frustrat")) {
      contextInstruction = "Give understanding, varied strategies for managing postpartum anger and frustration constructively.";
    } else if (lowerMsg.includes("bond") || lowerMsg.includes("connect") || lowerMsg.includes("attachment")) {
      contextInstruction = "Offer diverse, reassuring suggestions for building postpartum bonding and connection with baby.";
    } else if (lowerMsg.includes("help") || lowerMsg.includes("support") || lowerMsg.includes("ask")) {
      contextInstruction = "Provide varied, practical ideas for seeking and accepting postpartum help from others.";
    } else if (lowerMsg.includes("work") || lowerMsg.includes("job") || lowerMsg.includes("career") || lowerMsg.includes("return")) {
      contextInstruction = "Give diverse guidance on postpartum work transitions, career concerns, and work-life balance.";
    } else if (lowerMsg.includes("friend") || lowerMsg.includes("social") || lowerMsg.includes("people")) {
      contextInstruction = "Offer varied advice for navigating postpartum friendships and social relationships.";
    } else if (lowerMsg.includes("memory") || lowerMsg.includes("forget") || lowerMsg.includes("brain") || lowerMsg.includes("focus")) {
      contextInstruction = "Provide reassuring, varied explanations and coping strategies for postpartum memory changes and brain fog.";
    } else if (lowerMsg.includes("hair") || lowerMsg.includes("skin") || lowerMsg.includes("teeth") || lowerMsg.includes("physical change")) {
      contextInstruction = "Give diverse information and self-care tips for postpartum physical changes and appearance concerns.";
    } else if (lowerMsg.includes("walk") || lowerMsg.includes("exercise") || lowerMsg.includes("movement") || lowerMsg.includes("active")) {
      contextInstruction = "Offer varied, safe postpartum exercise and movement suggestions tailored to recovery stage.";
    } else if (lowerMsg.includes("eat") || lowerMsg.includes("food") || lowerMsg.includes("nutrition") || lowerMsg.includes("diet")) {
      contextInstruction = "Provide diverse postpartum nutrition advice and easy meal ideas for new parents.";
    } else if (lowerMsg.includes("hospital") || lowerMsg.includes("doctor") || lowerMsg.includes("appointment") || lowerMsg.includes("medical")) {
      contextInstruction = "Give varied guidance on postpartum medical care, appointments, and when to seek help.";
    } else if (lowerMsg.includes("older child") || lowerMsg.includes("sibling") || lowerMsg.includes("toddler") || lowerMsg.includes("kids")) {
      contextInstruction = "Offer diverse strategies for managing postpartum transitions with older children and sibling relationships.";
    } else if (lowerMsg.includes("family") || lowerMsg.includes("parents") || lowerMsg.includes("in-law") || lowerMsg.includes("relative")) {
      contextInstruction = "Provide varied advice for setting boundaries and navigating postpartum family dynamics.";
    } else if (lowerMsg.includes("money") || lowerMsg.includes("financial") || lowerMsg.includes("cost") || lowerMsg.includes("budget")) {
      contextInstruction = "Give diverse, practical suggestions for managing postpartum financial concerns and budgeting.";
    } else if (lowerMsg.includes("house") || lowerMsg.includes("home") || lowerMsg.includes("clean") || lowerMsg.includes("chores")) {
      contextInstruction = "Offer varied, realistic approaches to postpartum household management and cleaning expectations.";
    } else if (lowerMsg.includes("car") || lowerMsg.includes("drive") || lowerMsg.includes("travel") || lowerMsg.includes("go out")) {
      contextInstruction = "Provide diverse tips for postpartum transportation, outings, and managing travel with a newborn.";
    } else if (lowerMsg.includes("pets") || lowerMsg.includes("dog") || lowerMsg.includes("cat") || lowerMsg.includes("animal")) {
      contextInstruction = "Give varied advice for adjusting pets to postpartum changes and managing pet care with a newborn.";
    } else if (lowerMsg.includes("cloth") || lowerMsg.includes("diaper") || lowerMsg.includes("change") || lowerMsg.includes("bath")) {
      contextInstruction = "Offer diverse newborn care tips and troubleshooting for diapering, bathing, and daily care routines.";
    } else if (lowerMsg.includes("schedule") || lowerMsg.includes("routine") || lowerMsg.includes("pattern") || lowerMsg.includes("rhythm")) {
      contextInstruction = "Provide varied approaches to establishing postpartum routines and baby schedules that work for the family.";
    } else if (lowerMsg.includes("vaccine") || lowerMsg.includes("shot") || lowerMsg.includes("immunization") || lowerMsg.includes("doctor visit")) {
      contextInstruction = "Give diverse support and preparation tips for postpartum medical decisions and baby healthcare appointments.";
    } else if (lowerMsg.includes("milestone") || lowerMsg.includes("develop") || lowerMsg.includes("growth") || lowerMsg.includes("progress")) {
      contextInstruction = "Offer varied, reassuring perspectives on baby development milestones and postpartum parenting comparisons.";
    } else if (lowerMsg.includes("product") || lowerMsg.includes("gear") || lowerMsg.includes("buy") || lowerMsg.includes("purchase")) {
      contextInstruction = "Provide diverse advice on postpartum baby products, gear decisions, and essential purchases.";
    } else if (lowerMsg.includes("time") || lowerMsg.includes("alone time") || lowerMsg.includes("break") || lowerMsg.includes("self")) {
      contextInstruction = "Give varied suggestions for finding postpartum alone time, self-care, and personal space.";
    } else if (lowerMsg.includes("identity") || lowerMsg.includes("who i am") || lowerMsg.includes("myself") || lowerMsg.includes("person")) {
      contextInstruction = "Offer diverse support for postpartum identity changes and rediscovering personal interests.";
    } else if (lowerMsg.includes("future") || lowerMsg.includes("plan") || lowerMsg.includes("next") || lowerMsg.includes("later")) {
      contextInstruction = "Provide varied perspectives on postpartum future planning and adjusting expectations.";
    } else if (lowerMsg.includes("compare") || lowerMsg.includes("other mom") || lowerMsg.includes("social media") || lowerMsg.includes("perfect")) {
      contextInstruction = "Give diverse reassurance about postpartum comparisons and managing external pressures.";
    } else if (lowerMsg.includes("decision") || lowerMsg.includes("choice") || lowerMsg.includes("right") || lowerMsg.includes("wrong")) {
      contextInstruction = "Offer varied support for postpartum decision-making and trusting parental instincts.";
    } else if (lowerMsg.includes("hormone") || lowerMsg.includes("mood swing") || lowerMsg.includes("emotional") || lowerMsg.includes("tearful")) {
      contextInstruction = "Provide diverse explanations and coping strategies for postpartum hormonal changes and mood fluctuations.";
    } else if (lowerMsg.includes("night") || lowerMsg.includes("evening") || lowerMsg.includes("dusk") || lowerMsg.includes("sundown")) {
      contextInstruction = "Give varied strategies for managing postpartum evening challenges and baby witching hours.";
    } else if (lowerMsg.includes("morning") || lowerMsg.includes("wake up") || lowerMsg.includes("start day") || lowerMsg.includes("dawn")) {
      contextInstruction = "Offer diverse approaches to postpartum mornings and starting the day with a newborn.";
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      // Build conversation history
      const conversationHistory = messages.slice(-8).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a compassionate postpartum support specialist. ${contextInstruction} 

CRITICAL RULES:
- NEVER say "I don't know", "I can't help with that", or "sorry, I cannot answer that"
- ALWAYS provide supportive, relevant responses even for non-postpartum topics
- If the topic seems unrelated, find a way to connect it to emotional support or general wellbeing
- Be warm, empathetic, and practical in every single response
- Offer validation and understanding regardless of the topic
- Remember that postpartum affects all areas of life - be flexible and understanding

Your role is to be a supportive listener who always finds a way to help and validate feelings.`
            },
            ...conversationHistory,
            {
              role: "user",
              content: userMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.85,
          frequency_penalty: 0.7,
          presence_penalty: 0.4
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const aiResponse = data.choices[0].message.content.trim();
        
        // Safety check - ensure response doesn't contain rejection phrases
        const rejectionPhrases = ["i don't know", "i cannot help", "sorry, i can't", "i'm not able", "that's outside my", "postpartum-related questions"];
        const hasRejection = rejectionPhrases.some(phrase => aiResponse.toLowerCase().includes(phrase));
        
        if (!hasRejection && aiResponse.length > 10) {
          return aiResponse;
        } else {
          return generateAlwaysSupportiveFallback(userMessage);
        }
      } else {
        throw new Error("Unexpected response format");
      }

    } catch (error) {
      console.error("OpenAI API error:", error);
      return generateAlwaysSupportiveFallback(userMessage);
    }
  };

  // Fallback that always provides supportive responses
  const generateAlwaysSupportiveFallback = (userMessage) => {
    const empathyPhrases = [
      "I can hear this is important to you",
      "That sounds like it's weighing on you",
      "I appreciate you sharing this with me",
      "This seems to be touching on something meaningful",
      "I can sense the significance in what you're expressing"
    ];
    
    const validationPhrases = [
      "What you're sharing makes complete sense",
      "Your perspective here is really valuable",
      "This sounds like a real challenge to navigate",
      "Many people experience similar concerns during times of change",
      "What you're describing resonates with common human experiences"
    ];
    
    const questionFrames = [
      "What's coming up for you as you talk about this?",
      "How has this been affecting your daily life?",
      "What would support look like for you right now?",
      "What's one small thing that might help this feel more manageable?",
      "How is this different from what you expected?"
    ];
    
    const supportFrames = [
      "It can help to focus on small, manageable steps forward",
      "Many find it useful to explore different perspectives on this",
      "Sometimes just expressing these thoughts can create some space",
      "This might be an opportunity to practice self-compassion",
      "Remember that all challenges have their own timeline and process"
    ];
    
    const empathy = empathyPhrases[Math.floor(Math.random() * empathyPhrases.length)];
    const validation = validationPhrases[Math.floor(Math.random() * validationPhrases.length)];
    const question = questionFrames[Math.floor(Math.random() * questionFrames.length)];
    const support = supportFrames[Math.floor(Math.random() * supportFrames.length)];
    
    const responses = [
      `${empathy}. ${validation} ${support} ${question}`,
      `${validation} ${empathy}. ${question} ${support}`,
      `${empathy}. ${question} ${validation} ${support}`,
      `${validation} ${support} ${empathy}. ${question}`,
      `${empathy}. ${support} ${validation} ${question}`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const addMessage = async (text, sender = "user") => {
    const newMessage = { id: Date.now(), sender, text };
    setMessages(prev => [...prev, newMessage]);
    
    if (sender === "user") {
      setIsLoading(true);
      try {
        const aiResponse = await getDynamicAIResponse(text);
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: "ai", text: aiResponse }]);
      } catch (error) {
        console.error("Error getting AI response:", error);
        const fallback = generateAlwaysSupportiveFallback(text);
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: "ai", text: fallback }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    addMessage(input.trim(), "user");
    setInput("");
  };

  const clearChat = () => {
    setMessages([
      { id: Date.now(), sender: "ai", text: "Hi! I'm your postpartum support assistant. I'm here to listen and offer practical suggestions. How are you feeling today?" },
    ]);
  };

  const conversationStarters = [
    "My baby won't stop crying - what can I try?",
    "I'm feeling really anxious - any coping strategies?",
    "I'm so exhausted - how can I get more rest?",
    "I'm overwhelmed with everything - help!",
    "I feel lonely as a new parent - how to connect?",
    "I'm worried about my recovery - what's normal?",
    "I'm struggling with sleep deprivation",
    "How can I ask for more help from family?",
    "I feel guilty taking time for myself",
    "My relationship with partner has changed"
  ];

  return (
    <section className="module" data-module="ai-chat">
      <div className="module-header">
        <h2 style={{ margin: 0 }}>AI Support Chat</h2>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>
          Powered by OpenAI • Always Supportive
          <button 
            className="btn btn-ghost" 
            onClick={clearChat}
            style={{ marginLeft: '12px', padding: '4px 8px', fontSize: '12px' }}
          >
            Clear Chat
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>
        <div className="card">
          <div className="chat-container">
            <div className="chat-header">
              <h3 style={{ margin: 0 }}>Postpartum Support Assistant</h3>
              <div className="small">I'm here to support you with any challenge you're facing</div>
            </div>

            <div className="chat-messages" id="chatMessages">
              {messages.map(m => (
                <div key={m.id} className={`message ${m.sender === "user" ? "user-message" : "ai-message"}`}>
                  {m.text}
                </div>
              ))}
              {isLoading && (
                <div className="message ai-message">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)' }}>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    Thinking of supportive suggestions...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-area">
              <input 
                className="chat-input" 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyPress={(e) => { 
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Share anything on your mind - I'm here to listen and support..." 
                disabled={isLoading}
              />
              <button 
                className="send-btn" 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? "..." : "Share"}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <h3 style={{ margin: '0 0 12px 0' }}>Conversation Starters</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {conversationStarters.map((starter, index) => (
                <button 
                  key={index}
                  className="btn btn-ghost quick-question" 
                  onClick={() => addMessage(starter, "user")}
                  disabled={isLoading}
                  style={{ 
                    fontSize: '12px', 
                    padding: '8px 10px',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: '100%',
                    lineHeight: '1.3'
                  }}
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: 'rgba(139,211,199,0.1)' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>💝 AI Status</h4>
            <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: '1.4' }}>
              <div><strong>Model:</strong> GPT-3.5 Turbo</div>
              <div><strong>Context:</strong> 40+ Postpartum Topics</div>
              <div><strong>Style:</strong> Always Supportive</div>
              <div style={{ marginTop: '8px', fontSize: '11px' }}>
                💡 I'll never reject your questions - always here to help
              </div>
            </div>
          </div>

          <div className="card" style={{ border: '1px solid var(--danger)', background: 'rgba(239,68,68,0.05)' }}>
            <h4 style={{ color: 'var(--danger)', margin: '0 0 12px 0', fontSize: '14px' }}>🆘 Immediate Help</h4>
            <div className="small" style={{ color: 'var(--muted)', lineHeight: '1.4' }}>
              <div style={{ marginBottom: '6px' }}><strong>Crisis Text Line:</strong><br />Text HOME to 741741</div>
              <div style={{ marginBottom: '6px' }}><strong>National Suicide Prevention:</strong><br />988</div>
              <div style={{ marginBottom: '8px' }}><strong>Postpartum Support International:</strong><br />1-800-944-4773</div>
            </div>
          </div>
        </div>
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