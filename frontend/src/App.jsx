import { useState, useRef, useEffect, useCallback } from "react";
import { askAssistant } from "./services/api";
import useSpeechRecognition from "./hooks/useSpeechRecognition";
import useSpeechSynthesis from "./hooks/useSpeechSynthesis";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm Sir Ahmad's AI assistant. You can ask me about Sir Ahmad, AhmiXen AI, and his work.",
    },
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);

  const messagesEndRef = useRef(null);

  const {
    speaking,
    supported: speechSupported,
    speak,
    stopSpeaking,
  } = useSpeechSynthesis();

  const handleSubmit = useCallback(async (e, voiceInput = false) => {
    e?.preventDefault();

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

      if (voiceInput && speechSupported) {
        speak(answer);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I couldn't connect to the server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [question, loading, speechSupported, speak]);

  const handleVoiceResult = useCallback((transcript) => {
    setQuestion(transcript);
  }, []);

  const {
    supported: recognitionSupported,
    listening,
    error: speechError,
    startListening,
    stopListening,
  } = useSpeechRecognition(handleVoiceResult);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (question && !listening && !loading && voiceMode) {
      handleSubmit(null, true);
    }
  }, [question, listening, loading, voiceMode, handleSubmit]);

  function toggleVoice() {
    if (listening) {
      stopListening();
      return;
    }

    stopSpeaking();
    setVoiceMode(true);
    startListening();
  }

  function stopVoice() {
    stopListening();
    stopSpeaking();
    setVoiceMode(false);
  }

  return (
    <main className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">A</div>
          <div>
            <h1>Knowledge Assistant</h1>
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
          <div
            className={`orb ${listening ? "listening" : ""} ${
              speaking ? "speaking" : ""
            }`}
          >
            <div className="orb-inner"></div>
          </div>

          <h2>Meet Sir Ahmad's AI Assistant</h2>

          <p>
            Ask questions about Sir Ahmad, his work, AhmiXen AI,
            and his professional platforms.
          </p>

          <div className="voice-status">
            {listening
              ? "Listening..."
              : loading
              ? "Thinking..."
              : speaking
              ? "Speaking..."
              : "Ready to assist"}
          </div>
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

          <div ref={messagesEndRef} />
        </div>

        <form
          className="input-area"
          onSubmit={(e) => handleSubmit(e, false)}
        >
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

        <div className="voice-controls">
          <button
            className={`mic-button ${listening ? "active" : ""}`}
            onClick={toggleVoice}
            disabled={!recognitionSupported || loading}
            type="button"
          >
            {listening ? "Stop Listening" : "Start Speaking"}
          </button>

          {(listening || speaking || voiceMode) && (
            <button
              className="stop-button"
              onClick={stopVoice}
              type="button"
            >
              Stop
            </button>
          )}
        </div>

        {!recognitionSupported && (
          <p className="error-message">
            Speech recognition is not supported in this browser.
            Try Google Chrome.
          </p>
        )}

        {!speechSupported && (
          <p className="error-message">
            Speech synthesis is not supported in this browser.
          </p>
        )}

        {speechError && (
          <p className="error-message">{speechError}</p>
        )}

        <p className="disclaimer">
          Responses are generated exclusively from Sir Ahmad's supplied
          information.
        </p>
      </section>
    </main>
  );
}

export default App;