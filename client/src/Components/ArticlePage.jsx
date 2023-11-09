import React from 'react';
import { useParams } from 'react-router-dom';

function ArticlePage({ articles }) {
  let { articleId } = useParams();
  const article = articles.find(a => a.id.toString() === articleId);

  // TODO: Add any necessary state or props for handling favorites

  const handleFavorite = (articleId) => {
    fetch(`http://127.0.0.1:5555/news/${articleId}/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Favoriting failed');
        }
        return response.json();
      })
      .then((data) => {
        console.log(`Article with ID ${articleId} has been favorited!`);
      })
      .catch((error) => {
        console.error('Error during favoriting:', error);
        // Display an error message to the user
      });
  };

  if (!article) {
    return <p>Article not found!</p>;
  }

  return (
    <div className="ArticlePage">
      <header className="ArticlePage-header">
        <div className="ArticlePage-meta">
          <span className="ArticlePage-author">{article.author}</span>
          <span className="ArticlePage-publication">{article.publication}</span>
        </div>
        <h1 className="ArticlePage-title">{article.title}</h1>
        <div className="ArticlePage-date">{article.date_published}</div>
      </header>
      <section className="ArticlePage-content">
        <p>{article.content}</p>
      </section>
      {/* Favorite button */}
      <button onClick={() => handleFavorite(article.id)}>Favorite</button>
    </div>
  );
}

export default ArticlePage;

