import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import ScamGame from '../components/Game/ScamGame';

const Game = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center">
          <Shield className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Scam Detection Training</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold text-primary-800 mb-4">Test Your Scam Detection Skills</h2>
          <p className="text-gray-600 mb-6">
            This interactive game will help you improve your ability to identify scams. 
            You'll be presented with various messages and need to determine if they're legitimate or scams.
            After each answer, you'll receive an explanation to help you learn the warning signs.
          </p>
          
          <div className="bg-primary-50 border-l-4 border-primary-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-primary-700">
                  <strong>Tip:</strong> Look for urgent language, suspicious links, requests for personal information, 
                  and offers that seem too good to be true.
                </p>
              </div>
            </div>
          </div>
          
          <ScamGame />
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Why Practice Matters</h2>
          <p className="text-gray-600 mb-4">
            Scammers are constantly evolving their tactics. Regular practice helps you stay ahead of new scam techniques
            and builds the instinct to spot red flags quickly.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Benefits:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-6">
            <li>Develop the ability to quickly identify suspicious messages</li>
            <li>Learn about the latest scam techniques</li>
            <li>Understand the psychology behind scam attempts</li>
            <li>Protect yourself and your loved ones from fraud</li>
          </ul>
          
          <div className="flex justify-center">
            <Link 
              to="/dashboard" 
              className="bg-primary-600 text-white font-medium py-2 px-6 rounded-md hover:bg-primary-700 transition-colors"
            >
              Explore More ScamShield Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game; 