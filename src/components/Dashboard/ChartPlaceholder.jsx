import React from 'react';

const ChartPlaceholder = ({ title, height = 300, isLoading = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden dashboard-card">
      <div className="p-6">
        {title && <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>}
        <div 
          style={{ height: `${height}px` }}
          className="flex flex-col items-center justify-center bg-gray-50 rounded-lg"
        >
          {isLoading ? (
            <>
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-3"></div>
              <p className="text-gray-500 text-sm">Loading chart data...</p>
            </>
          ) : (
            <>
              <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-gray-500 text-sm">Chart could not be loaded</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartPlaceholder; 