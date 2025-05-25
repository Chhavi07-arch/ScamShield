import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare, ScanLine, Link2, ArrowRight } from 'lucide-react';

const Features = () => {
  const tools = [
    {
      id: 'phone-checker',
      title: 'Fake Phone Number Checker',
      description: 'Verify if a phone number is legitimate or potentially fraudulent. Our system checks against known scam patterns and identifies spoofed caller IDs.',
      icon: <Phone className="h-10 w-10 text-primary-500" />,
      path: '/features/phone-checker'
    },
    {
      id: 'message-analyzer',
      title: 'Message/Text Scam Analyzer',
      description: 'Analyze suspicious text messages to identify potential scams. Our system detects common scam patterns, urgent language, suspicious links, and more.',
      icon: <MessageSquare className="h-10 w-10 text-primary-500" />,
      path: '/features/message-analyzer'
    },
    {
      id: 'qr-detector',
      title: 'QR Code & Image Detector',
      description: 'Analyze QR codes and images for potential scams, hidden malicious content, and phishing attempts. Our system scans for suspicious elements and redirects.',
      icon: <ScanLine className="h-10 w-10 text-primary-500" />,
      path: '/features/qr-detector'
    },
    {
      id: 'link-scanner',
      title: 'Link Safety Scanner',
      description: 'Analyze URLs and links for potential security threats before you visit them. Our scanner checks for phishing, malware, and other security risks.',
      icon: <Link2 className="h-10 w-10 text-primary-500" />,
      path: '/features/link-scanner'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Scam Detection Tools</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Protect yourself from online threats with our comprehensive suite of scam detection tools. 
          Each tool is designed to help you identify and avoid different types of scams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tools.map((tool) => (
          <Link 
            key={tool.id}
            to={tool.path}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow transform hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="flex items-start">
              <div className="bg-primary-50 p-4 rounded-full mr-4">
                {tool.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{tool.title}</h2>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                <div className="flex items-center text-primary-600 font-medium">
                  Try Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-gray-50 rounded-xl p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How Our Tools Work</h2>
          <p className="text-gray-600">
            ScamShield uses advanced algorithms and machine learning to detect various types of scams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Input Information</h3>
            <p className="text-gray-600 text-sm">
              Enter the phone number, message, image, or link you want to analyze.
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-primary-600">2</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Advanced Analysis</h3>
            <p className="text-gray-600 text-sm">
              Our AI-powered system analyzes the input against known scam patterns and security threats.
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Risk Assessment</h3>
            <p className="text-gray-600 text-sm">
              We calculate a risk score and identify specific threats or suspicious elements.
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-primary-600">4</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Recommendations</h3>
            <p className="text-gray-600 text-sm">
              Get clear recommendations on how to proceed and protect yourself from potential scams.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Need More Protection?</h2>
        <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
          For comprehensive protection against all types of scams, consider creating an account to access additional features, 
          real-time monitoring, and personalized alerts.
        </p>
        <Link 
          to="/signup" 
          className="bg-primary-600 text-white py-3 px-8 rounded-md hover:bg-primary-700 transition-colors inline-flex items-center"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default Features; 