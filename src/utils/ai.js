// ---------------------------------------------
// AI LOGIC — Dynamic, Contextual, Random Replies
// ---------------------------------------------

// 1. Extract Intent from Keywords
export function extractIntent(message) {
    const msg = message.toLowerCase();
  
    if (/(sad|down|depressed|upset|lonely)/.test(msg)) return "sadness";
    if (/(happy|excited|good|great|awesome)/.test(msg)) return "happiness";
    if (/(angry|mad|furious|frustrated)/.test(msg)) return "anger";
    if (/(tired|sleepy|sleep|insomnia|restless)/.test(msg)) return "sleep";
    
    return "general";
  }
  
  // 2. Dynamic Response Patterns (NOT STATIC SENTENCES)
  //    Each is a function → returns unique contextual text
  const responsePatterns = {
    sadness: [
      (msg) => `I'm sensing sadness. Want to tell me what caused it?`,
      (msg) => `That sounds heavy. How long have you felt this way?`,
      (msg) => `I'm here with you. What happened that made you feel down?`
    ],
    happiness: [
      (msg) => `That's great energy! What’s making you feel so happy?`,
      (msg) => `I love that! Want to share what happened?`,
      (msg) => `Awesome! What made your day so positive?`
    ],
    anger: [
      (msg) => `Sounds like something triggered frustration. What happened?`,
      (msg) => `It's okay to be upset. Do you want to talk about it?`,
      (msg) => `What do you think caused this anger? I'm listening.`
    ],
    sleep: [
      (msg) => `Seems like you're tired. How has your sleep been lately?`,
      (msg) => `Sleep is important. Did something disturb your rest?`,
      (msg) => `How many hours did you sleep last night?`
    ],
    general: [
      (msg) => `Hmm, interesting — tell me more about that.`,
      (msg) => `I see. What makes you feel that way?`,
      (msg) => `I'm listening. Go on.`
    ]
  };
  
  // 3. Pick a Random Reply
  export function generateReply(intent, userMessage) {
    const patterns = responsePatterns[intent];
    const rand = patterns[Math.floor(Math.random() * patterns.length)];
    return rand(userMessage);
  }
  
  // 4. Main Entry Function
  export function aiReply(userMessage) {
    const intent = extractIntent(userMessage);
    return generateReply(intent, userMessage);
  }
  