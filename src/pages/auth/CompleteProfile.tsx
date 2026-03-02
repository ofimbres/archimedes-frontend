import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { AuthContext } from '../../contexts/AuthContext';
import type { CompleteProfileBody } from '../../types/auth';
import './CompleteProfile.css';

const CompleteProfile: React.FC = () => {
  const [role, setRole] = useState<'students' | 'teachers' | ''>('');
  const [joinCode, setJoinCode] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const canSubmit =
    role === 'students'
      ? (joinCode.trim() !== '' && schoolId.trim() === '') ||
        (joinCode.trim() === '' && schoolId.trim() !== '')
      : role === 'teachers' && schoolId.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !authContext.completeProfile) return;
    setIsLoading(true);
    setError('');
    try {
      let body: CompleteProfileBody;
      if (role === 'students') {
        if (joinCode.trim()) {
          body = { userType: 'students', joinCode: joinCode.trim() };
        } else {
          body = { userType: 'students', schoolId: schoolId.trim() };
        }
      } else {
        body = { userType: 'teachers', schoolId: schoolId.trim() };
      }
      await authContext.completeProfile?.(body);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="complete-profile-container d-flex align-items-center">
      <Container className="complete-profile-content">
        <Row className="justify-content-center">
          <Col>
            <div className="complete-profile-card">
              <Link to="/signin" className="complete-profile-back-link">
                ← Back to Sign In
              </Link>

              <div className="text-center mb-4">
                <img
                  src="archimedes-logo.jpg"
                  alt="Archimedes Logo"
                  className="complete-profile-logo"
                />
                <h1 className="complete-profile-title">Complete your profile</h1>
                <p className="complete-profile-subtitle">
                  Tell us who you are so we can set up your experience
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="complete-profile-alert">
                  {error}
                </Alert>
              )}

              {!role ? (
                <div className="complete-profile-role-section">
                  <h2 className="complete-profile-question">I am a…</h2>
                  <div className="complete-profile-role-buttons">
                    <button
                      type="button"
                      onClick={() => setRole('students')}
                      className="complete-profile-role-btn student"
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('teachers')}
                      className="complete-profile-role-btn teacher"
                    >
                      Teacher
                    </button>
                  </div>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  {role === 'students' && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Class join code (from your teacher)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="e.g. AB12X"
                          value={joinCode}
                          onChange={(e) => {
                            setJoinCode(e.target.value);
                            if (e.target.value.trim()) setSchoolId('');
                            setError('');
                          }}
                          disabled={isLoading}
                        />
                      </Form.Group>
                      <p className="complete-profile-or">— or —</p>
                      <Form.Group className="mb-3">
                        <Form.Label>School ID (UUID)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter school UUID"
                          value={schoolId}
                          onChange={(e) => {
                            setSchoolId(e.target.value);
                            if (e.target.value.trim()) setJoinCode('');
                            setError('');
                          }}
                          disabled={isLoading}
                        />
                      </Form.Group>
                    </>
                  )}
                  {role === 'teachers' && (
                    <Form.Group className="mb-3">
                      <Form.Label>School ID (UUID)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your school UUID"
                        value={schoolId}
                        onChange={(e) => {
                          setSchoolId(e.target.value);
                          setError('');
                        }}
                        disabled={isLoading}
                      />
                    </Form.Group>
                  )}

                  <div className="complete-profile-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setRole('');
                        setJoinCode('');
                        setSchoolId('');
                        setError('');
                      }}
                      className="complete-profile-btn-secondary"
                      disabled={isLoading}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={!canSubmit || isLoading}
                      className="complete-profile-btn-primary"
                    >
                      {isLoading ? 'Saving…' : 'Continue'}
                    </button>
                  </div>
                </Form>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CompleteProfile;
