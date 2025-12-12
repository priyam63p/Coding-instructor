import { GoogleGenAI } from "https://cdn.jsdelivr.net/npm/@google/genai@1.32.0/+esm";

const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: "AIzaSyCaxLCwzYm3gkwWlvvQ2KcNFtuFBabWg_I",
});

// Create chat session
const chat = ai.chats.create({
  model: "gemini-2.5-flash",
  config: {
    systemInstruction: `Role:
You are an expert Programming Tutor and Senior Software Engineer. Your goal is not just to provide code, but to ensure the user deeply understands the logic, architecture, and "why" behind every solution.

Strict Domain Constraints:
Coding Only: You strictly answer questions related to programming, computer science, software engineering, and system design.
Refusal Protocol: If a user asks a non-coding question (e.g., general knowledge, creative writing), politely but firmly state: "I specialize exclusively in programming problems. Please ask me a coding-related question so I can help you effectively."

### Pedagogical Methodology (First Principles):
1.  Deconstruction: Do not just paste code immediately. First, break the problem down into its fundamental truths and basic logic blocks.
2.  Concept over Syntax Explain the underlying concept (e.g., "Memory Allocation" or "Recursion") before diving into the syntax.
3.  Analogy & Context Use simple, real-world analogies to explain abstract concepts when appropriate.
4.  Best Practices Always provide code that is clean, modular, highly readable, and adheres to industry standards (DRY principles).
 Response Format:
1.  The Logic: A brief explanation of the approach using First Principles.
2.  The Code: Syntax-highlighted, commented code blocks.
3.  The "Why": A short breakdown of why this specific solution is efficient.`,
  },
});

// Add message to UI
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";

  contentDiv.innerHTML = formatMessage(text);

  messageDiv.appendChild(contentDiv);
  chatMessages.appendChild(messageDiv);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Format message with code highlighting
function formatMessage(text) {
  text = text.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(/\n/g, "<br>");
  return text;
}

// Show typing indicator
function showTyping() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "message assistant";
  typingDiv.id = "typingIndicator";

  typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTyping() {
  const typingIndicator = document.getElementById("typingIndicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Handle send message
async function handleSend() {
  const message = userInput.value.trim();

  if (!message) return;

  userInput.disabled = true;
  sendBtn.disabled = true;

  addMessage(message, "user");
  userInput.value = "";

  showTyping();

  try {
    // CORRECTED: Pass object with message property
    const response = await chat.sendMessage({
      message: message, // Wrap in object
    });

    removeTyping();
    addMessage(response.text, "assistant");
  } catch (error) {
    removeTyping();
    addMessage("Sorry, something went wrong: " + error.message, "assistant");
    console.error("Error:", error);
  }

  userInput.disabled = false;
  sendBtn.disabled = false;
  userInput.focus();
}

// Event listeners
sendBtn.addEventListener("click", handleSend);

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSend();
  }
});
