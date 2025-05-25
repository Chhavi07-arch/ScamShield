import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleFeaturesDropdown = () => {
    setFeaturesDropdownOpen(!featuresDropdownOpen);
  };

  // Handle scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu and dropdowns when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setFeaturesDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (featuresDropdownOpen && !event.target.closest('.features-dropdown')) {
        setFeaturesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [featuresDropdownOpen]);

  return (
    <header 
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900 shadow-lg' : 'bg-gray-900/95'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-white">ScamShield</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/">Home</NavLink>
            
            {/* Features dropdown */}
            <div className="relative features-dropdown">
              <button
                onClick={toggleFeaturesDropdown}
                className={`flex items-center space-x-1 ${
                  location.pathname.includes('/features') 
                    ? 'text-primary-500 font-medium' 
                    : 'text-gray-300 hover:text-primary-400'
                } transition-colors duration-200`}
              >
                <span>Features</span>
                <ChevronDown size={16} className={`transition-transform ${featuresDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {featuresDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-md shadow-lg py-2 w-64 z-50">
                  <Link 
                    to="/features" 
                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-primary-400"
                  >
                    All Features
                  </Link>
                  <div className="border-t border-gray-700 my-1"></div>
                  <Link 
                    to="/features/phone-checker" 
                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-primary-400"
                  >
                    Fake Phone Number Checker
                  </Link>
                  <Link 
                    to="/features/message-analyzer" 
                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-primary-400"
                  >
                    Message/Text Scam Analyzer
                  </Link>
                  <Link 
                    to="/features/qr-detector" 
                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-primary-400"
                  >
                    QR Code & Image Detector
                  </Link>
                  <Link 
                    to="/features/link-scanner" 
                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-primary-400"
                  >
                    Link Safety Scanner
                  </Link>
                </div>
              )}
            </div>
            
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/game">Game</NavLink>
            <Link 
              to="/dashboard" 
              className="bg-primary-600 text-white py-2 px-4 rounded-md hover-darker-red transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile navigation */}
      <div 
        className={`md:hidden bg-gray-900 overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <nav className="container mx-auto px-4 py-2 flex flex-col space-y-4">
          <NavLink mobile to="/">Home</NavLink>
          
          {/* Mobile Features dropdown */}
          <div className="relative">
            <button
              onClick={toggleFeaturesDropdown}
              className={`flex items-center justify-between w-full py-2 ${
                location.pathname.includes('/features') 
                  ? 'text-primary-500 font-medium' 
                  : 'text-gray-300'
              } transition-colors duration-200`}
            >
              <span>Features</span>
              <ChevronDown size={16} className={`transition-transform ${featuresDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {featuresDropdownOpen && (
              <div className="pl-4 mt-2 space-y-2 border-l border-gray-700">
                <Link 
                  to="/features" 
                  className="block py-1 text-gray-300 hover:text-primary-400"
                >
                  All Features
                </Link>
                <Link 
                  to="/features/phone-checker" 
                  className="block py-1 text-gray-300 hover:text-primary-400"
                >
                  Fake Phone Number Checker
                </Link>
                <Link 
                  to="/features/message-analyzer" 
                  className="block py-1 text-gray-300 hover:text-primary-400"
                >
                  Message/Text Scam Analyzer
                </Link>
                <Link 
                  to="/features/qr-detector" 
                  className="block py-1 text-gray-300 hover:text-primary-400"
                >
                  QR Code & Image Detector
                </Link>
                <Link 
                  to="/features/link-scanner" 
                  className="block py-1 text-gray-300 hover:text-primary-400"
                >
                  Link Safety Scanner
                </Link>
              </div>
            )}
          </div>
          
          <NavLink mobile to="/dashboard">Dashboard</NavLink>
          <NavLink mobile to="/game">Game</NavLink>
          <Link 
            to="/dashboard" 
            className="bg-primary-600 text-white py-2 px-4 rounded-md hover-darker-red transition-colors inline-block"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
};

// Helper component for navigation links
const NavLink = ({ to, children, mobile }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`${mobile ? 'block py-2' : ''} ${
        isActive 
          ? 'text-primary-500 font-medium' 
          : 'text-gray-300 hover:text-primary-400'
      } transition-colors duration-200`}
    >
      {children}
    </Link>
  );
};

export default Navbar; 