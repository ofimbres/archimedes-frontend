import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { StudentContext } from '../../contexts/StudentContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { postStudentEnrollment, deleteStudentEnrollment } from '../../libs/apiEndpoints';

import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

interface EnrolledPeriod {
  code: string;
  name?: string;
  // Add other period properties as needed
}

/**
 * ClassEnrollment component for managing student period enrollments
 * Allows students to enroll in new periods and remove existing enrollments
 */
const ClassEnrollment: React.FC = () => {
  const authContext = useContext(AuthContext);
  const studentContext = useContext(StudentContext);

  const [enrolledPeriods, setEnrolledPeriods] = useState<EnrolledPeriod[]>([]);
  const [periodCode, setPeriodCode] = useState<string>('');

  const studentId =
    authContext.sessionInfo?.user_type === 'students' && authContext.sessionInfo?.profile
      ? (authContext.sessionInfo.profile as { id: string }).id
      : undefined;

  const handleRemove = async (code: string): Promise<void> => {
    try {
      if (!studentId || !authContext.sessionInfo?.accessToken) {
        console.error('Missing student ID or access token');
        return;
      }

      await deleteStudentEnrollment(studentId, code, authContext.sessionInfo.accessToken);
      studentContext.refreshPeriods();
    } catch (error) {
      console.error('Error removing enrollment:', error);
    }
  };

  const handleAdd = async (): Promise<void> => {
    try {
      if (!studentId || !authContext.sessionInfo?.accessToken || !periodCode.trim()) {
        console.error('Missing required data for enrollment');
        return;
      }

      await postStudentEnrollment(studentId, periodCode, authContext.sessionInfo.accessToken);
      studentContext.refreshPeriods();
      setPeriodCode('');
    } catch (error) {
      console.error('Error adding enrollment:', error);
    }
  };

  useEffect(() => {
    setEnrolledPeriods(studentContext.availablePeriods);
  }, [studentContext.availablePeriods]);

  return (
    <div className="container mt-5 text-start">
      {/* Enroll in a New Period */}
      <div className="row">
        <h4 className="fs-5 mb-3">Enroll in a New Period</h4>
        <div className="d-flex mb-4">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Enter period code"
            value={periodCode}
            onChange={e => setPeriodCode(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAdd} disabled={!periodCode.trim()}>
            Add Period
          </button>
        </div>
      </div>

      {/* Enrolled Periods */}
      <div className="row">
        <h4 className="fs-5 mb-3">Your Enrolled Periods</h4>
        {enrolledPeriods.length > 0 ? (
          <div className="list-group">
            {enrolledPeriods.map(period => (
              <div
                key={period.code}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{period.code}</strong>
                  {period.name && <span className="text-muted ms-2">- {period.name}</span>}
                </div>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleRemove(period.code)}
                  title="Remove enrollment"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            <p className="mb-0">You are not enrolled in any periods yet.</p>
          </div>
        )}
      </div>

      <div className="row mt-4">
        <div className="col">
          <Link to="/" className="btn btn-secondary">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassEnrollment;
