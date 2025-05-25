import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import LinkScanner from '../components/Features/LinkScanner';

const FeatureLinkScanner = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Link to="/features" className="flex items-center text-primary-600 mb-6 hover:underline">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to all features
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Link Safety Scanner</h1>
        <p className="text-gray-600">
          Analyze URLs and links for potential security threats before you visit them. 
          Our scanner checks for phishing, malware, and other security risks to keep you safe online.
        </p>
      </div>
      
      <LinkScanner />
      
      <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">About This Tool</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            Malicious links are one of the most common vectors for cyberattacks and scams. Phishing websites, malware distribution, 
            and other online threats often rely on tricking users into clicking dangerous links. Our Link Safety Scanner helps you 
            identify these threats before you visit potentially harmful websites.
          </p>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">How it works:</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Enter any URL or link you want to check</li>
              <li>Our system analyzes the URL against multiple security databases</li>
              <li>We check for phishing attempts, malware, and other security threats</li>
              <li>The tool examines website reputation, SSL certificates, and hosting information</li>
              <li>You receive a comprehensive safety report with recommendations</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Common link-based threats:</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li><span className="font-medium">Phishing websites</span> - Fake sites designed to steal your credentials</li>
              <li><span className="font-medium">Malware distribution</span> - Sites that automatically download malicious software</li>
              <li><span className="font-medium">Typosquatting</span> - URLs that mimic legitimate sites with slight misspellings</li>
              <li><span className="font-medium">URL shorteners</span> - Services that hide the actual destination of a link</li>
              <li><span className="font-medium">Scam websites</span> - Fake stores, investment schemes, and other fraudulent sites</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">URL Safety Tips:</h3>
            <ul className="list-disc pl-5 text-blue-800 space-y-1">
              <li>Always check the URL in your browser's address bar</li>
              <li>Look for HTTPS and a valid SSL certificate (lock icon)</li>
              <li>Be wary of URLs with unusual spellings or domains</li>
              <li>Don't trust links in unsolicited emails or messages</li>
              <li>Use this tool to scan any suspicious links before clicking</li>
              <li>Pay attention to website reputation and reviews</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-12 bg-primary-50 p-6 rounded-lg border border-primary-100">
        <h2 className="text-xl font-bold text-primary-900 mb-4">Protect Yourself Further</h2>
        <p className="text-primary-800 mb-4">
          For comprehensive protection against all types of online threats, consider these additional security measures:
        </p>
        <ul className="list-disc pl-5 text-primary-800 space-y-2">
          <li>Use a reputable antivirus and anti-malware solution</li>
          <li>Install a browser extension that checks links automatically</li>
          <li>Keep your operating system and applications updated</li>
          <li>Use strong, unique passwords for all your accounts</li>
          <li>Enable two-factor authentication when available</li>
        </ul>
      </div>
      
      <div className="mt-8 flex justify-between flex-wrap gap-4">
        <Link 
          to="/features/qr-detector" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors inline-flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous: QR Code Detector
        </Link>
        
        <Link 
          to="/features" 
          className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md transition-colors inline-flex items-center"
        >
          View All Features
        </Link>
      </div>
    </div>
  );
};

export default FeatureLinkScanner; 