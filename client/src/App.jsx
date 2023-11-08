import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Card from './Components/card';
import ArticlePage from './Components/ArticlePage';
import Signup from './Components/Signup';
import Login from './Components/Login';

function App() {
  const [articles, setArticles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch articles from json-server when the component mounts
  useEffect(() => {
    // TODO: Replace with your actual backend API endpoint once it's implemented
    fetch('http://localhost:3000/data')
      .then((response) => response.json())
      .then((data) => setArticles(data))
      .catch((error) => {
        console.error('Error fetching articles:', error);
        // Handle error case here
      });
  }, []);

  const handleLogin = (username, password) => {
    // TODO: Replace with actual backend login logic
    setIsAuthenticated(true); // Simulated authentication
  };

  const handleSignup = (username, password) => {
    // TODO: Implement actual backend signup logic
    // For now, we're simulating a signup by posting to json-server
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not complete signup');
      }
      return response.json();
    })
    .then(data => {
      // Simulate authentication upon successful signup
      setIsAuthenticated(true);
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

