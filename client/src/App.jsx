import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Card from './Components/card';
import ArticlePage from './Components/ArticlePage';
import Signup from './Components/Signup';
import Login from './Components/Login';

function App() {
  const [articles, setArticles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch articles from the actual backend API endpoint once it's implemented
  useEffect(() => {
    fetch('http://127.0.0.1:5555/news') // Update this endpoint as needed
      .then((response) => response.json())
      .then((data) => setArticles(data))
      .catch((error) => {
        console.error('Error fetching articles:', error);
        // Handle error case here
      });
  }, []);

  const handleLogin = (username, password) => {
    fetch('http://127.0.0.1:5555/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    })
    .then(data => {
      setIsAuthenticated(true); // Update authentication state
    })
    .catch(error => {
      console.error('Error during login:', error);
      // Handle login error case here
    });
  };

  const handleSignup = (username, password) => {
    fetch('http://127.0.0.1:5555/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      return response.json();
    })
    .then(data => {
      setIsAuthenticated(true); // Update authentication state
    })
    .catch(error => {
      console.error('Error during signup:', error);
      // Handle signup error case here
    });
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
          <Route path="/data" element={isAuthenticated ? <Card articles={articles} /> : <Navigate to="/" />} />
          <Route path="/article/:articleId" element={isAuthenticated ? <ArticlePage articles={articles} /> : <Navigate to="/" />} />
          {/* Other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
