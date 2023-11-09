import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ArticlePage from './Components/ArticlePage';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Card from './Components/Card'; // Assuming 'Card' is a component for displaying articles

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

  const setAuth = (auth) => {
    setIsAuthenticated(auth);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/data" element={isAuthenticated ? <Card articles={articles} /> : <Navigate to="/login" />} />
          <Route path="/article/:articleId" element={isAuthenticated ? <ArticlePage articles={articles} /> : <Navigate to="/login" />} />
          {/* Additional routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
