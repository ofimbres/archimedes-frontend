import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Alert, Button } from 'react-bootstrap';
import {
  useValidEmail,
  useValidPassword,
  useValidUsername,
  useValidGivenName,
  useValidFamilyName,
} from '../../hooks/UseAuthHooks';
import { AuthContext } from '../../contexts/AuthContext';
import './SignUp.css';

const SignUp: React.FC = () => {
  const { email, setEmail, emailIsValid } = useValidEmail('');
  const { password, setPassword, passwordIsValid } = useValidPassword('');
  const { username, setUsername, usernameIsValid } = useValidUsername('');
  const { givenName, setGivenName, givenNameIsValid } = useValidGivenName('');
  const { familyName, setFamilyName, familyNameIsValid } = useValidFamilyName('');
  const [error, setError] = useState('');
  const [created, setCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    password: passwordConfirm,
    setPassword: setPasswordConfirm,
    passwordIsValid: passwordConfirmIsValid,
  } = useValidPassword('');

  const isValid =
    !emailIsValid ||
    email.length === 0 ||
    !usernameIsValid ||
    username.length === 0 ||
    !passwordIsValid ||
    password.length === 0 ||
    !passwordConfirmIsValid ||
    passwordConfirm.length === 0 ||
    !givenNameIsValid ||
    givenName.length === 0 ||
    !familyNameIsValid ||
    familyName.length === 0 ||
    password !== passwordConfirm;

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authContext.signUpWithEmail!(
        givenName,
        familyName,
        username,
        email,
        password
      );
      setCreated(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Something went wrong. Please try again!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError('');

  return (
    <div className="signup-container d-flex align-items-center">
      <Container className="signup-content">
        <Row className="justify-content-center">
          <Col>
            <div className="signup-card">
              <Link to="/" className="signup-back-link">
                ← Back to Home
              </Link>

              <div className="text-center">
                <img
                  src="archimedes-logo.jpg"
                  alt="Archimedes Logo"
                  className="signup-logo"
                />
                <h1 className="signup-title">Join Archimedes!</h1>
                <p className="signup-subtitle">
                  Create your account. You&apos;ll set up your role and school
                  after verifying your email.
                </p>
              </div>

              {!created ? (
                <Form onSubmit={handleSignUp}>
                  {error && (
                    <Alert className="signup-alert signup-alert-danger">
                      <strong>Oops!</strong> {error}
                    </Alert>
                  )}

                  <Row>
                    <Col md={6}>
                      <Form.Group className="signup-form-group">
                        <Form.Label className="signup-form-label">
                          First Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your first name"
                          value={givenName}
                          onChange={(e) => {
                            setGivenName(e.target.value);
                            clearError();
                          }}
                          className={`signup-form-control ${!givenNameIsValid && givenName ? 'invalid' : ''}`}
                          disabled={isLoading}
                        />
                        {!givenNameIsValid && givenName && (
                          <div className="form-feedback invalid">
                            Please enter a valid first name
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="signup-form-group">
                        <Form.Label className="signup-form-label">
                          Last Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your last name"
                          value={familyName}
                          onChange={(e) => {
                            setFamilyName(e.target.value);
                            clearError();
                          }}
                          className={`signup-form-control ${!familyNameIsValid && familyName ? 'invalid' : ''}`}
                          disabled={isLoading}
                        />
                        {!familyNameIsValid && familyName && (
                          <div className="form-feedback invalid">
                            Please enter a valid last name
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="signup-form-group">
                    <Form.Label className="signup-form-label">
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError();
                      }}
                      className={`signup-form-control ${!emailIsValid && email ? 'invalid' : ''}`}
                      disabled={isLoading}
                    />
                    {!emailIsValid && email && (
                      <div className="form-feedback invalid">
                        Please enter a valid email address
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="signup-form-group">
                    <Form.Label className="signup-form-label">Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        clearError();
                      }}
                      className={`signup-form-control ${!usernameIsValid && username ? 'invalid' : ''}`}
                      disabled={isLoading}
                    />
                    {!usernameIsValid && username && (
                      <div className="form-feedback invalid">
                        Username must be at least 3 characters
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="signup-form-group">
                    <Form.Label className="signup-form-label">
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError();
                      }}
                      className={`signup-form-control ${!passwordIsValid && password ? 'invalid' : ''}`}
                      disabled={isLoading}
                    />
                    {!passwordIsValid && password && (
                      <div className="form-feedback invalid">
                        Password must be at least 8 characters with uppercase,
                        lowercase, and number
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="signup-form-group">
                    <Form.Label className="signup-form-label">
                      Confirm Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm your password"
                      value={passwordConfirm}
                      onChange={(e) => {
                        setPasswordConfirm(e.target.value);
                        clearError();
                      }}
                      className={`signup-form-control ${password !== passwordConfirm && passwordConfirm ? 'invalid' : ''}`}
                      disabled={isLoading}
                    />
                    {password !== passwordConfirm && passwordConfirm && (
                      <div className="form-feedback invalid">
                        Passwords don&apos;t match
                      </div>
                    )}
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={isValid || isLoading}
                    className="signup-btn-primary w-100"
                  >
                    {isLoading && <span className="signup-loading" />}
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </Form>
              ) : (
                <div className="signup-success">
                  <div className="signup-success-icon">🎉</div>
                  <h2 className="signup-success-title">
                    Welcome aboard, {givenName}!
                  </h2>
                  <p className="signup-success-message">
                    Your account has been created. We&apos;ve sent a verification
                    code to <strong>{email}</strong>
                  </p>
                  <p className="signup-success-note text-muted small">
                    After verifying, you&apos;ll sign in and complete your
                    profile (role and school).
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/verify')}
                    className="signup-btn-primary"
                  >
                    Verify Email
                  </button>
                </div>
              )}

              <div className="text-center mt-3">
                Already have an account?{' '}
                <Link to="/signin" className="signup-link">
                  Sign in
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUp;
