"use client";

import { useState, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(crypto.randomUUID());
  const [audioPlayer] = useState(new Audio());
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    try {
      setLoading(true);
      const userMessage = input;
      setInput("");
      setMessages((prev) => [...prev, { type: "user", content: userMessage }]);

      const response = await axios.post("http://localhost:3000/api/chat", {
        message: userMessage,
        sessionId,
      });

      setMessages((prev) => [...prev, { type: "assistant", content: response.data.response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { type: "error", content: "An error occurred. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <button className="new-chat-btn">+ New Chat</button>
        <div className="history">{/* Chat history */}</div>
        <div className="sidebar-footer">Made by <a href="https://github.com/DavidAdeboye/">Metaldness</a></div>
      </aside>

      <main className="main-content">
        <div className="chat-container">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <h1>Virdict AI</h1>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-content">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="input-container">
          <form onSubmit={handleSubmit} className="input-wrapper">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Virdict AI..."
              rows="1"
              onClick={true}
              className="message-input"
            />
            <button type="submit" className="send-btn" disabled={!input.trim() || loading}>
              ➤
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
