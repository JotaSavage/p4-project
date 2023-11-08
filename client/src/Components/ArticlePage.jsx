import React from 'react';
import { useParams } from 'react-router-dom';

function ArticlePage({ articles }) {
  let { articleId } = useParams();
  const article = articles.find(a => a.id.toString() === articleId);

  // TODO: Add any necessary state or props for handling favorites

  const handleFavorite = (articleId) => {
    // TODO: Implement the backend logic for favoriting an article here
    console.log(`Article with ID ${articleId} has been favorited!`);
    // This is where the backend POST request would be sent
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

