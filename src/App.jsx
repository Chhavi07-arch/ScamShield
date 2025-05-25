import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import './App.css'

// Import pages
import Home from './pages/Home'
import Features from './pages/Features'
import Dashboard from './pages/Dashboard'
import Game from './pages/Game'
import FeaturePhoneChecker from './pages/FeaturePhoneChecker'
import FeatureMessageAnalyzer from './pages/FeatureMessageAnalyzer'
import FeatureQRDetector from './pages/FeatureQRDetector'
import FeatureLinkScanner from './pages/FeatureLinkScanner'

// Import components
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full flex flex-col bg-gray-50">
        <Navbar />
        
        {/* Main content with top padding to account for fixed navbar */}
        <main className="flex-grow w-full pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/features/phone-checker" element={<FeaturePhoneChecker />} />
            <Route path="/features/message-analyzer" element={<FeatureMessageAnalyzer />} />
            <Route path="/features/qr-detector" element={<FeatureQRDetector />} />
            <Route path="/features/link-scanner" element={<FeatureLinkScanner />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </main>

        <footer className="bg-gray-900 text-white py-8 w-full">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Shield className="h-6 w-6 text-primary-400" />
                <span className="text-lg font-bold">ScamShield</span>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </a>
              </div>
            </div>
            <div className="mt-6 text-center text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} ScamShield. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
