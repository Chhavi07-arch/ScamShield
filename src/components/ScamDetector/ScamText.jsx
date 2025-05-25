import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ScamText = () => {
  const [message, setMessage] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const analyzeText = (e) => {
    e.preventDefault();
    
    // This is a placeholder for actual text analysis logic
    // In a real app, this would use NLP or connect to a backend
    const suspiciousTerms = [
      'urgent', 'account suspended', 'verify now', 'click here', 'gift card',
      'won', 'prize', 'claim now', 'password', 'security alert'
    ];
    
    const suspiciousURLPatterns = [
      'bit.ly', 'goo.gl', 'tinyurl', 'amzn', 'tracking', 'secure-login'
    ];
    
    const lowercaseMsg = message.toLowerCase();
    const foundTerms = suspiciousTerms.filter(term => lowercaseMsg.includes(term.toLowerCase()));
    const foundURLs = suspiciousURLPatterns.filter(url => lowercaseMsg.includes(url.toLowerCase()));
    
    const riskScore = (foundTerms.length * 10) + (foundURLs.length * 15);
    const riskLevel = riskScore > 30 ? 'high' : riskScore > 15 ? 'medium' : 'low';
    
    setAnalysis({
      riskLevel,
      suspiciousElements: [
        ...foundTerms.map(term => `Suspicious term: "${term}"`),
        ...foundURLs.map(url => `Suspicious URL pattern: "${url}"`)
      ]
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-primary-800 mb-4">Text Message Analyzer</h3>
      
      <form onSubmit={analyzeText} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Paste Text Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Paste the suspicious text message here..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
        >
          Analyze Message
        </button>
      </form>

      {analysis && (
        <div className="mt-6 space-y-4">
          <div className={`p-4 rounded-md ${
            analysis.riskLevel === 'high' ? 'bg-red-50' :
            analysis.riskLevel === 'medium' ? 'bg-yellow-50' : 'bg-green-50'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {analysis.riskLevel === 'high' ? (
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                ) : analysis.riskLevel === 'medium' ? (
                  <Info className="h-5 w-5 text-yellow-400" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  analysis.riskLevel === 'high' ? 'text-red-800' :
                  analysis.riskLevel === 'medium' ? 'text-yellow-800' : 'text-green-800'
                }`}>
                  {analysis.riskLevel === 'high' ? 'High Risk - Likely Scam' :
                   analysis.riskLevel === 'medium' ? 'Medium Risk - Potentially Suspicious' : 'Low Risk - Likely Safe'}
                </h3>
              </div>
            </div>
          </div>

          {analysis.suspiciousElements.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Suspicious Elements Detected:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.suspiciousElements.map((element, index) => (
                  <li key={index} className="text-sm text-gray-600">{element}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScamText; 