import { useState, useEffect } from 'react';
import styles from '@/styles/Dashboard.module.css';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsResultsProps {
  articles: NewsArticle[];
  loading: boolean;
}

const NewsResults: FC<NewsResultsProps> = ({ articles, loading }) => {
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <i className="fas fa-spinner fa-spin"></i>
        Loading news...
      </div>
    );
  }

  return (
    <div className={styles.newsGrid}>
      {articles.map((article, index) => (
        <div key={index} className={styles.newsCard}>
          {article.urlToImage && (
            <div className={styles.newsImage}>
              <img src={article.urlToImage} alt={article.title} />
            </div>
          )}
          <div className={styles.newsContent}>
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <div className={styles.newsFooter}>
              <span>{article.source.name}</span>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.readMore}
            >
              Read More
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsResults; 