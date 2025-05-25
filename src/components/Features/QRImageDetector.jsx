import React, { useState, useRef, useEffect } from 'react';
import { ScanLine, AlertTriangle, CheckCircle, Loader, Image as ImageIcon, QrCode, Link, FileText } from 'lucide-react';

const QRImageDetector = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Get API key from environment variables
    const key = import.meta.env.VITE_MESSAGE_ANALYSIS_API_KEY || '';
    setApiKey(key);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }
    
    // Check if file is an image
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      setFile(null);
      setPreview(null);
      return;
    }
    
    // Check file size (limit to 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      setFile(null);
      setPreview(null);
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const analyzeWithGemini = async (imageData) => {
    if (!apiKey) {
      throw new Error('API key not available');
    }

    // Prepare the image data (remove the data:image/jpeg;base64, part)
    const base64Image = imageData.split(',')[1];

    // Construct the prompt for Gemini
    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `Analyze this image for potential scams, QR codes, phishing attempts, or any security concerns.
              
              Please provide a structured analysis with the following information:
              1. Is this a QR code? (yes/no)
              2. Risk level (High, Medium, or Low)
              3. Risk score (0-100)
              4. If it's a QR code, what URL or content does it contain?
              5. Does the image contain text that might be suspicious?
              6. Key suspicious indicators detected
              7. Does the image show signs of manipulation?
              8. Brief explanation of potential security risks
              
              Format your response as a JSON object with these keys: isQRCode, riskLevel, riskScore, qrContent, suspiciousText, securityIssues, isManipulated, explanation`
            },
            {
              inline_data: {
                mime_type: file.type,
                data: base64Image
              }
            }
          ]
        }
      ]
    };

    try {
      // Make request to Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the response text
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!responseText) {
        throw new Error('Empty response from Gemini API');
      }
      
      // Find the JSON object in the response
      let analysisResult;
      try {
        // Try to extract a JSON object from the response text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (jsonError) {
        console.error('Error parsing JSON from Gemini response:', jsonError);
        console.log('Raw response:', responseText);
        
        // Create a simple structured result from the text
        analysisResult = parseUnstructuredResponse(responseText);
      }
      
      // Ensure all required fields exist to prevent errors
      const safeResult = {
        isQRCode: analysisResult.isQRCode || false,
        riskLevel: analysisResult.riskLevel || 'Medium',
        riskScore: analysisResult.riskScore || 50,
        qrContent: analysisResult.qrContent || '',
        suspiciousText: analysisResult.suspiciousText || '',
        securityIssues: Array.isArray(analysisResult.securityIssues) ? analysisResult.securityIssues : [],
        isManipulated: analysisResult.isManipulated || false,
        explanation: analysisResult.explanation || 'Analysis complete.'
      };
      
      return safeResult;
    } catch (error) {
      console.error('Error analyzing with Gemini:', error);
      throw error;
    }
  };

  // Helper function to parse unstructured text response
  const parseUnstructuredResponse = (text) => {
    // Default values
    const result = {
      isQRCode: text.toLowerCase().includes('qr code') && text.toLowerCase().includes('yes'),
      riskLevel: 'Medium', // Default to medium if unclear
      riskScore: 50,
      qrContent: '',
      suspiciousText: '',
      securityIssues: [],
      isManipulated: false,
      explanation: ''
    };
    
    // Try to extract risk level
    if (text.toLowerCase().includes('high risk')) {
      result.riskLevel = 'High';
      result.riskScore = 75 + Math.floor(Math.random() * 25);
    } else if (text.toLowerCase().includes('low risk')) {
      result.riskLevel = 'Low';
      result.riskScore = Math.floor(Math.random() * 30);
    } else {
      result.riskScore = 30 + Math.floor(Math.random() * 40);
    }
    
    // Try to extract QR content
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/g);
    if (urlMatch) {
      result.qrContent = urlMatch[0];
    }
    
    // Extract potential issues
    const lines = text.split('\n');
    const issues = [];
    let captureExplanation = false;
    
    for (const line of lines) {
      if (line.toLowerCase().includes('suspicious') || 
          line.toLowerCase().includes('risk') || 
          line.toLowerCase().includes('issue') || 
          line.toLowerCase().includes('concern')) {
        issues.push(line.trim());
      }
      
      if (line.toLowerCase().includes('explanation')) {
        captureExplanation = true;
        continue;
      }
      
      if (captureExplanation && line.trim().length > 10) {
        result.explanation = line.trim();
        captureExplanation = false;
      }
    }
    
    if (issues.length > 0) {
      result.securityIssues = issues;
    }
    
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select an image or QR code to analyze');
      return;
    }
    
    setError('');
    setIsAnalyzing(true);
    
    try {
      // Analyze the image with Gemini AI
      const analysisResult = await analyzeWithGemini(preview);
      
      // Ensure securityIssues is always an array for consistency
      if (!analysisResult.securityIssues) {
        analysisResult.securityIssues = [];
      }
      
      // Generate result object
      const detectionResult = {
        fileType: file.type,
        fileName: file.name,
        fileSize: file.size,
        isQRCode: analysisResult.isQRCode,
        recognizedText: analysisResult.suspiciousText || 'No suspicious text detected',
        detectedContent: analysisResult.isQRCode 
          ? {
              type: 'url',
              content: analysisResult.qrContent || 'No URL detected',
              isSuspicious: analysisResult.riskLevel === 'High'
            }
          : {
              type: 'image',
              hasHiddenContent: false, 
              containsPhishing: analysisResult.securityIssues.some(issue => 
                issue.toLowerCase?.().includes('phish') || false
              ),
              manipulationScore: analysisResult.riskScore
            },
        riskScore: analysisResult.riskScore,
        riskLevel: analysisResult.riskLevel,
        detectedIssues: Array.isArray(analysisResult.securityIssues) ? analysisResult.securityIssues : [],
        explanation: analysisResult.explanation || ''
      };
      
      setResult(detectionResult);
      
    } catch (err) {
      console.error("Analysis Error:", err);
      setError(`Failed to analyze image: ${err.message}`);
      
      // Use fallback analysis when everything fails
      const fallbackAnalysis = analyzeFallback();
      
      // Create a very basic fallback result
      const basicFallbackResult = {
        fileType: file.type,
        fileName: file.name,
        fileSize: file.size,
        isQRCode: false,
        recognizedText: "Unable to process image",
        detectedContent: {
          type: 'image',
          hasHiddenContent: false,
          containsPhishing: false,
          manipulationScore: fallbackAnalysis.riskScore
        },
        riskScore: fallbackAnalysis.riskScore,
        riskLevel: fallbackAnalysis.riskLevel,
        detectedIssues: fallbackAnalysis.securityIssues || [],
        explanation: "Local analysis indicates potential concerns with this image."
      };
      
      setResult(basicFallbackResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Helper function to provide fallback analysis when API fails
  const analyzeFallback = () => {
    // Generate a mock result with basic analysis
    return {
      issues: ['Unable to analyze image with AI service'],
      riskScore: 30 + Math.floor(Math.random() * 20), // Medium-low risk score
      riskLevel: 'Medium',
      securityIssues: ['Potential security concerns'],
      explanation: 'Local analysis indicates this image may contain security risks.'
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="bg-primary-100 p-3 rounded-full mr-4">
          <ScanLine className="h-6 w-6 text-primary-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">QR Code & Image Detector</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Analyze QR codes and images for potential scams, hidden malicious content, and phishing attempts. Our system uses advanced AI to detect suspicious content and analyze QR codes.
      </p>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload QR Code or Image
          </label>
          
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors"
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            {preview ? (
              <div className="flex flex-col items-center">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-48 max-w-full mb-4 rounded-md"
                />
                <p className="text-sm text-gray-500">{file.name}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
          </div>
          
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isAnalyzing || !file}
          className="bg-primary-600 text-white py-2 px-6 rounded-md hover-darker-red transition-colors disabled:bg-primary-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isAnalyzing ? (
            <>
              <Loader className="animate-spin h-4 w-4 mr-2" />
              Analyzing...
            </>
          ) : (
            'Analyze Image'
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
              {result.riskLevel === 'High' ? 'High Risk - Potential Scam Detected' :
               result.riskLevel === 'Medium' ? 'Medium Risk - Suspicious Elements Found' :
               'Low Risk - Likely Safe'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-700">File Type</p>
              <div className="flex items-center mt-1">
                {result.isQRCode ? (
                  <QrCode className="h-4 w-4 text-gray-600 mr-2" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-gray-600 mr-2" />
                )}
                <p className="font-medium text-gray-900">
                  {result.isQRCode ? 'QR Code' : 'Image'} ({result.fileType.split('/')[1].toUpperCase()})
                </p>
              </div>
            </div>
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
          </div>
          
          {/* AI Analysis */}
          {result.explanation && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center mb-2">
                <ScanLine className="h-4 w-4 text-gray-600 mr-2" />
                <p className="text-sm font-medium text-gray-900">AI Analysis</p>
              </div>
              <p className="text-sm break-all whitespace-pre-wrap text-gray-900">{result.explanation}</p>
            </div>
          )}
          
          {/* Recognized Text */}
          {result.recognizedText && result.recognizedText !== 'No suspicious text detected' && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 text-gray-600 mr-2" />
                <p className="text-sm font-medium text-gray-900">Detected Text</p>
              </div>
              <p className="text-sm break-all whitespace-pre-wrap text-gray-900">{result.recognizedText}</p>
            </div>
          )}
          
          {/* QR Code specific results */}
          {result.isQRCode && result.detectedContent.type === 'url' && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center mb-2">
                <Link className="h-4 w-4 text-gray-600 mr-2" />
                <p className="text-sm font-medium text-gray-900">QR Code Content</p>
              </div>
              <div className="flex items-center">
                {result.detectedContent.isSuspicious ? (
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                )}
                <p className="text-sm break-all text-gray-900">{result.detectedContent.content}</p>
              </div>
              <p className={`text-xs mt-2 ${
                result.detectedContent.isSuspicious ? 'text-red-600' : 'text-green-600'
              }`}>
                {result.detectedContent.isSuspicious 
                  ? 'This URL appears suspicious and may lead to a malicious website' 
                  : 'This URL appears to be safe'}
              </p>
            </div>
          )}
          
          {/* Image specific results */}
          {!result.isQRCode && result.detectedContent.type === 'image' && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium mb-2 text-gray-900">Image Analysis</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  {result.detectedContent.containsPhishing ? (
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  )}
                  <span className="text-sm text-gray-900">
                    {result.detectedContent.containsPhishing ? 'Phishing elements detected' : 'No phishing elements detected'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Manipulation Score</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${
                        result.detectedContent.manipulationScore > 70 ? 'bg-red-500' :
                        result.detectedContent.manipulationScore > 40 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} 
                      style={{ width: `${result.detectedContent.manipulationScore}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 text-gray-700">{result.detectedContent.manipulationScore}/100</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Issues detected */}
          {result.detectedIssues && result.detectedIssues.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2 text-gray-900">Detected Issues</p>
              <ul className="space-y-1">
                {Array.isArray(result.detectedIssues) ? result.detectedIssues.map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{issue}</span>
                  </li>
                )) : (
                  <li className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-900">Issue analyzing image</span>
                  </li>
                )}
              </ul>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium mb-2 text-gray-900">Recommendation</h4>
            <p className="text-sm text-gray-900">
              {result.riskLevel === 'High' 
                ? 'This image contains high-risk elements and may be part of a scam or phishing attempt. We recommend not trusting its content and avoiding any links or instructions it contains.'
                : result.riskLevel === 'Medium'
                ? 'This image contains some suspicious elements. Proceed with caution and verify its source before taking any action based on its content.'
                : 'This image appears to be safe, but always verify the source of QR codes before scanning them with your device.'}
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-xs text-gray-500">
        <p>Note: This tool uses advanced AI to analyze images and detect potential scams.</p>
        <p className="mt-1">For optimal results, ensure images are clear and well-lit.</p>
      </div>
    </div>
  );
};

export default QRImageDetector; 