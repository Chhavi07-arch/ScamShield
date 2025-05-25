import React from 'react';
import { MessageSquare, Smartphone, QrCode, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const actions = [
    {
      title: 'Scan Text Message',
      icon: <MessageSquare className="h-5 w-5 text-primary-600" />,
      description: 'Check a suspicious text message',
      link: '/features/message-analyzer',
      color: 'bg-primary-50'
    },
    {
      title: 'Verify Phone Number',
      icon: <Smartphone className="h-5 w-5 text-blue-600" />,
      description: 'Validate a phone number',
      link: '/features/phone-checker',
      color: 'bg-blue-50'
    },
    {
      title: 'Scan QR Code',
      icon: <QrCode className="h-5 w-5 text-green-600" />,
      description: 'Check if a QR code is safe',
      link: '/features/qr-detector',
      color: 'bg-green-50'
    },
    {
      title: 'Check Link',
      icon: <LinkIcon className="h-5 w-5 text-yellow-600" />,
      description: 'Verify if a link is legitimate',
      link: '/features/link-scanner',
      color: 'bg-yellow-50'
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden dashboard-card">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
          <Link to="/features" className="text-sm text-primary-600 hover:text-primary-800 font-medium">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Link 
              key={index}
              to={action.link}
              className={`p-4 rounded-lg ${action.color} hover:shadow-md transition-all relative overflow-hidden group`}
            >
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-white mr-3">
                  {action.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
                    {action.title}
                    {action.soon && (
                      <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">Soon</span>
                    )}
                  </h4>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-white/20 rounded-full transform scale-0 group-hover:scale-100 transition-transform"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions; 