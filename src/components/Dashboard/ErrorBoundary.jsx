import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.log('Chart error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-2">{this.props.fallbackTitle || 'Something went wrong'}</h3>
          <p className="text-gray-600 mb-4">{this.props.fallbackMessage || 'We could not load this component'}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover-darker-red"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 