import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, MessageSquare, Smartphone, QrCode, Link as LinkIcon } from 'lucide-react';

const Features = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">ScamShield Features</h1>
        
        <div className="bg-gradient-to-r from-primary-800 to-primary-700 text-white p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">Comprehensive Protection Against Scams</h2>
          <p className="text-lg">
            ScamShield offers a suite of powerful tools designed to detect and prevent various types of scams,
            from suspicious text messages to fraudulent phone numbers and malicious links.
          </p>
        </div>
        
        <div className="space-y-16">
          <section>
            <div className="flex items-center mb-4">
              <MessageSquare className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Text Message Analysis</h2>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                Our advanced text analysis engine can identify suspicious patterns, urgent language, and other red flags commonly found in scam messages.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-6">
                <li>Detects urgent language designed to make you act without thinking</li>
                <li>Identifies suspicious URLs and shortened links</li>
                <li>Recognizes patterns common in phishing attempts</li>
                <li>Provides risk assessment with detailed explanations</li>
              </ul>
              <Link 
                to="/features/message-analyzer" 
                className="inline-block bg-primary-600 text-white font-medium py-2 px-4 rounded-md hover-darker-red transition-colors"
              >
                Try the Message Analyzer
              </Link>
            </div>
          </section>
          
          <section>
            <div className="flex items-center mb-4">
              <Smartphone className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Phone Number Validation</h2>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                Verify if a phone number is potentially fraudulent before returning a call or sending sensitive information.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-6">
                <li>Checks against known scam number patterns</li>
                <li>Identifies spoofed caller IDs</li>
                <li>Validates number format and region consistency</li>
                <li>Provides safety recommendations</li>
              </ul>
              <Link 
                to="/features/phone-checker" 
                className="inline-block bg-primary-600 text-white font-medium py-2 px-4 rounded-md hover-darker-red transition-colors"
              >
                Try the Number Checker
              </Link>
            </div>
          </section>
          
          <section>
            <div className="flex items-center mb-4">
              <QrCode className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">QR Code Scanner (Coming Soon)</h2>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                Scan QR codes before accessing them to ensure they don't lead to malicious websites or phishing attempts.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-6">
                <li>Previews destination URL before opening</li>
                <li>Checks against database of known malicious sites</li>
                <li>Analyzes URL for suspicious patterns</li>
                <li>Warns about potential risks</li>
              </ul>
              <button 
                className="inline-block bg-gray-300 text-gray-600 font-medium py-2 px-4 rounded-md cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </section>
          
          <section>
            <div className="flex items-center mb-4">
              <LinkIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Link Scanner (Coming Soon)</h2>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                Check if a link is safe before clicking by analyzing its destination and checking against known phishing sites.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-6">
                <li>Expands shortened URLs to reveal true destination</li>
                <li>Checks against database of malicious websites</li>
                <li>Detects lookalike domains designed to trick users</li>
                <li>Provides safety rating and recommendations</li>
              </ul>
              <button 
                className="inline-block bg-gray-300 text-gray-600 font-medium py-2 px-4 rounded-md cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </section>
        </div>
        
        <div className="mt-16 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Stay Protected?</h2>
          <p className="text-gray-600 mb-6">
            Start using ScamShield today and take control of your digital security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/dashboard" 
              className="bg-primary-600 text-white font-medium py-3 px-6 rounded-md hover-darker-red transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link 
              to="/game" 
              className="bg-white text-primary-800 border border-primary-600 font-medium py-3 px-6 rounded-md hover:bg-gray-100 transition-colors"
            >
              Try Our Scam Detection Game
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 