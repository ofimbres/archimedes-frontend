import React from 'react';
import { Spinner, Container, Row, Col } from 'react-bootstrap';

interface LoadingProps {
  size?: 'sm';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

/**
 * Reusable Loading component with Bootstrap spinner
 * Can be used as inline loading or full-screen overlay
 */
const Loading: React.FC<LoadingProps> = ({
  size,
  variant = 'primary',
  text = 'Loading...',
  fullScreen = false,
  className = '',
}) => {
  const spinnerContent = (
    <div className={`d-flex flex-column align-items-center ${className}`}>
      <Spinner animation="border" variant={variant} size={size} role="status" aria-hidden="true" />
      {text && <span className="mt-2 text-muted">{text}</span>}
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <Container fluid className="vh-100">
        <Row className="h-100 justify-content-center align-items-center">
          <Col xs="auto">{spinnerContent}</Col>
        </Row>
      </Container>
    );
  }

  return spinnerContent;
};

export default Loading;
