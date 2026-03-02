import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { useValidCode, useValidUsername } from '../../hooks/UseAuthHooks';
import { AuthContext } from '../../contexts/AuthContext';
import './Auth.css';

const VerifyCode: React.FC = () => {
  const { username, setUsername, usernameIsValid } = useValidUsername('');
  const { code, setCode, codeIsValid } = useValidCode('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const isValid = !usernameIsValid || username.length === 0 || !codeIsValid || code.length === 0;

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await authContext.verifyCode?.(username, code);
      navigate('/signin');
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    
    try {
      // Assuming there's a resend code method
      // await authContext.resendCode(username);
      // For now, just navigate to password reset
      navigate('/resetpassword');
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const clearError = () => setError('');

  return (
    <div className="auth-container d-flex align-items-center">
      <Container className="auth-content">
        <Row className="justify-content-center">
          <Col>
            <div className="auth-card">
              {/* Back Link */}
              <Link to="/signin" className="auth-back-link">
                ← Back to Sign In
              </Link>
              
              {/* Logo and Title */}
              <div className="text-center">
                <img 
                  src="archimedes-logo.jpg" 
                  alt="Archimedes Logo" 
                  className="auth-logo" 
                />
                <h1 className="auth-title">Verify Your Email 📧</h1>
                <p className="auth-subtitle">
                  We sent a verification code to your email.<br />
                  Please enter the code below to continue.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="auth-alert auth-alert-danger">
                  <strong>Oops!</strong> {error}
                </Alert>
              )}

              {/* Verification Form */}
              <Form>
                <Form.Group className="auth-form-group">
                  <Form.Label className="auth-form-label">Username/Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username or email"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); clearError(); }}
                    className={`auth-form-control ${!usernameIsValid && username ? 'invalid' : ''}`}
                    disabled={isLoading}
                  />
                  {!usernameIsValid && username && (
                    <div className="form-feedback invalid">Please enter a valid username or email</div>
                  )}
                </Form.Group>

                <Form.Group className="auth-form-group">
                  <Form.Label className="auth-form-label">Verification Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); clearError(); }}
                    className={`auth-form-control auth-code-input ${!codeIsValid && code ? 'invalid' : ''}`}
                    disabled={isLoading}
                    maxLength={6}
                  />
                  {!codeIsValid && code && (
                    <div className="form-feedback invalid">Please enter a valid 6-digit code</div>
                  )}
                </Form.Group>

                {/* Action Buttons */}
                <button 
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isValid || isLoading}
                  className="auth-btn-primary"
                >
                  {isLoading && <span className="auth-loading"></span>}
                  {isLoading ? 'Verifying...' : '✅ Verify Code'}
                </button>

                <button 
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="auth-btn-secondary"
                >
                  {isResending && <span className="auth-loading" style={{borderTopColor: 'var(--primary-blue)'}}></span>}
                  {isResending ? 'Resending...' : '📤 Resend Code'}
                </button>
              </Form>

              {/* Help Text */}
              <div className="text-center mt-3">
                <small className="text-muted">
                  Didn't receive a code? Check your spam folder or{' '}
                  <button 
                    onClick={handleResendCode}
                    className="auth-link"
                    style={{background: 'none', border: 'none', padding: 0}}
                    disabled={isResending}
                  >
                    try again
                  </button>
                </small>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VerifyCode;
