import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useValidUsername, useValidPassword } from '../../hooks/UseAuthHooks';
import { AuthContext } from '../../contexts/AuthContext';
import { getOAuthRedirectUrl } from '../../libs/authApi';

import './SignIn.css';

const SignIn = () => {
  const { username, setUsername, usernameIsValid } = useValidUsername('');
  const { password, setPassword, passwordIsValid } = useValidPassword('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValid =
    !usernameIsValid || username.length === 0 || !passwordIsValid || password.length === 0;

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add('signin-container');
    return () => {
      document.body.classList.remove('signin-container');
    };
  }, [location]);

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { needsProfile } = await authContext.signInWithEmail!(username, password);
      navigate(needsProfile ? '/complete-profile' : '/');
    } catch (err: any) {
      console.error('SignIn error:', err);
      
      if (err.code === 'UserNotConfirmedException') {
        navigate('/verify');
      } else {
        // Handle different types of errors
        let errorMessage = 'Something went wrong. Please try again!';
        
        if (err.message) {
          if (err.message.includes('User not found')) {
            errorMessage = 'No account found with this email. Please check your email or sign up for a new account.';
          } else if (err.message.includes('password')) {
            errorMessage = 'Incorrect password. Please try again.';
          } else if (err.message.includes('network') || err.message.includes('fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.';
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsername = (e: any) => {
    setUsername(e.target.value);
    setError(''); // Clear error when user types
  };

  const handlePassword = (e: any) => {
    setPassword(e.target.value);
    setError(''); // Clear error when user types
  };

  return (
    <div className="signin-container d-flex align-items-center">
      <Container className="signin-content">
        <Row className="justify-content-center">
          <Col>
            <div className="signin-card">
              {/* Back to Home Link */}
              <Link to="/" className="signin-back-link">
                ← Back to Home
              </Link>
              
              {/* Logo */}
              <div className="text-center">
                <img 
                  src="archimedes-logo.jpg" 
                  alt="Archimedes Logo" 
                  className="signin-logo" 
                />
                <h1 className="signin-title">Welcome Back! 👋</h1>
                <p className="signin-subtitle">Sign in to continue your learning adventure</p>
              </div>

              {/* Sign in with Google */}
              <div className="text-center mb-3">
                <a
                  href={getOAuthRedirectUrl()}
                  className="signin-google-btn"
                  role="button"
                >
                  Sign in with Google
                </a>
              </div>
              <p className="text-center text-muted small mb-3">— or sign in with email —</p>

              {/* Error Alert */}
              {error && (
                <Alert className="signin-alert signin-alert-danger">
                  <strong>Oops!</strong> {error}
                </Alert>
              )}

              {/* Sign In Form */}
              <Form onSubmit={handleSignIn}>
                <Form.Group className="signin-form-group">
                  <Form.Label className="signin-form-label">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={username}
                    onChange={handleUsername}
                    className="signin-form-control"
                    disabled={isLoading}
                  />
                </Form.Group>

                <Form.Group className="signin-form-group">
                  <Form.Label className="signin-form-label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePassword}
                    className="signin-form-control"
                    disabled={isLoading}
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  disabled={isValid || isLoading}
                  className="signin-btn-primary"
                >
                  {isLoading && <span className="signin-loading"></span>}
                  {isLoading ? 'Signing In...' : '🚀 Sign In'}
                </Button>
              </Form>

              {/* Links */}
              <div className="text-center">
                <div className="mb-2">
                  Don't have an account?{' '}
                  <Link to="/signup" className="signin-link">
                    Start Learning Today!
                  </Link>
                </div>
                <div>
                  <Link to="/requestcode" className="signin-link">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignIn;
