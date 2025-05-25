import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import FakeNumberChecker from '../components/Features/FakeNumberChecker';

const FeaturePhoneChecker = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Link to="/features" className="flex items-center text-primary-600 mb-6 hover:underline">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to all features
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Fake Phone Number Checker</h1>
        <p className="text-gray-600">
          Protect yourself from phone scams by verifying if a phone number is legitimate or potentially fraudulent. 
          Our system checks against known scam patterns, identifies spoofed caller IDs, and provides risk assessment.
        </p>
      </div>
      
      <FakeNumberChecker />
      
      <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">About This Tool</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            Phone scams are increasingly common, with fraudsters using sophisticated techniques to spoof caller IDs and trick people into answering calls. 
            Our Fake Phone Number Checker helps you identify potentially fraudulent numbers before you engage with them.
          </p>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">How it works:</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Enter any phone number you want to verify</li>
              <li>Our system checks the number against databases of known scam numbers</li>
              <li>We analyze the number format, carrier information, and geographic origin</li>
              <li>The tool calculates a risk score based on multiple factors</li>
              <li>You receive detailed information and recommendations</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Common phone scams to watch for:</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li><span className="font-medium">IRS/Tax scams</span> - Callers claiming to be from tax authorities</li>
              <li><span className="font-medium">Tech support scams</span> - Fake technical support representatives</li>
              <li><span className="font-medium">Bank fraud alerts</span> - Callers posing as your bank's fraud department</li>
              <li><span className="font-medium">Utility company scams</span> - Threats to disconnect services</li>
              <li><span className="font-medium">Social Security scams</span> - Claims about problems with your SSN</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between flex-wrap gap-4">
        <Link 
          to="/features" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors inline-flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          All Features
        </Link>
        
        <Link 
          to="/features/message-analyzer" 
          className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md transition-colors inline-flex items-center"
        >
          Next: Message Scam Analyzer
        </Link>
      </div>
    </div>
  );
};

export default FeaturePhoneChecker; 