import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import MessageAnalyzer from '../components/Features/MessageAnalyzer';

const FeatureMessageAnalyzer = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Link to="/features" className="flex items-center text-primary-600 mb-6 hover:underline">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to all features
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Message/Text Scam Analyzer</h1>
        <p className="text-gray-600">
          Analyze suspicious text messages to identify potential scams. Our system detects common scam patterns, 
          urgent language, suspicious links, and other indicators of fraudulent messages.
        </p>
      </div>
      
      <MessageAnalyzer />
      
      <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">About This Tool</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            SMS and messaging scams (smishing) are becoming increasingly sophisticated, with scammers using urgent language, 
            impersonation tactics, and malicious links to trick recipients. Our Message Analyzer helps you identify these threats 
            before you become a victim.
          </p>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">How it works:</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Paste the suspicious message you received</li>
              <li>Our system analyzes the text for common scam indicators</li>
              <li>We check for urgent language, suspicious links, and requests for personal information</li>
              <li>The tool highlights suspicious content and calculates a risk score</li>
              <li>You receive a detailed analysis with recommendations</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Common text scams to watch for:</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li><span className="font-medium">Package delivery scams</span> - Messages claiming you have a delivery waiting</li>
              <li><span className="font-medium">Bank alert scams</span> - Fake alerts about account issues or suspicious transactions</li>
              <li><span className="font-medium">Prize/lottery scams</span> - Messages claiming you've won something valuable</li>
              <li><span className="font-medium">Account verification scams</span> - Requests to verify your account information</li>
              <li><span className="font-medium">COVID-19 related scams</span> - Messages about vaccines, relief payments, or health alerts</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Tips for staying safe:</h3>
            <ul className="list-disc pl-5 text-blue-800 space-y-1">
              <li>Never click on links in unexpected messages</li>
              <li>Don't respond to messages requesting personal information</li>
              <li>Verify the sender through official channels before taking action</li>
              <li>Be suspicious of urgent deadlines or threats</li>
              <li>Report suspicious messages to your mobile carrier</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between flex-wrap gap-4">
        <Link 
          to="/features/phone-checker" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors inline-flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous: Phone Checker
        </Link>
        
        <Link 
          to="/features/qr-detector" 
          className="bg-primary-600 hover-darker-red text-white py-2 px-4 rounded-md transition-colors inline-flex items-center"
        >
          Next: QR Code Detector
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default FeatureMessageAnalyzer; 