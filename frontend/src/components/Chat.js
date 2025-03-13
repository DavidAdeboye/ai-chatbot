import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaPlus, FaPaperPlane } from 'react-icons/fa';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessage = {
      content: input,
      timestamp: new Date().toISOString(),
      sender: 'user'
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: messages
        })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        content: data.response,
        timestamp: new Date().toISOString(),
        sender: 'bot'
      }]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="app-container">
      <button 
        className="menu-button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars />
      </button>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="new-chat-btn">
          <FaPlus />
          <span>New chat</span>
        </button>
      </div>

      <div className="main-content">
        <div className="chat-container" ref={chatRef}>
          {messages.length === 0 ? (
            <div className="empty-state">
              <div>
                <h1>How can I help you today?</h1>
                <p>Start a conversation by typing a message below.</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}
              >
                {message.content}
              </div>
            ))
          )}
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message Gemini..."
              className="message-input"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="send-button"
            >
              <FaPaperPlane />
            </button>
          </div>
          <div className="disclaimer">
            Gemini may produce inaccurate information. Consider checking important information.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;