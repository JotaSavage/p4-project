import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';

async function handleFavorite(articleId) {
  try {
    const response = await fetch(`http://127.0.0.1:5555/news/${articleId}/favorite`, {
      method: 'POST',
      credentials: 'include', // if you're using sessions
      headers: {
        'Content-Type': 'application/json',
      },
      // If authentication is required, make sure to include the necessary headers or tokens
    });
    
    const data = await response.json();

    if (response.ok) {
      // Handle success, e.g., updating the state to reflect the favorite status
      console.log('Article favorited!', data);
    } else {
      throw new Error(data.message || 'Could not favorite the article');
    }
  } catch (error) {
    console.error('Favorite failed:', error);
  }
}

export default function Card({ articles, setAuth, isAuthenticated }) {
  return (
    <div className="main">
      {isAuthenticated && (
        <div className="buttons-container" style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <button onClick={() => setAuth(false)}>Logout</button>
          <Link to="/favorites">
            <button>Favorites</button>
          </Link>
        </div>
      )}
      <header className="App-header">
        <h1>Article Feed</h1>
      </header>
      {articles.map((article) => (
        <div key={article.id} className="Article">
          <div className="Article-image">
            <img src={article.article_image} alt={article.title} />
          </div>
          <div className="Article-content">
            <Link to={`/article/${article.id}`}>
              <h2>{article.title}</h2>
            </Link>
            <p><small>Published on: {article.date_published}</small></p>
            <p><small>By: {article.author}</small></p>
            <p>{article.content}</p>
            <button onClick={() => handleFavorite(article.id)}>Favorite</button>
          </div>
        </div>
      ))}
    </div>
  );
}