import React from 'react';
import { Shield, AlertTriangle, Link as LinkIcon, MessageSquare, CheckCircle } from 'lucide-react';

const ActivityFeed = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'scam-detected':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'message-analyzed':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'link-checked':
        return <LinkIcon className="h-4 w-4 text-yellow-500" />;
      case 'protection-active':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'safe':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Shield className="h-4 w-4 text-primary-500" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'scam-detected':
        return 'Scam Detected';
      case 'message-analyzed':
        return 'Message Analyzed';
      case 'link-checked':
        return 'Link Checked';
      case 'protection-active':
        return 'Protection Active';
      case 'safe':
        return 'Safe Content';
      default:
        return 'Activity';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - activityTime) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden dashboard-card">
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start activity-item-animate" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {getIcon(activity.type)}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activity.type === 'scam-detected' ? 'bg-red-100 text-red-800' :
                        activity.type === 'safe' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getTypeLabel(activity.type)}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">{getTimeAgo(activity.timestamp)}</span>
                    </div>
                  </div>
                  {activity.action && (
                    <button className="text-xs text-primary-600 hover:text-primary-800 font-medium">
                      {activity.action}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed; 