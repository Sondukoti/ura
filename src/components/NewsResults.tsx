import { type ReactElement } from 'react';
import Image from 'next/image';
import styles from '@/styles/NewsResults.module.css';

interface Article {
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
  articles: Article[];
  loading: boolean;
}

const NewsResults = ({ articles, loading }: NewsResultsProps): ReactElement => {
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
        <div key={`${article.title}-${index}`} className={styles.newsCard}>
          {article.urlToImage && (
            <div className={styles.newsImage}>
              <Image
                src={article.urlToImage}
                alt={article.title}
                width={400}
                height={200}
                layout="responsive"
                objectFit="cover"
                priority={index < 4} // Load first 4 images immediately
              />
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