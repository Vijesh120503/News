import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = process.env.REACT_API_KEY;
const API_URL = "https://gnews.io/api/v4/search";

function App() {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState("technology");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews(category);
  }, [category]);

  const fetchNews = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_URL, {
        params: {
          q: query || category,
          lang: "en",
          token: API_KEY,
          max: 20,
        },
      });

      setNews(response.data.articles);
      setSearch(""); // Clear input after search
    } catch (err) {
      setError("Failed to load news. Check API key or limit reached.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>📰 News</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => fetchNews(search)} disabled={loading} className={loading ? "loading-button" : ""}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      <div className="categories">
        {["technology", "business", "sports", "health", "entertainment"].map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      <div className="news-container">
        {news.length > 0 ? (
          news.map((article, index) => (
            <div key={index} className="news-card">
              {article.image && <img src={article.image} alt="News" />}
              <div className="news-content">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <a href={article.url} target="_self">
                  Read more →
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No news found. Try another search.</p>
        )}
      </div>
    </div>
  );
}

export default App;
