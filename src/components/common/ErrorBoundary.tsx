import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Provides a fallback UI with Bootstrap styling when errors occur
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console or external service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or default error message
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container className="mt-5">
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="border-danger">
                <Card.Header className="bg-danger text-white">
                  <h4 className="mb-0">Oops! Something went wrong</h4>
                </Card.Header>
                <Card.Body>
                  <p className="mb-3">
                    We're sorry, but something unexpected happened. Please try refreshing the page.
                  </p>
                  <button className="btn btn-primary" onClick={() => window.location.reload()}>
                    Refresh Page
                  </button>
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="mt-3">
                      <summary className="text-muted">Error Details (Development Only)</summary>
                      <pre className="mt-2 p-2 bg-light border rounded">
                        {this.state.error.toString()}
                      </pre>
                    </details>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
