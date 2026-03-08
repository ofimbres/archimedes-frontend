import React, { useEffect, useRef, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Loading } from '../common';

interface Student {
  firstName: string;
  lastName: string;
  id: string;
}

interface ExerciseResult {
  score: number;
  s3Key: string;
  student: Student;
}

interface LocationState {
  classroomId: string;
  studentId: string;
  exerciseId: string;
}

const ExerciseResults: React.FC = () => {
  const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
  const { state } = useLocation() as { state: LocationState };
  const authContext = useContext(AuthContext);
  const [exerciseResults, setExerciseResults] = useState<ExerciseResult[]>([]);
  const [exerciseResult, setExerciseResult] = useState<Partial<ExerciseResult>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const hasFetchedData = useRef<boolean>(false);

  useEffect(() => {
    const fetchExerciseResults = async () => {
      if (hasFetchedData.current) return;
      try {
        setIsLoading(true);
        setError('');
        const headers = new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authContext?.sessionInfo?.accessToken || ''}`,
        });
        const requestOptions: RequestInit = { method: 'GET', headers };
        const { classroomId, studentId, exerciseId } = state;

        const individualResponse = await fetch(
          `${endpoint}/api/v1/periods/${classroomId}/students/${studentId}/exercises/${exerciseId}/scores`,
          requestOptions
        );
        if (!individualResponse.ok) throw new Error('Failed to fetch individual results');
        const individualData = await individualResponse.json();
        setExerciseResult(individualData);

        const classResponse = await fetch(
          `${endpoint}/api/v1/periods/${classroomId}/exercises/${exerciseId}/scores`,
          requestOptions
        );
        if (!classResponse.ok) throw new Error('Failed to fetch class results');
        const classData = await classResponse.json();
        setExerciseResults(classData);
        hasFetchedData.current = true;
      } catch (err) {
        console.error('Error fetching exercise results:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (state?.classroomId && state?.studentId && state?.exerciseId) {
      fetchExerciseResults();
    }
  }, [endpoint, state, authContext?.sessionInfo?.accessToken]);

  if (isLoading) {
    return <Loading text="Loading exercise results…" fullScreen />;
  }

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="alert alert-error rounded-bubble">
          <span className="font-semibold">Error loading results</span>
          <p className="mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const getScoreBadge = (score: number): string => {
    if (score >= 90) return 'badge-success';
    if (score >= 80) return 'badge-primary';
    if (score >= 70) return 'badge-warning';
    return 'badge-error';
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="card bg-base-100 border-2 border-water-foam/50 shadow-xl rounded-blob overflow-hidden">
        <div className="bg-primary text-primary-content p-4">
          <h2 className="font-display font-bold text-xl flex items-center gap-2">
            <span>🏆</span>
            Exercise results
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="card bg-base-200 rounded-bubble border-2 border-primary/30">
              <div className="card-body text-center">
                <h3 className="text-base-content/70 font-medium">Your score</h3>
                <span className={`badge badge-lg ${getScoreBadge(exerciseResult.score || 0)} text-2xl px-4 py-3`}>
                  {exerciseResult.score ?? 0}%
                </span>
              </div>
            </div>
            <div className="card bg-base-200 rounded-bubble border-2 border-info/30">
              <div className="card-body">
                <h3 className="text-base-content/70 font-medium mb-2">Worksheet results</h3>
                {exerciseResult.s3Key ? (
                  <a
                    href={`http://archimedes-exercise-results.s3-website-us-west-2.amazonaws.com/${exerciseResult.s3Key}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm rounded-bubble"
                  >
                    View detailed results
                  </a>
                ) : (
                  <p className="text-base-content/60 text-sm">No detailed results available</p>
                )}
              </div>
            </div>
          </div>

          <h3 className="font-display font-semibold text-water-deep mb-3 flex items-center gap-2">
            <span>👥</span>
            Class results
          </h3>
          {exerciseResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra rounded-bubble border-2 border-base-300">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[...exerciseResults]
                    .sort((a, b) => (b.score || 0) - (a.score || 0))
                    .map((result, index) => (
                      <tr key={result.student.id || index}>
                        <td>
                          <span className={`badge ${index < 3 ? ['badge-warning', 'badge-ghost', 'badge-success'][index] : 'badge-ghost'}`}>
                            #{index + 1}
                          </span>
                        </td>
                        <td>{result.student.firstName}</td>
                        <td>{result.student.lastName}</td>
                        <td><span className={`badge ${getScoreBadge(result.score || 0)}`}>{result.score ?? 0}%</span></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info rounded-bubble">
              <span>No class results available yet.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseResults;
