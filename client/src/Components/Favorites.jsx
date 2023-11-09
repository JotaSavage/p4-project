import React, { useState, useEffect } from 'react';

const Favorites = () => {
  const [favoriteArticles, setFavoriteArticles] = useState([]);

  useEffect(() => {
    // Fetch the user's favorite articles from the server
    fetch('http://127.0.0.1:5555/favorites', {
      method: 'GET',
      credentials: 'include', // if you're using sessions
    })
      .then((response) => response.json())
      .then((data) => setFavoriteArticles(data))
      .catch((error) => {
        console.error('Error fetching favorite articles:', error);
      });
  }, []);

  return (
    <div>
      <h2>Favorites</h2>
      <ul>
        {favoriteArticles.map((article) => (
          <li key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
            {/* Add other information you want to display */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
