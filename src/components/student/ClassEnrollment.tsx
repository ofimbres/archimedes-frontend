import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { StudentContext } from '../../contexts/StudentContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { postStudentEnrollment, deleteStudentEnrollment } from '../../libs/apiEndpoints';
import '@fortawesome/fontawesome-svg-core/styles.css';

interface EnrolledPeriod {
  code: string;
  name?: string;
}

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
      if (!studentId || !authContext.sessionInfo?.accessToken) return;
      await deleteStudentEnrollment(studentId, code, authContext.sessionInfo.accessToken);
      studentContext.refreshPeriods();
    } catch (error) {
      console.error('Error removing enrollment:', error);
    }
  };

  const handleAdd = async (): Promise<void> => {
    try {
      if (!studentId || !authContext.sessionInfo?.accessToken || !periodCode.trim()) return;
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
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h2 className="font-display font-bold text-xl text-water-deep mb-4">Enroll in a new class</h2>
      <div className="flex flex-wrap gap-2 mb-8">
        <input
          type="text"
          className="input input-bordered rounded-bubble border-2 border-water-foam flex-1 min-w-[200px]"
          placeholder="Enter class code"
          value={periodCode}
          onChange={(e) => setPeriodCode(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary rounded-bubble"
          onClick={handleAdd}
          disabled={!periodCode.trim()}
        >
          Add class
        </button>
      </div>

      <h2 className="font-display font-bold text-xl text-water-deep mb-4">Your classes</h2>
      {enrolledPeriods.length > 0 ? (
        <ul className="space-y-2">
          {enrolledPeriods.map((period) => (
            <li
              key={period.code}
              className="flex justify-between items-center p-4 bg-base-100 rounded-blob border-2 border-water-foam/50 shadow-sm"
            >
              <div>
                <span className="font-semibold text-water-deep">
                  {period.name || 'Course'}
                </span>
                {period.code && (
                  <span className="text-base-content/70 ml-2">
                    — Code: {period.code}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm text-error"
                onClick={() => handleRemove(period.code)}
                title="Remove enrollment"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-info rounded-bubble">
          <span>You are not enrolled in any classes yet.</span>
        </div>
      )}

      <div className="mt-8">
        <Link to="/" className="btn btn-ghost rounded-bubble gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ClassEnrollment;
