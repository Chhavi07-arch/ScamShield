import React, { useState, useEffect } from 'react';

const NewsTicker = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/scam-news.json');
        const data = await response.json();
        setNews(data.news);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading latest scam alerts...</div>;
  }

  return (
    <div className="bg-primary-50 border-l-4 border-primary-600 p-4 rounded-md shadow-sm">
      <h3 className="font-bold text-primary-800 mb-2">Latest Scam Alerts</h3>
      <ul className="space-y-2">
        {news.map((item) => (
          <li key={item.id} className="text-sm text-gray-800">
            <span className="font-semibold">{item.title}</span> - {item.description}
            <div className="text-xs text-gray-700 mt-1">
              {item.date} | Source: {item.source}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsTicker; 