import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, Loader, AlertCircle, Link } from 'lucide-react';

const MessageAnalyzer = () => {
  const [message, setMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Get API key from environment variables
    const key = import.meta.env.VITE_MESSAGE_ANALYSIS_API_KEY || '';
    setApiKey(key);
  }, []);

  // Function to call Gemini API with the message for analysis
  const analyzeWithGemini = async (messageText) => {
    if (!apiKey) {
      throw new Error('API key not available');
    }

    // Construct the prompt for Gemini
    const prompt = `
      Analyze the following message for potential scam indicators. 
      The message is: "${messageText}"
      
      Please provide a structured analysis with the following information:
      1. Risk level (High, Medium, or Low)
      2. Risk score (0-100)
      3. Potential scam type (if applicable)
      4. Key suspicious indicators detected
      5. Brief explanation of why this might be a scam
      6. Suggestions for how to respond
      
      Format your response as a JSON object with the following structure:
      {
        "riskLevel": "High/Medium/Low",
        "riskScore": 75,
        "scamType": "Banking Scam/Prize Scam/etc.",
        "indicators": {
          "containsUrgency": true/false,
          "containsFinancial": true/false,
          "containsLinks": true/false,
          "containsPersonalInfo": true/false,
          "containsThreats": true/false,
          "containsMisspellings": true/false
        },
        "explanation": "Brief explanation of the analysis",
        "suggestedResponse": "What the user should do"
      }
    `;

    try {
      // Call Gemini API using the format from the example
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the response text from Gemini
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      
      // Parse the JSON from the response
      let jsonStart = responseText.indexOf('{');
      let jsonEnd = responseText.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('Could not parse JSON response from Gemini');
      }

      const jsonResponse = responseText.substring(jsonStart, jsonEnd);
      const analysisResult = JSON.parse(jsonResponse);
      
      // Add highlighting and message to the result
      analysisResult.message = messageText;
      analysisResult.highlightedMessage = highlightSuspiciousContent(messageText, analysisResult.indicators);
      
      // Add suspicious URLs if there are any
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = messageText.match(urlRegex) || [];
      
      analysisResult.suspiciousUrls = urls.map(url => ({
        url,
        isSuspicious: analysisResult.riskLevel !== 'Low'
      }));

      return analysisResult;
    } catch (error) {
      console.error("Error analyzing with Gemini:", error);
      throw error;
    }
  };

  // Function to perform local analysis as a fallback
  const performLocalAnalysis = (messageText) => {
    // Check for common scam indicators
    const containsUrgency = /urgent|immediately|act now|limited time/i.test(messageText);
    const containsFinancial = /money|payment|credit card|bank|account|cash|funds/i.test(messageText);
    const containsLinks = /http|www|\.[a-z]{2,}/i.test(messageText);
    const containsPersonalInfo = /ssn|social security|password|login|credentials/i.test(messageText);
    const containsThreats = /terminate|suspend|cancel|close|report|police/i.test(messageText);
    const containsMisspellings = /[a-z]{3,}ing\s+[a-z]{3,}ing\s+/i.test(messageText) || /[a-z]{2,}ed\s+[a-z]{2,}ed\s+/i.test(messageText);
    
    // Calculate risk score based on indicators
    let riskScore = 0;
    if (containsUrgency) riskScore += 25;
    if (containsFinancial) riskScore += 20;
    if (containsLinks) riskScore += 15;
    if (containsPersonalInfo) riskScore += 30;
    if (containsThreats) riskScore += 25;
    if (containsMisspellings) riskScore += 15;
    
    riskScore = Math.min(100, riskScore);
    
    // Determine risk level
    let riskLevel = 'Low';
    if (riskScore > 70) riskLevel = 'High';
    else if (riskScore > 40) riskLevel = 'Medium';
    
    // Extract potential scam type
    let scamType = 'Unknown';
    if (/bank|account|verify/i.test(messageText)) scamType = 'Banking Scam';
    else if (/delivery|package|shipment/i.test(messageText)) scamType = 'Delivery Scam';
    else if (/prize|won|lottery|winner/i.test(messageText)) scamType = 'Prize Scam';
    else if (/tax|irs|government/i.test(messageText)) scamType = 'Tax Scam';
    else if (/virus|security|computer|device/i.test(messageText)) scamType = 'Tech Support Scam';
    
    // Extract URLs if any
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = messageText.match(urlRegex) || [];
    
    // Create result object
    return {
      message: messageText,
      riskScore,
      riskLevel,
      scamType: riskScore > 30 ? scamType : 'Not a scam',
      indicators: {
        containsUrgency,
        containsFinancial,
        containsLinks: containsLinks,
        containsPersonalInfo,
        containsThreats,
        containsMisspellings
      },
      explanation: riskScore > 70 
        ? "This message contains multiple high-risk indicators commonly associated with scams." 
        : riskScore > 40 
        ? "This message contains some suspicious elements that might indicate a scam." 
        : "This message doesn't contain strong indicators of being a scam.",
      suggestedResponse: riskScore > 70 
        ? "Do not respond or click any links. If it claims to be from a legitimate company, contact them directly through official channels." 
        : riskScore > 40 
        ? "Exercise caution. Verify the sender through official channels before responding or clicking links." 
        : "The message appears to be legitimate, but always be cautious with unexpected communications.",
      suspiciousUrls: urls.map(url => ({
        url,
        isSuspicious: riskScore > 40
      })),
      highlightedMessage: highlightSuspiciousContent(messageText, {
        containsUrgency,
        containsFinancial,
        containsLinks,
        containsPersonalInfo,
        containsThreats,
        containsMisspellings
      }),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (message.trim().length < 10) {
      setError('Please enter a longer message for accurate analysis');
      return;
    }
    
    setError('');
    setIsAnalyzing(true);
    
    try {
      let analysisResult;
      
      if (apiKey) {
        try {
          // Try to use Gemini AI API first
          analysisResult = await analyzeWithGemini(message);
        } catch (apiError) {
          console.error("API Error, falling back to local analysis:", apiError);
          // If API fails, fall back to local analysis
          analysisResult = performLocalAnalysis(message);
        }
      } else {
        console.log("No API key available, using local analysis");
        // If no API key, use local analysis
        analysisResult = performLocalAnalysis(message);
      }
      
      setResult(analysisResult);
      setIsAnalyzing(false);
      
    } catch (err) {
      console.error("Error during message analysis:", err);
      setError(`Failed to analyze the message: ${err.message}`);
      setIsAnalyzing(false);
    }
  };

  // Function to highlight suspicious content in the message
  const highlightSuspiciousContent = (text, indicators) => {
    // This is a simplified version - a real implementation would be more sophisticated
    let highlighted = text;
    
    // Highlight URLs
    if (indicators.containsLinks) {
      highlighted = highlighted.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<span class="text-red-600 font-medium">$1</span>'
      );
    }
    
    // Highlight urgent language
    if (indicators.containsUrgency) {
      highlighted = highlighted.replace(
        /(urgent|immediately|act now|limited time|deadline|expire)/gi,
        '<span class="text-orange-600 font-medium">$1</span>'
      );
    }
    
    // Highlight financial terms
    if (indicators.containsFinancial) {
      highlighted = highlighted.replace(
        /(money|payment|credit card|bank|account|cash|funds|deposit|transfer)/gi,
        '<span class="text-blue-600 font-medium">$1</span>'
      );
    }
    
    // Highlight personal info requests
    if (indicators.containsPersonalInfo) {
      highlighted = highlighted.replace(
        /(ssn|social security|password|login|credentials|id|identity|verification)/gi,
        '<span class="text-purple-600 font-medium">$1</span>'
      );
    }
    
    // Highlight threats
    if (indicators.containsThreats) {
      highlighted = highlighted.replace(
        /(terminate|suspend|cancel|close|block|report|police|legal|lawsuit|arrest)/gi,
        '<span class="text-red-800 font-medium">$1</span>'
      );
    }
    
    return highlighted;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="bg-primary-100 p-3 rounded-full mr-4">
          <MessageSquare className="h-6 w-6 text-primary-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Message/Text Scam Analyzer</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Analyze suspicious text messages to identify potential scams. Our AI-powered system detects common scam patterns, urgent language, suspicious links, and more.
      </p>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Paste the suspicious message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter the suspicious text message here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={5}
            required
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          {!apiKey && (
            <p className="mt-1 text-xs text-amber-600">
              Note: Using local analysis because no valid API key is provided.
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isAnalyzing}
          className="bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 transition-colors disabled:bg-primary-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isAnalyzing ? (
            <>
              <Loader className="animate-spin h-4 w-4 mr-2" />
              Analyzing...
            </>
          ) : (
            'Analyze Message'
          )}
        </button>
      </form>
      
      {result && (
        <div className={`border rounded-lg p-4 ${
          result.riskLevel === 'High' ? 'bg-red-50 border-red-200' :
          result.riskLevel === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
          'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center mb-3">
            {result.riskLevel === 'High' ? (
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            ) : result.riskLevel === 'Medium' ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              {result.riskLevel === 'High' ? 'High Risk - Likely Scam Message' :
               result.riskLevel === 'Medium' ? 'Medium Risk - Suspicious Elements Detected' :
               'Low Risk - Likely Legitimate Message'}
            </h3>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Analysis Results</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-700">Risk Score</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div 
                    className={`h-2.5 rounded-full ${
                      result.riskScore > 70 ? 'bg-red-500' :
                      result.riskScore > 40 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} 
                    style={{ width: `${result.riskScore}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-gray-700">{result.riskScore}/100</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Potential Scam Type</p>
                <p className="font-medium text-gray-900">{result.scamType}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">Suspicious Indicators</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  {result.indicators.containsUrgency ? (
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  )}
                  <span className="text-sm text-gray-700">
                    {result.indicators.containsUrgency ? 'Contains urgent language' : 'No urgent language detected'}
                  </span>
                </div>
                <div className="flex items-center">
                  {result.indicators.containsFinancial ? (
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  )}
                  <span className="text-sm text-gray-700">
                    {result.indicators.containsFinancial ? 'Contains financial terms' : 'No financial terms detected'}
                  </span>
                </div>
                <div className="flex items-center">
                  {result.indicators.containsLinks ? (
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  )}
                  <span className="text-sm text-gray-700">
                    {result.indicators.containsLinks ? 'Contains links' : 'No links detected'}
                  </span>
                </div>
                <div className="flex items-center">
                  {result.indicators.containsPersonalInfo ? (
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  )}
                  <span className="text-sm text-gray-700">
                    {result.indicators.containsPersonalInfo ? 'Requests personal information' : 'No personal information requests detected'}
                  </span>
                </div>
                {result.indicators.containsThreats !== undefined && (
                  <div className="flex items-center">
                    {result.indicators.containsThreats ? (
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-700">
                      {result.indicators.containsThreats ? 'Contains threats or warnings' : 'No threats detected'}
                    </span>
                  </div>
                )}
                {result.indicators.containsMisspellings !== undefined && (
                  <div className="flex items-center">
                    {result.indicators.containsMisspellings ? (
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-700">
                      {result.indicators.containsMisspellings ? 'Contains suspicious language patterns' : 'Normal language patterns'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {result.suspiciousUrls.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">Suspicious URLs</p>
                <ul className="space-y-1">
                  {result.suspiciousUrls.map((urlItem, index) => (
                    <li key={index} className="flex items-center">
                      {urlItem.isSuspicious ? (
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      )}
                      <span className={`text-sm ${urlItem.isSuspicious ? 'text-red-600' : ''}`}>
                        {urlItem.url}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">Message Analysis</p>
              <div 
                className="text-sm p-3 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap text-gray-900"
                dangerouslySetInnerHTML={{ __html: result.highlightedMessage }}
              />
            </div>
            
            {result.explanation && (
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">Expert Analysis</p>
                <p className="text-sm p-3 bg-gray-50 rounded border border-gray-200 text-gray-900">
                  {result.explanation}
                </p>
              </div>
            )}
            
            {result.suggestedResponse && (
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">Recommended Action</p>
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-primary-500 mr-2" />
                  <p className="text-sm font-medium text-gray-900">
                    {result.suggestedResponse}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-6 text-xs text-gray-500">
        <p>Note: This tool uses advanced AI to analyze messages for scam indicators, but should not be considered 100% accurate. Always use your best judgment when dealing with suspicious messages.</p>
      </div>
    </div>
  );
};

export default MessageAnalyzer; 