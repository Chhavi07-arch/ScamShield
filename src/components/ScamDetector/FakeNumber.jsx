import React, { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const FakeNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // This is a placeholder for actual validation logic
    // In a real app, this would connect to a backend service
    const isSuspicious = 
      phoneNumber.startsWith('+1800') || 
      phoneNumber.startsWith('+1888') || 
      phoneNumber.length < 10;
    
    setResult({
      isSuspicious,
      message: isSuspicious 
        ? 'This number shows signs of being potentially fraudulent.' 
        : 'No obvious red flags detected with this number.'
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-primary-800 mb-4">Phone Number Validator</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover-darker-red transition-colors"
        >
          Check Number
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-3 rounded-md ${
          result.isSuspicious ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {result.isSuspicious ? (
                <AlertTriangle className="h-5 w-5 text-red-400" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-400" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm ${
                result.isSuspicious ? 'text-red-700' : 'text-green-700'
              }`}>
                {result.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeNumber; 