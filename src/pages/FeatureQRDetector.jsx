import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import QRImageDetector from '../components/Features/QRImageDetector';

const FeatureQRDetector = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Link to="/features" className="flex items-center text-primary-600 mb-6 hover:underline">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to all features
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">QR Code & Image Detector</h1>
        <p className="text-gray-600">
          Analyze QR codes and images for potential scams, hidden malicious content, and phishing attempts. 
          Our system scans for suspicious elements and redirects to keep you safe.
        </p>
      </div>
      
      <QRImageDetector />
      
      <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">About This Tool</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            QR code scams are on the rise as these codes become more prevalent in everyday life. Scammers create malicious QR codes 
            that redirect to phishing sites or automatically download malware. Similarly, images can contain hidden threats or be used 
            in social engineering attacks. Our QR Code & Image Detector helps protect you from these visual threats.
          </p>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">How it works:</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Upload a QR code or image you want to analyze</li>
              <li>Our system scans the content for malicious elements</li>
              <li>For QR codes, we safely decode and analyze any embedded URLs or data</li>
              <li>For images, we check for hidden content, manipulation, and phishing indicators</li>
              <li>You receive a detailed analysis with safety recommendations</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">QR Code Scam Tactics:</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Fake parking or payment QR codes</li>
                <li>Malicious QR codes in public places</li>
                <li>Codes that redirect to phishing websites</li>
                <li>QR codes that automatically download malware</li>
                <li>Fraudulent cryptocurrency payment requests</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Image Scam Tactics:</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Steganography (hiding data in images)</li>
                <li>Manipulated screenshots of payments</li>
                <li>Fake verification or security images</li>
                <li>Phishing through infographics</li>
                <li>Deceptive product images</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-4">
            <h3 className="font-semibold text-blue-800 mb-2">Safety Tips:</h3>
            <ul className="list-disc pl-5 text-blue-800 space-y-1">
              <li>Only scan QR codes from trusted sources</li>
              <li>Check where a QR code will redirect before proceeding</li>
              <li>Be wary of QR codes in unexpected places or emails</li>
              <li>Verify the legitimacy of images in financial transactions</li>
              <li>Use this tool to check suspicious QR codes before scanning them with your device</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between flex-wrap gap-4">
        <Link 
          to="/features/message-analyzer" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors inline-flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous: Message Analyzer
        </Link>
        
        <Link 
          to="/features/link-scanner" 
          className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md transition-colors inline-flex items-center"
        >
          Next: Link Scanner
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default FeatureQRDetector; 