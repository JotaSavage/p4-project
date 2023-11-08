import React from 'react';
import { Link } from 'react-router-dom';

export default function Card({ articles }) {
  // TODO: Add any necessary state or props for handling favorites

  const handleFavorite = (articleId) => {
    // TODO: Implement the backend logic for favoriting an article here
    console.log(`Article with ID ${articleId} has been favorited!`);
    // This is where the backend POST request would be sent
  };

  
      {/* TODO: Implement favorite button logic here */}

      {/* TODO: Implement favorite button logic here */}
return (
    <div className="main">
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
            {/* Favorite button */}
            <button onClick={() => handleFavorite(article.id)}>Favorite</button>
          </div>
        </div>
      ))}
    </div>
  );
}


  