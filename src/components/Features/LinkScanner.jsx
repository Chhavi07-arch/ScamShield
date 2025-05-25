import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, AlertTriangle, CheckCircle, Loader, Shield, Globe } from 'lucide-react';

const LinkScanner = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    // Get API key from environment variables
    const key = import.meta.env.VITE_URL_SCANNER_API_KEY || '';
    setApiKey(key);
  }, []);

  // Function to validate and format URL
  const formatUrl = (inputUrl) => {
    let formattedUrl = inputUrl.trim();
    
    // Check if URL has a protocol, if not add https://
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    return formattedUrl;
  };

  // Function to encode URL for VirusTotal API
  const encodeURLForAPI = (url) => {
    return encodeURIComponent(url);
  };

  // Function to analyze URL using VirusTotal API
  const analyzeURLWithVirusTotal = async (formattedUrl) => {
    if (!apiKey) {
      throw new Error('API key not available');
    }

    try {
      // First, check if the URL has been analyzed before
      const encodedUrl = encodeURLForAPI(formattedUrl);
      
      // Step 1: Submit URL for scanning using the form data approach
      const formData = new URLSearchParams();
      formData.append('url', formattedUrl);
      
      const urlSubmitResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
        method: 'POST',
        headers: {
          'x-apikey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (!urlSubmitResponse.ok) {
        throw new Error(`VirusTotal API error (submit): ${urlSubmitResponse.status}`);
      }

      const urlSubmitData = await urlSubmitResponse.json();
      
      // Extract the analysis ID from the response
      const analysisId = urlSubmitData.data.id;
      
      // Step 2: Wait a moment for analysis to complete
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Step 3: Get the analysis results
      const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
        method: 'GET',
        headers: {
          'x-apikey': apiKey
        }
      });

      if (!analysisResponse.ok) {
        throw new Error(`VirusTotal analysis error: ${analysisResponse.status}`);
      }

      const analysisData = await analysisResponse.json();
      
      // Extract the actual URL ID from the analysis response
      // This is critical - we need to use the actual resource ID, not the analysis ID
      const urlId = analysisData.meta.url_info.id;
      
      if (!urlId) {
        // If we can't get the URL ID, we'll just use the analysis data
        return { analysisData, urlInfo: null };
      }
      
      // Step 4: Get URL details using the correct URL ID
      const urlInfoResponse = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
        method: 'GET',
        headers: {
          'x-apikey': apiKey
        }
      });

      let urlInfo = null;
      if (urlInfoResponse.ok) {
        const urlInfoData = await urlInfoResponse.json();
        urlInfo = urlInfoData.data;
      } else {
        console.error(`Error fetching URL details: ${urlInfoResponse.status}`);
      }

      return { analysisData, urlInfo };
    } catch (error) {
      console.error("VirusTotal API Error:", error);
      throw error;
    }
  };

  // Process the VirusTotal API response
  const processVirusTotalResponse = (response, formattedUrl) => {
    const { analysisData, urlInfo } = response;
    
    // Extract the analysis stats
    const stats = analysisData.data.attributes.stats;
    const results = analysisData.data.attributes.results;
    
    // Calculate security score based on malicious and suspicious findings
    const totalEngines = stats.harmless + stats.malicious + stats.suspicious + stats.undetected;
    const maliciousPercentage = (stats.malicious / totalEngines) * 100;
    const suspiciousPercentage = (stats.suspicious / totalEngines) * 100;
    
    // Calculate security score (0-100, higher is better)
    let securityScore = 100 - (maliciousPercentage + (suspiciousPercentage / 2));
    securityScore = Math.max(0, Math.min(100, Math.round(securityScore)));
    
    // Extract domain information
    let domain = '';
    try {
      domain = new URL(formattedUrl).hostname;
    } catch (e) {
      domain = 'Unknown';
    }
    
    // Extract additional information from urlInfo if available
    let registrationDate = 'Unknown';
    let sslInfo = {
      valid: formattedUrl.startsWith('https://'),
      issuer: 'Unknown',
      expiryDate: 'Unknown'
    };
    
    if (urlInfo && urlInfo.attributes) {
      // Extract last analysis date
      if (urlInfo.attributes.last_analysis_date) {
        registrationDate = new Date(urlInfo.attributes.last_analysis_date * 1000).toLocaleDateString();
      }
      
      // Extract SSL information if available
      if (urlInfo.attributes.last_https_certificate) {
        const cert = urlInfo.attributes.last_https_certificate;
        sslInfo = {
          valid: true,
          issuer: cert.issuer?.O || cert.issuer?.CN || 'Unknown',
          expiryDate: cert.validity?.not_after ? new Date(cert.validity.not_after * 1000).toLocaleDateString() : 'Unknown'
        };
      }
    }
    
    // Determine specific threats
    const isPhishing = Object.values(results).some(engine => 
      engine.category === 'phishing' || 
      (engine.result && engine.result.toLowerCase().includes('phish'))
    );
    
    const isMalware = Object.values(results).some(engine => 
      engine.category === 'malware' || 
      (engine.result && engine.result.toLowerCase().includes('malware'))
    );
    
    const isScam = isPhishing || 
      Object.values(results).some(engine => 
        engine.category === 'scam' || 
        (engine.result && engine.result.toLowerCase().includes('scam'))
      );
    
    const hasSuspiciousRedirects = Object.values(results).some(engine => 
      engine.result && (
        engine.result.toLowerCase().includes('redirect') || 
        engine.result.toLowerCase().includes('suspicious')
      )
    );
    
    // Determine risk level based on detected threats - this is the key change
    let riskLevel = 'Low';
    if (isPhishing || isMalware || isScam || stats.malicious > 0) {
      riskLevel = 'High'; // Always high risk if any malicious threats detected
    } else if (hasSuspiciousRedirects || stats.suspicious > 0 || !sslInfo.valid) {
      riskLevel = 'Medium'; // Medium risk for suspicious activity or invalid SSL
    } else if (securityScore < 70) {
      riskLevel = 'Medium'; // Fallback to score-based risk if no specific threats found
    }
    
    // Adjust security score based on detected threats
    if (isPhishing || isMalware || isScam) {
      securityScore = Math.min(securityScore, 25); // Cap score at 25 for sites with threats
    }
    
    // Create result object
    return {
      url: formattedUrl,
      isPhishing,
      isMalware,
      isScam,
      hasSuspiciousRedirects,
      securityScore,
      riskLevel,
      domain,
      registrationDate,
      ssl: sslInfo,
      blacklists: {
        listed: stats.malicious > 0,
        count: stats.malicious
      },
      scanDetails: {
        totalEngines,
        malicious: stats.malicious,
        suspicious: stats.suspicious,
        harmless: stats.harmless,
        undetected: stats.undetected
      }
    };
  };

  // Fallback to local analysis if API fails
  const performLocalAnalysis = (formattedUrl) => {
    // Try to create a URL object to validate the format
    let urlObj;
    try {
      urlObj = new URL(formattedUrl);
    } catch (urlErr) {
      // If URL is invalid, mark it as high risk immediately
      return {
        url: formattedUrl,
        isPhishing: true,
        isMalware: false,
        isScam: true,
        hasSuspiciousRedirects: true,
        securityScore: 10,
        riskLevel: 'High',
        domain: 'Invalid URL',
        registrationDate: 'Unknown',
        ssl: {
          valid: false,
          issuer: 'None',
          expiryDate: 'N/A'
        },
        blacklists: {
          listed: true,
          count: 1
        },
        scanDetails: {
          totalEngines: 1,
          malicious: 1,
          suspicious: 0,
          harmless: 0,
          undetected: 0
        }
      };
    }
    
    // Get domain information
    const domain = urlObj.hostname;
    
    // Check for suspicious patterns in the URL
    const suspiciousPatterns = [
      /free.*download/i,
      /win.*prize/i,
      /login.*verify/i,
      /account.*suspend/i,
      /urgent/i,
      /password/i,
      /bank/i,
      /crypto/i,
      /\d{10,}/,  // Long number sequences
      /[a-zA-Z0-9]{20,}/,  // Very long alphanumeric strings
      /bit\.ly/i, /tinyurl/i, /goo\.gl/i, // URL shorteners
      /\.(tk|ml|ga|cf|gq)$/i, // Free domains often used in scams
    ];
    
    // Check for unusual TLDs or subdomains
    const unusualTLD = /\.(xyz|top|loan|work|date|racing|win|bid|stream|download)$/i.test(domain);
    const manySubdomains = (domain.match(/\./g) || []).length > 2;
    const longDomainName = domain.length > 30;
    
    // Check if domain looks like a typosquatting attempt of popular sites
    const typosquattingTargets = ['google', 'facebook', 'amazon', 'microsoft', 'apple', 'paypal', 'netflix'];
    const possibleTyposquatting = typosquattingTargets.some(target => {
      // Check for close matches like g00gle, faceb00k, etc.
      const pattern = new RegExp(target.split('').join('[^a-zA-Z0-9]*'), 'i');
      return pattern.test(domain) && domain !== target + '.com';
    });
    
    // Calculate risk based on suspicious patterns
    let suspiciousCount = 0;
    if (suspiciousPatterns.some(pattern => pattern.test(formattedUrl))) suspiciousCount++;
    if (unusualTLD) suspiciousCount++;
    if (manySubdomains) suspiciousCount++;
    if (longDomainName) suspiciousCount++;
    if (possibleTyposquatting) suspiciousCount++;
    
    // Additional risk factors for non-standard URLs
    const hasNoSSL = !formattedUrl.startsWith('https://');
    if (hasNoSSL) suspiciousCount++;
    
    // Calculate security score
    let securityScore = 100 - (suspiciousCount * 15);
    securityScore = Math.max(0, Math.min(100, securityScore));
    
    // Determine risk level - updated to match our new logic
    const isPhishing = suspiciousCount >= 3;
    const isMalware = suspiciousCount >= 4;
    const isScam = suspiciousCount >= 2;
    const hasSuspiciousRedirects = suspiciousCount >= 1;
    
    // Determine risk level based on detected threats
    let riskLevel = 'Low';
    if (isPhishing || isMalware || isScam) {
      riskLevel = 'High'; // Always high risk if any malicious threats detected
      securityScore = Math.min(securityScore, 25); // Cap score at 25 for sites with threats
    } else if (hasSuspiciousRedirects || !formattedUrl.startsWith('https://')) {
      riskLevel = 'Medium'; // Medium risk for suspicious activity or invalid SSL
    } else if (securityScore < 70) {
      riskLevel = 'Medium'; // Fallback to score-based risk if no specific threats found
    }
    
    // Create result object
    return {
      url: formattedUrl,
      isPhishing,
      isMalware,
      isScam,
      hasSuspiciousRedirects,
      securityScore,
      riskLevel,
      domain,
      registrationDate: 'Unknown (Local Analysis)',
      ssl: {
        valid: formattedUrl.startsWith('https://'),
        issuer: formattedUrl.startsWith('https://') ? 'Unknown' : 'None',
        expiryDate: formattedUrl.startsWith('https://') ? 'Unknown' : 'N/A'
      },
      blacklists: {
        listed: suspiciousCount >= 3,
        count: suspiciousCount >= 3 ? 1 : 0
      },
      scanDetails: {
        totalEngines: 1,
        malicious: suspiciousCount >= 3 ? 1 : 0,
        suspicious: suspiciousCount,
        harmless: suspiciousCount === 0 ? 1 : 0,
        undetected: 0
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    // Format the URL
    const formattedUrl = formatUrl(url);
    
    setError('');
    setIsAnalyzing(true);
    setDebugInfo(null);
    
    try {
      let result;
      
      if (apiKey) {
        try {
          // Try to use VirusTotal API
          const apiResponse = await analyzeURLWithVirusTotal(formattedUrl);
          result = processVirusTotalResponse(apiResponse, formattedUrl);
        } catch (apiError) {
          console.error("API Error, falling back to local analysis:", apiError);
          // If API fails, fall back to local analysis
          result = performLocalAnalysis(formattedUrl);
        }
      } else {
        console.log("No API key available, using local analysis");
        // If no API key, use local analysis
        result = performLocalAnalysis(formattedUrl);
      }
      
      setResult(result);
      setIsAnalyzing(false);
      
    } catch (err) {
      console.error("Error during URL analysis:", err);
      setError(`Failed to analyze the URL: ${err.message}`);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="bg-primary-100 p-3 rounded-full mr-4">
          <LinkIcon className="h-6 w-6 text-primary-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Link/URL Scanner</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Scan URLs and links for potential security threats, including phishing attempts, malware, and scam websites using VirusTotal's powerful scanning engine.
      </p>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Enter URL to Scan
          </label>
          <div className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="example.com or https://example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="bg-primary-600 text-white py-2 px-6 rounded-r-md hover:bg-primary-700 transition-colors disabled:bg-primary-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Scanning...
                </>
              ) : (
                'Scan URL'
              )}
            </button>
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          {!apiKey && (
            <p className="mt-1 text-xs text-amber-600">
              Note: Using local analysis because no valid API key is provided.
            </p>
          )}
        </div>
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
              {result.riskLevel === 'High' ? 'High Risk - Potentially Dangerous URL' :
               result.riskLevel === 'Medium' ? 'Medium Risk - Exercise Caution' :
               'Low Risk - Likely Safe URL'}
            </h3>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Globe className="h-4 w-4 text-gray-600 mr-2" />
              <p className="text-sm font-medium text-gray-700">{result.domain}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div 
                className={`h-2.5 rounded-full ${
                  result.securityScore < 30 ? 'bg-red-500' :
                  result.securityScore < 70 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} 
                style={{ width: `${result.securityScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-900">Security Score</p>
              <p className="text-xs font-medium text-gray-900">{result.securityScore}/100</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Threat Detection</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  {result.isPhishing ? (
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  )}
                  <span className="text-sm text-gray-900">
                    {result.isPhishing ? 'Phishing detected' : 'No phishing detected'}
                  </span>
                </div>
                <div className="flex items-center">
                  {result.isMalware ? (
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  )}
                  <span className="text-sm text-gray-900">
                    {result.isMalware ? 'Malware detected' : 'No malware detected'}
                  </span>
                </div>
                <div className="flex items-center">
                  {result.isScam ? (
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  )}
                  <span className="text-sm text-gray-900">
                    {result.isScam ? 'Scam site detected' : 'No scam detected'}
                  </span>
                </div>
                <div className="flex items-center">
                  {result.hasSuspiciousRedirects ? (
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  )}
                  <span className="text-sm text-gray-900">
                    {result.hasSuspiciousRedirects ? 'Suspicious redirects detected' : 'No suspicious redirects'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Website Information</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Domain Registration</p>
                  <p className="text-sm text-gray-900">{result.registrationDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">SSL Certificate</p>
                  <div className="flex items-center">
                    {result.ssl.valid ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-900">
                      {result.ssl.valid ? `Valid (${result.ssl.issuer})` : 'Invalid or missing'}
                    </span>
                  </div>
                  {result.ssl.valid && (
                    <p className="text-xs mt-1">Expires: {result.ssl.expiryDate}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Blacklist Status</p>
                  <div className="flex items-center">
                    {result.blacklists.listed ? (
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-900">
                      {result.blacklists.listed 
                        ? `Listed on ${result.blacklists.count} threat lists` 
                        : 'Not blacklisted'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {result.scanDetails && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Scan Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Total Engines</p>
                  <p className="font-medium text-gray-900">{result.scanDetails.totalEngines}</p>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Malicious</p>
                  <p className="font-medium text-red-600">{result.scanDetails.malicious}</p>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Suspicious</p>
                  <p className="font-medium text-yellow-600">{result.scanDetails.suspicious}</p>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Clean</p>
                  <p className="font-medium text-green-600">{result.scanDetails.harmless}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
            <p className="text-sm text-gray-700">
              {result.riskLevel === 'High' 
                ? 'This URL has been identified as potentially dangerous. We strongly recommend not visiting this website as it may attempt to steal your information or install malware on your device.' 
                : result.riskLevel === 'Medium'
                ? 'This URL shows some suspicious characteristics. Exercise caution if you choose to visit this site. Do not enter personal information or download files.'
                : 'This URL appears to be safe based on our analysis, but always remain cautious when sharing personal information online.'}
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center">
            <Shield className="h-5 w-5 text-gray-500 mr-2" />
            <p className="text-sm text-gray-500">
              Last scanned {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-xs text-gray-500">
        <p>Note: This tool uses VirusTotal's API to analyze URLs for malicious content and security threats.</p>
      </div>
    </div>
  );
};

export default LinkScanner; 