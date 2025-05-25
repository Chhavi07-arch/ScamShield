import React, { useEffect, useRef, useCallback, useState } from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '../ui/card';

const NewsCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    dragFree: true,
    containScroll: 'trimSnaps',
    align: 'start',
    speed: 30
  });
  const autoplayRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [emblaApi]);
  
  const autoplay = useCallback((delay = 4000) => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
    }
    
    autoplayRef.current = setTimeout(() => {
      if (emblaApi) {
        setIsTransitioning(true);
        emblaApi.scrollNext();
        setTimeout(() => setIsTransitioning(false), 500);
        autoplay(delay);
      }
    }, delay);
  }, [emblaApi]);
  
  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    // Start autoplay when component mounts and emblaApi is available
    autoplay(4000);
    
    return () => {
      // Clean up
      emblaApi.off('select', onSelect);
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, [emblaApi, onSelect, autoplay]);

  // Function to load fallback data from local JSON file
  const loadFallbackData = async () => {
    try {
      const response = await fetch('/scam-news.json');
      if (!response.ok) {
        throw new Error('Failed to load local news data');
      }
      
      const data = await response.json();
      
      // Add severity to the local data
      const localNews = data.news.map(item => ({
        ...item,
        severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        date: new Date(item.date).toLocaleDateString()
      }));
      
      setNews(localNews);
      setUsingFallbackData(true);
      return true;
    } catch (localErr) {
      console.error('Error fetching local news:', localErr);
      return false;
    }
  };

  // Fetch news from NewsAPI.org
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Get API key from environment variable
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        
        if (!apiKey) {
          throw new Error('News API key not found');
        }
        
        const response = await fetch(`https://newsapi.org/v2/everything?q=scam OR fraud OR phishing OR cybersecurity&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`);
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your API key and try again.');
        }

        if (response.status === 429) {
          throw new Error('Too many requests. Rate limit exceeded.');
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch news. Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          // Transform the API response to match our expected format
          const transformedNews = data.articles.map((article) => {
            // Determine severity based on keywords in title or description
            let severity = 'low';
            const combinedText = ((article.title || '') + ' ' + (article.description || '')).toLowerCase();
            
            if (combinedText.includes('alert') || 
                combinedText.includes('warning') || 
                combinedText.includes('urgent') ||
                combinedText.includes('fraud') ||
                combinedText.includes('hack')) {
              severity = 'medium';
            }
            
            if (combinedText.includes('phishing') || 
                combinedText.includes('scam') || 
                combinedText.includes('attack') ||
                combinedText.includes('steal') ||
                combinedText.includes('breach')) {
              severity = 'high';
            }
            
            return {
              title: article.title || 'No title available',
              description: article.description || article.content || 'No description available',
              date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unknown date',
              severity: severity,
              source: article.source?.name || 'Unknown source',
              url: article.url || ''
            };
          });
          
          setNews(transformedNews);
          setUsingFallbackData(false);
        } else {
          // No articles returned, try fallback
          throw new Error('No articles returned from API');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err.message);
        
        // Fallback to local data if API fails
        const fallbackSuccess = await loadFallbackData();
        
        if (!fallbackSuccess) {
          setError('Failed to load news content. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 dashboard-card">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Latest Scam Alerts</h3>
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-gray-500">Loading latest scam alerts...</p>
        </div>
      </div>
    );
  }

  if (error && news.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 dashboard-card">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Latest Scam Alerts</h3>
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 dashboard-card">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Latest Scam Alerts</h3>
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-gray-500">No scam alerts available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden dashboard-card">
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Latest Scam Alerts</h3>
        
        <div className="relative overflow-hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {news.map((item, index) => (
                <div 
                  key={index} 
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4"
                >
                  <div className={`p-1 h-full ${activeIndex === index ? 'news-card-animate' : ''}`}>
                    <Card className={`border-l-4 h-full ${
                      item.severity === 'high' ? 'border-l-red-500' : 
                      item.severity === 'medium' ? 'border-l-yellow-500' : 
                      'border-l-blue-500'
                    } transition-all duration-300 hover:shadow-md hover:-translate-y-1`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full ${
                            item.severity === 'high' ? 'bg-red-100' : 
                            item.severity === 'medium' ? 'bg-yellow-100' : 
                            'bg-blue-100'
                          } mr-3`}>
                            <AlertTriangle className={`h-4 w-4 ${
                              item.severity === 'high' ? 'text-red-500' : 
                              item.severity === 'medium' ? 'text-yellow-500' : 
                              'text-blue-500'
                            }`} />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-semibold text-gray-800">{item.title}</CardTitle>
                            <CardDescription className="text-xs text-gray-500">{item.date} • {item.source}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.severity === 'high' ? 'bg-red-100 text-red-800' : 
                          item.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {item.severity === 'high' ? 'High Risk' : 
                           item.severity === 'medium' ? 'Medium Risk' : 
                           'Low Risk'}
                        </span>
                        {item.url && (
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-primary-600 hover:text-primary-800 font-medium flex items-center"
                          >
                            Read more
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {news.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === activeIndex 
                    ? 'w-6 bg-primary-600 active-indicator' 
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 text-center">
        <p className="text-xs text-gray-700">
          <span className="font-medium">Source:</span> {usingFallbackData ? 'Using cached scam news data' : 'Live scam news powered by NewsAPI.org'}
        </p>
      </div>
    </div>
  );
};

export default NewsCarousel; 