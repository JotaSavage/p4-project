import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Card from './Components/card';
import ArticlePage from './Components/ArticlePage';
import Signup from './Components/Signup';
import Login from './Components/Login';

function App() {
  const [articles, setArticles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/news')
      .then((response) => response.json())
      .then((data) => setArticles(data))
      .catch((error) => {
        console.error('Error fetching articles:', error);
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
      setIsAuthenticated(true);
    })
    .catch(error => {
      console.error('Error during login:', error);
    });
  };

  // This function no longer needs to handle navigation.
  const handleSignup = (username, password) => {
    // Return the fetch promise so that we can use .then() in the Signup component
    return fetch('http://127.0.0.1:5555/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => {
      if (!response.ok) {
        // If we don't get a successful response, throw an error to be caught by .catch()
        throw new Error('Signup failed');
      }
      return response.json();
    })
    .then(data => {
      setIsAuthenticated(true);
      // You can perform additional actions here if needed
    });
    // Note: We don't catch the error here so that it can be caught in the Signup component
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Signup onSignup={handleSignup} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/data" element={isAuthenticated ? <Card articles={articles} /> : <Navigate to="/signup" />} />
          <Route path="/article/:articleId" element={isAuthenticated ? <ArticlePage articles={articles} /> : <Navigate to="/signup" />} />
          {/* Other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
