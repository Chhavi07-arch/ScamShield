import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, BarChart3, Smartphone, QrCode, Link as LinkIcon, Lock, Bell, ArrowRight } from 'lucide-react';
import NewsTicker from '../components/NewsTicker';
import AOS from 'aos';

const Home = () => {
  const featureCardsRef = useRef([]);

  // Re-initialize AOS when component mounts
  useEffect(() => {
    AOS.refresh();
    
    // Fallback for animation if AOS doesn't work
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const direction = entry.target.getAttribute('data-direction');
          if (direction === 'right') {
            entry.target.classList.add('slide-in-left');
          } else if (direction === 'left') {
            entry.target.classList.add('slide-in-right');
          }
        }
      });
    }, { threshold: 0.1 });

    // Get all feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      observer.observe(card);
    });

    return () => {
      featureCards.forEach(card => {
        observer.unobserve(card);
      });
    };
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-gray-900 via-primary-900 to-primary-800 text-white min-h-[80vh] flex items-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-primary-400/10 rounded-full blur-xl"></div>
          
          {/* Shield pattern in background */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-10 gap-4 rotate-12 scale-150">
              {Array.from({ length: 100 }).map((_, i) => (
                <Shield key={i} className="text-white" size={20} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 animate-fadeIn">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Discover the <span className="text-primary-400">Power</span> of ScamShield
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-xl">
                A revolutionary anti-scam app designed to protect you from the ever-evolving landscape of online fraud
              </p>
              <p className="text-lg mb-10 text-gray-300 max-w-xl">
                In today's digital world, scammers are becoming increasingly sophisticated. ScamShield uses advanced AI technology to detect and prevent scams before they can harm you or your loved ones.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/dashboard" 
                  className="bg-primary-600 text-white font-medium py-3 px-8 rounded-md hover-darker-red transition-colors transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Get Started
                </Link>
                <Link 
                  to="/features" 
                  className="bg-transparent text-white font-medium py-3 px-8 rounded-md border border-white hover:bg-white/10 hover-white-text transition-colors transform hover:-translate-y-1"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                {/* Phone mockup */}
                <div className="w-[280px] h-[580px] bg-gray-900 rounded-[3rem] border-4 border-gray-800 p-3 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  {/* Phone screen */}
                  <div className="w-full h-full bg-gray-100 rounded-[2.5rem] overflow-hidden relative">
                    {/* App interface mockup */}
                    <div className="w-full h-full flex flex-col">
                      {/* Status bar */}
                      <div className="h-6 bg-primary-700 flex justify-between items-center px-4">
                        <span className="text-white text-xs">9:41</span>
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5z" />
                            <path d="M8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7z" />
                            <path d="M14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* App header */}
                      <div className="bg-primary-600 p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-white mr-2" />
                          <span className="text-white font-bold">ScamShield</span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-bold">U</span>
                        </div>
                      </div>
                      
                      {/* App content */}
                      <div className="flex-1 bg-white p-3 overflow-hidden">
                        <div className="bg-primary-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                              <Shield className="h-4 w-4 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="text-xs font-bold text-primary-800">Scam Detection</h3>
                              <p className="text-[10px] text-gray-500">Active Protection</p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-primary-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {[
                            { icon: <AlertTriangle className="h-3 w-3 text-primary-600" />, text: "Suspicious SMS Detected" },
                            { icon: <Lock className="h-3 w-3 text-green-600" />, text: "Email Protection Active" },
                            { icon: <Bell className="h-3 w-3 text-yellow-600" />, text: "New Scam Alert" }
                          ].map((item, i) => (
                            <div key={i} className="flex items-center bg-gray-100 rounded p-2">
                              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-2">
                                {item.icon}
                              </div>
                              <span className="text-[10px]">{item.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements around phone */}
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary-500 rounded-full blur-xl opacity-60"></div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary-400 rounded-full blur-xl opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              At ScamShield, we're dedicated to empowering individuals and businesses to navigate the digital landscape with confidence
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                  <Shield className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Transactions</h3>
                <p className="text-gray-600">
                  Our cutting-edge technology and user-friendly features provide the ultimate protection
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                  <AlertTriangle className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Proactive Alerts</h3>
                <p className="text-gray-600">
                  Real-time notifications keep you informed of emerging threats
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                  <BarChart3 className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Detailed Reporting</h3>
                <p className="text-gray-600">
                  Through comprehensive analysis and data-driven insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Stay Informed</h2>
            <NewsTicker />
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">Powerful Protection Features</h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            ScamShield offers comprehensive tools to keep you safe from all types of scams
          </p>
          
          <div className="max-w-5xl mx-auto space-y-24">
            {/* Text Message Analysis */}
            <div className="feature-card" data-aos="fade-right" data-direction="right" ref={el => featureCardsRef.current[0] = el}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-gradient-to-br from-primary-700 to-primary-900 p-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Text Message Analysis</h3>
                  <p className="text-gray-600 mb-4">
                    Detect suspicious text messages and identify potential scams with our advanced AI analysis. Our system can recognize urgent language, suspicious links, and other common tactics used by scammers.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">Phishing Detection</span>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">URL Analysis</span>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">Risk Assessment</span>
                  </div>
                  <Link 
                    to="/features/message-analyzer" 
                    className="inline-flex items-center text-primary-600 font-medium hover:text-primary-800 transition-colors hover:translate-x-1 transition-transform"
                  >
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Phone Number Validation */}
            <div className="feature-card ml-auto" data-aos="fade-left" data-direction="left" ref={el => featureCardsRef.current[1] = el}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 flex flex-col md:flex-row-reverse">
                <div className="md:w-1/3 bg-gradient-to-br from-primary-700 to-primary-900 p-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                    <Smartphone className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Phone Number Validation</h3>
                  <p className="text-gray-600 mb-4">
                    Verify if a phone number is legitimate or potentially fraudulent before you respond. Our system checks against known scam patterns and identifies spoofed caller IDs to keep you safe.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">Scam Number Detection</span>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">Caller ID Verification</span>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">Safety Recommendations</span>
                  </div>
                  <Link 
                    to="/features/phone-checker" 
                    className="inline-flex items-center text-primary-600 font-medium hover:text-primary-800 transition-colors hover:translate-x-1 transition-transform"
                  >
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* QR Code Scanner */}
            <div className="feature-card" data-aos="fade-right" data-direction="right" ref={el => featureCardsRef.current[2] = el}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-gradient-to-br from-primary-700 to-primary-900 p-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                    <QrCode className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">QR Code Scanner</h3>
                  <p className="text-gray-600 mb-4">
                    Scan QR codes safely to ensure they don't lead to malicious websites or phishing attempts. Our scanner previews the destination URL and checks against a database of known malicious sites.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">URL Preview</span>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">Malicious Site Detection</span>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">Risk Analysis</span>
                  </div>
                  <div className="flex items-center">
                    <Link 
                      to="/features/qr-detector" 
                      className="inline-flex items-center text-primary-600 font-medium hover:text-primary-800 transition-colors hover:translate-x-1 transition-transform"
                    >
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Link Scanner */}
            <div className="feature-card ml-auto" data-aos="fade-left" data-direction="left" ref={el => featureCardsRef.current[3] = el}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 flex flex-col md:flex-row-reverse">
                <div className="md:w-1/3 bg-gradient-to-br from-primary-700 to-primary-900 p-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                    <LinkIcon className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Link Scanner</h3>
                  <p className="text-gray-600 mb-4">
                    Check if a link is safe before clicking by analyzing its destination for potential threats. Our scanner expands shortened URLs and detects lookalike domains designed to trick users.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">URL Expansion</span>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">Phishing Detection</span>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">Safety Rating</span>
                  </div>
                  <div className="flex items-center">
                    <Link 
                      to="/features/link-scanner" 
                      className="inline-flex items-center text-primary-600 font-medium hover:text-primary-800 transition-colors hover:translate-x-1 transition-transform"
                    >
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link
              to="/features"
              className="inline-block bg-primary-600 text-white font-medium py-3 px-8 rounded-md hover-darker-red transition-colors transform hover:-translate-y-1 hover:shadow-lg"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Protect Yourself?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of users who trust ScamShield to keep them safe from scams
          </p>
          <Link
            to="/game"
            className="inline-block bg-primary-600 text-white font-medium py-3 px-6 rounded-md hover-darker-red transition-colors"
          >
            Play Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 