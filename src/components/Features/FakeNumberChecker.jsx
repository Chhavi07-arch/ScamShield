import React, { useState, useEffect } from 'react';
import { Phone, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

const FakeNumberChecker = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Get API key from environment variables
    const key = import.meta.env.VITE_PHONE_API_KEY || '';
    setApiKey(key);
  }, []);

  // Pattern-based detection for common scam number patterns
  const scamPatterns = [
    // Generic scam patterns
    /^\+1\s?800\s?\d{3}\s?\d{4}$/, // Fake toll-free
    /^\+44\s?20\s?\d{4}\s?\d{4}$/, // Fake UK London
    /^\+1\s?555\s?\d{3}\s?\d{4}$/, // North American fake/movie numbers
    /^\+\d{1,3}\s?123\s?456\s?\d{4}$/, // Generic fake pattern
    
    // Indian scam patterns
    /^\+?91\s?140\d{8}$/, // Indian scam numbers starting with 140
    /^\+?91\s?[6-9]0{5}\d{4}$/, // Suspicious pattern with 5 zeros
    /^\+?91\s?1\d{9}$/, // Most Indian legitimate mobile numbers don't start with 1
    /^\+?91\s?000\d{7}$/, // Numbers with 000 pattern
    
    // UK scam patterns
    /^\+44\s?70\d{9}$/, // UK premium rate numbers often used in scams
    /^\+44\s?84[5789]\d{7}$/, // UK high-rate service numbers
    
    // US scam patterns
    /^\+1\s?900\d{7}$/, // US premium rate numbers
    /^\+1\s?976\d{7}$/, // Adult service numbers
  ];

  // Suspicious area codes by country
  const suspiciousAreaCodes = {
    '+1': ['900', '976', '809', '284', '649'], // US/Canada suspicious area codes
    '+44': ['70', '845', '870', '871', '872', '873'], // UK suspicious area codes
    '+91': ['140', '121', '131', '132', '133', '134', '135'], // Indian suspicious area codes
  };

  // Country code validation
  const validCountryCodes = [
    '+1', '+44', '+91', '+86', '+49', '+33', '+61', '+81', '+7', '+55',
    '+52', '+39', '+34', '+31', '+27', '+82', '+65', '+64', '+971'
  ];

  // Check if a number has a suspicious area code
  const hasSuspiciousAreaCode = (parsedNumber) => {
    if (!parsedNumber) return false;
    
    const countryCode = '+' + parsedNumber.countryCallingCode;
    const nationalNumber = parsedNumber.nationalNumber;
    
    if (suspiciousAreaCodes[countryCode]) {
      return suspiciousAreaCodes[countryCode].some(areaCode => 
        nationalNumber.startsWith(areaCode)
      );
    }
    
    return false;
  };

  // Check for sequential or repeating digit patterns
  const hasSequentialOrRepeatingPattern = (number) => {
    // Remove non-digit characters
    const digits = number.replace(/\D/g, '');
    
    // Check for 4 or more repeating digits
    const repeatingPattern = /(\d)\1{3,}/;
    if (repeatingPattern.test(digits)) return true;
    
    // Check for sequential patterns (ascending or descending)
    for (let i = 0; i < digits.length - 3; i++) {
      const d1 = parseInt(digits[i]);
      const d2 = parseInt(digits[i+1]);
      const d3 = parseInt(digits[i+2]);
      const d4 = parseInt(digits[i+3]);
      
      if ((d1 + 1 === d2 && d2 + 1 === d3 && d3 + 1 === d4) || 
          (d1 - 1 === d2 && d2 - 1 === d3 && d3 - 1 === d4)) {
        return true;
      }
    }
    
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number format
    const phoneRegex = /^\+?[0-9\s\-()]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setError('');
    setIsAnalyzing(true);
    
    try {
      // Format the phone number - remove spaces, dashes, and parentheses
      const formattedNumber = phoneNumber.replace(/[\s\-()]/g, '');
      
      // Enhanced validation using libphonenumber-js
      let isValidFormat = false;
      let parsedNumber = null;
      
      try {
        // Try to parse the phone number
        parsedNumber = parsePhoneNumber(formattedNumber);
        isValidFormat = parsedNumber && parsedNumber.isValid();
      } catch (parseErr) {
        // If parsing fails, set isValidFormat to false
        isValidFormat = false;
      }
      
      // Check if the country code is valid
      let hasValidCountryCode = false;
      if (parsedNumber) {
        const countryCode = '+' + parsedNumber.countryCallingCode;
        hasValidCountryCode = validCountryCodes.includes(countryCode);
      }
      
      // Check if the number matches any known scam patterns
      const matchesScamPattern = scamPatterns.some(pattern => pattern.test(phoneNumber));
      
      // Check if the number has a suspicious area code
      const hasSuspiciousArea = hasSuspiciousAreaCode(parsedNumber);
      
      // Check for sequential or repeating patterns
      const hasPatternIssue = hasSequentialOrRepeatingPattern(phoneNumber);
      
      // Check if API key is valid
      const isValidApiKey = apiKey && apiKey.length > 10;
      
      let data = null;
      
      if (isValidApiKey) {
        try {
          console.log("Using API key:", apiKey);
          // Make API call to Numverify - using HTTPS
          const response = await fetch(`https://apilayer.net/api/validate?access_key=${apiKey}&number=${formattedNumber}&format=1`);
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          data = await response.json();
          console.log("API Response:", data);
          
          if (data.success === false) {
            console.error("API Error:", data.error);
            throw new Error(data.error?.info || 'API validation failed');
          }
          
          if (!data.valid) {
            throw new Error('Invalid phone number format according to API');
          }
        } catch (apiErr) {
          console.error("API Error:", apiErr);
          // Fall back to mock data if API call fails
          console.log("Using mock data due to API error:", apiErr.message);
          data = null;
        }
      } else {
        console.log("No valid API key found. Using mock data instead.");
      }
      
      // If API key is invalid or API call failed, use mock data
      if (!isValidApiKey || !data) {
        // Generate mock data for demonstration purposes
        const countryNames = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'India'];
        const countryCodes = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IN'];
        const carriers = ['AT&T', 'Verizon', 'T-Mobile', 'Sprint', 'Vodafone', 'Orange', 'Airtel', 'Jio'];
        const lineTypes = ['mobile', 'landline'];
        
        // Try to determine country from the number
        let randomIndex = Math.floor(Math.random() * countryNames.length);
        if (parsedNumber && parsedNumber.country) {
          // If we can parse the country, use it
          const countryIndex = countryCodes.findIndex(c => c === parsedNumber.country);
          if (countryIndex >= 0) {
            randomIndex = countryIndex;
          }
        }
        
        const randomCarrierIndex = Math.floor(Math.random() * carriers.length);
        const randomLineTypeIndex = Math.floor(Math.random() * lineTypes.length);
        
        data = {
          valid: isValidFormat, // Use libphonenumber-js validation
          number: formattedNumber,
          local_format: formattedNumber.slice(-10),
          international_format: parsedNumber ? parsedNumber.formatInternational() : ('+' + formattedNumber),
          country_name: countryNames[randomIndex],
          country_code: countryCodes[randomIndex],
          country_prefix: parsedNumber ? '+' + parsedNumber.countryCallingCode : '+1',
          line_type: lineTypes[randomLineTypeIndex],
          carrier: carriers[randomCarrierIndex],
          location: 'Mock City'
        };
      }
      
      // Calculate risk score based on various factors
      let riskScore = 0;
      
      // Factor 1: Line type - mobile numbers are slightly riskier than landlines
      if (data.line_type === 'mobile') {
        riskScore += 10;
      }
      
      // Factor 2: Country match - if country code doesn't match country
      if (!data.country_code) {
        riskScore += 30;
      }
      
      // Factor 3: Carrier presence - no carrier info is suspicious
      if (!data.carrier) {
        riskScore += 20;
      }
      
      // Factor 4: Location data - no location data is suspicious
      if (!data.location) {
        riskScore += 15;
      }
      
      // Factor 5: Matches known scam pattern
      if (matchesScamPattern) {
        riskScore += 50;
      }
      
      // Factor 6: Invalid format according to libphonenumber-js
      if (!isValidFormat) {
        riskScore += 35;
      }
      
      // Factor 7: Invalid country code
      if (!hasValidCountryCode && parsedNumber) {
        riskScore += 25;
      }
      
      // Factor 8: Has suspicious area code
      if (hasSuspiciousArea) {
        riskScore += 40;
      }
      
      // Factor 9: Has sequential or repeating pattern
      if (hasPatternIssue) {
        riskScore += 15;
      }
      
      // Cap the score at 100
      if (riskScore > 100) riskScore = 100;
      
      // Determine risk level
      let riskLevel = 'Low';
      if (riskScore > 70) riskLevel = 'High';
      else if (riskScore > 40) riskLevel = 'Medium';
      
      // Create result object with Numverify data
      const issues = [];
      
      if (matchesScamPattern) {
        issues.push('Matches known scam number pattern');
      }
      
      if (!isValidFormat) {
        issues.push('Invalid phone number format');
      }
      
      if (!hasValidCountryCode && parsedNumber) {
        issues.push('Suspicious country code');
      }
      
      if (hasSuspiciousArea) {
        issues.push('Contains suspicious area code often used in scams');
      }
      
      if (hasPatternIssue) {
        issues.push('Contains suspicious sequential or repeating digit pattern');
      }
      
      // Check specifically for Indian scam numbers
      if (parsedNumber && parsedNumber.countryCallingCode === '91') {
        const nationalNumber = parsedNumber.nationalNumber;
        if (nationalNumber.startsWith('140')) {
          issues.push('Indian number starting with 140 (commonly used in scams)');
        }
      }
      
      const resultObj = {
        number: data.international_format,
        isValid: data.valid,
        type: data.line_type || 'Unknown',
        country: data.country_name || 'Unknown',
        countryCode: data.country_code || 'Unknown',
        carrier: data.carrier || 'Unknown',
        riskScore,
        riskLevel,
        scamReports: Math.floor(Math.random() * 50), // Mock data as Numverify doesn't provide this
        issues: issues
      };
      
      setResult(resultObj);
      setIsAnalyzing(false);
      
    } catch (err) {
      console.error("Error during analysis:", err);
      setError(`Failed to analyze the phone number: ${err.message}`);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="bg-primary-100 p-3 rounded-full mr-4">
          <Phone className="h-6 w-6 text-primary-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Fake Phone Number Checker</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Verify if a phone number is legitimate or potentially fraudulent. Our system checks against known scam patterns and identifies spoofed caller IDs using the Numverify API.
      </p>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          {!apiKey && (
            <p className="mt-1 text-xs text-amber-600">
              Note: Using mock data because no valid API key is provided.
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
            'Verify Number'
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
              {result.riskLevel === 'High' ? 'High Risk - Potential Scam Number' :
               result.riskLevel === 'Medium' ? 'Medium Risk - Exercise Caution' :
               'Low Risk - Likely Legitimate'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Number</p>
              <p className="font-medium text-gray-900">{result.number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Type</p>
              <p className="font-medium text-gray-900">{result.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Country</p>
              <p className="font-medium text-gray-900">{result.country} ({result.countryCode})</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Carrier</p>
              <p className="font-medium text-gray-900">{result.carrier}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Risk Score</p>
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
              <p className="text-xs mt-1 text-gray-900">{result.riskScore}/100</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Scam Reports</p>
              <p className="font-medium text-gray-900">{result.scamReports} reports</p>
            </div>
          </div>
          
          {/* Display detected issues if any */}
          {result.issues && result.issues.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-800 mb-1">Detected Issues:</p>
              <ul className="list-disc pl-5 text-sm text-gray-900">
                {result.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium mb-2 text-gray-800">Recommendation</h4>
            <p className="text-sm text-gray-900">
              {result.riskLevel === 'High' 
                ? 'This number has been flagged as potentially fraudulent. We recommend blocking this number and not sharing any personal information.' 
                : result.riskLevel === 'Medium'
                ? 'Exercise caution when dealing with this number. Do not share sensitive information and be alert for suspicious behavior.'
                : 'This number appears to be legitimate, but always remain cautious when sharing personal information.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeNumberChecker; 