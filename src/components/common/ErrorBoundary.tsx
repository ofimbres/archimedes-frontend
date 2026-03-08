import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
          <div className="card w-full max-w-lg bg-base-100 border-2 border-error shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-error">Oops! Something went wrong</h2>
              <p className="text-base-content">
                We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              <button type="button" className="btn btn-primary rounded-bubble" onClick={() => window.location.reload()}>
                Refresh Page
              </button>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-base-content/70">Error Details (Development Only)</summary>
                  <pre className="mt-2 p-4 bg-base-200 rounded-lg text-sm overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
