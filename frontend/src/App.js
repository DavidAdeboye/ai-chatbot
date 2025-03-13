import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Chat from './components/Chat';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <div className="app">
      {!isAuthenticated ? (
        <Auth setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />
      ) : (
        <>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          <Chat username={username} />
        </>
      )}
    </div>
  );
}

export default App; 