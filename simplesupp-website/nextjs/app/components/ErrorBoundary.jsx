'use client';

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--txt)] p-4 sm:p-8">
          <div className="max-w-2xl w-full glass-card p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-red-400">Something went wrong</h1>
            <p className="text-base sm:text-lg mb-4 text-[var(--txt-muted)]">
              We encountered an error while loading the page. Please try refreshing.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mt-6 w-full sm:w-auto"
            >
              Reload Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6">
                <summary className="cursor-pointer text-[var(--acc)] mb-2 text-sm">Developer Details</summary>
                <pre className="bg-[var(--bg-elev-1)] p-4 rounded overflow-auto text-xs mt-2">
                  {this.state.error?.toString()}
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

