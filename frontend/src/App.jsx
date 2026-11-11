import { useState, useRef, useEffect } from "react";
import { askAssistant } from "./services/api";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm Sir Ahmad's AI assistant. Ask me anything about Sir Ahmad, AhmiXen AI, or his work.",
    },
  ]);
  
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loading) return;
    
    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmedQuestion },
    ]);
    
    setQuestion("");
    setLoading(true);
    
    try {
      const answer = await askAssistant(trimmedQuestion);
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: answer },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant",  content: `Sorry, I couldn't connect to the server. ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <main className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">A</div>
          <div>
            <h1>Knowledge Assitant</h1>
            <span>Sir Ahmad's Personal Assistant</span>
          </div>
        </div>
        
        <div className="status">
          <span className="status-dot"></span>
          Online
        </div>
      </header>
      
      <section className="chat-container">
        <div className="intro">
          <div className="orb">
            <div className="orb-inner"></div>
          </div>
          
          <h2>Meet Sir Ahmad's AI Assistant</h2>
          <p>
            Ask questions about Sir Ahmad, his work, AhmiXen AI,
            and his professional platforms.
          </p>
        </div>
        
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role}`}
            >
              <div className="message-label">
                {message.role === "user" ? "You" : "Assistant"}
              </div>
              
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message assistant">
              <div className="message-label">Assistant</div>
              <div className="message-content typing">
                Thinking...
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form className="input-area" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ask something about Sir Ahmad..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
          />
          
          <button type="submit" disabled={loading || !question.trim()}>
            Send
          </button>
        </form>
        
        <p className="disclaimer">
          Responses are generated exclusively from Sir Ahmad's supplied
          information.
        </p>
      </section>
    </main>
  );
}

export default App;
