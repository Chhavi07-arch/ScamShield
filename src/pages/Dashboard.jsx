import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, MessageSquare, Link as LinkIcon, Smartphone } from 'lucide-react';
import '../components/Dashboard/Dashboard.css';

// Import dashboard components
import StatsCard from '../components/Dashboard/StatsCard';
import QuickActions from '../components/Dashboard/QuickActions';
import NewsCarousel from '../components/Dashboard/NewsCarousel';
import ScamChart from '../components/Dashboard/ScamChart';
import ErrorBoundary from '../components/Dashboard/ErrorBoundary';

const Dashboard = () => {
  // Mock data for statistics
  const stats = [
    {
      title: 'Total Scams Detected',
      value: '1,247',
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      change: '12%',
      changeType: 'increase',
      bgColor: 'bg-gradient-to-br from-red-500 to-red-600 text-white'
    },
    {
      title: 'Messages Analyzed',
      value: '5,892',
      icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
      change: '8%',
      changeType: 'increase'
    },
    {
      title: 'Links Checked',
      value: '3,451',
      icon: <LinkIcon className="h-6 w-6 text-yellow-500" />,
      change: '5%',
      changeType: 'increase'
    },
    {
      title: 'Protection Status',
      value: 'Active',
      icon: <Shield className="h-6 w-6 text-green-500" />,
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600 text-white'
    }
  ];

  // Mock data for charts
  const monthlyScamData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'SMS Scams',
        data: [65, 78, 90, 85, 112, 126],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Email Scams',
        data: [45, 58, 63, 75, 82, 95],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Phone Scams',
        data: [30, 42, 38, 45, 55, 60],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const scamTypeData = {
    labels: ['Phishing', 'Identity Theft', 'Tech Support', 'Romance', 'Investment', 'Other'],
    datasets: [
      {
        label: 'Scam Types',
        data: [35, 25, 15, 10, 8, 7],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderWidth: 0,
      }
    ]
  };

  // Animation for stats cards
  const [animateStats, setAnimateStats] = useState(false);
  useEffect(() => {
    setAnimateStats(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your scam protection overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`transform transition-all duration-500 ${
              animateStats ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} 
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ErrorBoundary fallbackTitle="Chart Error" fallbackMessage="We couldn't load the scam trends chart">
          <ScamChart 
            data={monthlyScamData} 
            type="line" 
            title="Monthly Scam Trends"
          />
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="Chart Error" fallbackMessage="We couldn't load the scam types chart">
          <ScamChart 
            data={scamTypeData} 
            type="bar" 
            title="Scam Types Distribution"
          />
        </ErrorBoundary>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <QuickActions />
      </div>

      {/* News Carousel */}
      <div className="mb-8">
        <NewsCarousel />
      </div>
    </div>
  );
};

export default Dashboard; 