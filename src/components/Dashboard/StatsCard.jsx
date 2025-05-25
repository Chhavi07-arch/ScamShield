import React from 'react';

const StatsCard = ({ title, value, icon, change, changeType, bgColor }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${bgColor ? bgColor : ''} dashboard-card`}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
          </div>
          <div className={`p-3 rounded-full ${bgColor ? 'bg-white/20' : 'bg-primary-50'}`}>
            {icon}
          </div>
        </div>
        
        {change && (
          <div className="flex items-center mt-4">
            <span className={`text-xs font-medium ${
              changeType === 'increase' ? 'text-green-500' : 
              changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'
            } flex items-center`}>
              {changeType === 'increase' && (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                </svg>
              )}
              {changeType === 'decrease' && (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              )}
              {change}
            </span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard; 