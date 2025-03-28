import React, { useEffect, useState } from "react";
import LeftSidebar from "../../components/feed/LeftSidebar";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://newsdata.io/api/1/news?country=np&apikey=pub_76901141da7f65e3fe24fd2bbc1594bae907a"
        );
        const data = await response.json();
        setNews(data.results || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Sidebar */}
        <div className="col-md-3">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <div className="col-md-8 mt-3">
          <h3 className="mb-4">Latest Nepali News</h3>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading news...</span>
              </div>
            </div>
          ) : news.length === 0 ? (
            <p className="text-muted">No news available.</p>
          ) : (
            <div className="row g-3">
              {news.slice(0, 6).map((article, index) => (
                <div key={index} className="col-md-6">
                  <div className="card shadow-sm h-100">
                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt="News"
                        className="card-img-top"
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          {article.title}
                        </a>
                      </h5>
                      <p className="text-muted small mb-2">
                        {new Date(article.pubDate).toLocaleString()}
                      </p>
                      <p className="card-text flex-grow-1">
                        {article.description || "No description available."}
                      </p>
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm mt-auto"
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
