import React, { useEffect, useRef, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Alert, Badge } from 'react-bootstrap';
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

/**
 * ExerciseResults Component - Displays student's exercise results and leaderboard
 * Shows individual score and comparison with other students in the class
 */
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

        const requestOptions: RequestInit = {
          method: 'GET',
          headers,
        };

        const { classroomId, studentId, exerciseId } = state;

        // Fetch individual student result
        const individualResponse = await fetch(
          `${endpoint}/api/v1/periods/${classroomId}/students/${studentId}/exercises/${exerciseId}/scores`,
          requestOptions
        );

        if (!individualResponse.ok) {
          throw new Error('Failed to fetch individual results');
        }

        const individualData = await individualResponse.json();
        setExerciseResult(individualData);

        // Fetch class results
        const classResponse = await fetch(
          `${endpoint}/api/v1/periods/${classroomId}/exercises/${exerciseId}/scores`,
          requestOptions
        );

        if (!classResponse.ok) {
          throw new Error('Failed to fetch class results');
        }

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
    return <Loading text="Loading exercise results..." fullScreen />;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Results</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  const getScoreBadgeVariant = (score: number): string => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'primary';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h2 className="mb-0">
                <i className="bi bi-trophy-fill me-2"></i>
                Exercise Results
              </h2>
            </Card.Header>
            <Card.Body>
              {/* Individual Score Section */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="border-primary">
                    <Card.Body className="text-center">
                      <h4 className="text-muted mb-2">Your Score</h4>
                      <Badge
                        bg={getScoreBadgeVariant(exerciseResult.score || 0)}
                        className="fs-1 p-3"
                      >
                        {exerciseResult.score || 0}%
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-info">
                    <Card.Body>
                      <h5 className="text-muted mb-3">Worksheet Results</h5>
                      {exerciseResult.s3Key ? (
                        <a
                          href={`http://archimedes-exercise-results.s3-website-us-west-2.amazonaws.com/${exerciseResult.s3Key}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-info"
                        >
                          <i className="bi bi-file-earmark-text me-2"></i>
                          View Detailed Results
                        </a>
                      ) : (
                        <p className="text-muted">No detailed results available</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Class Leaderboard */}
              <div className="mt-4">
                <h4 className="mb-3">
                  <i className="bi bi-people-fill me-2"></i>
                  Class Results
                </h4>
                {exerciseResults.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead className="table-dark">
                      <tr>
                        <th>Rank</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exerciseResults
                        .sort((a, b) => (b.score || 0) - (a.score || 0))
                        .map((result, index) => (
                          <tr key={result.student.id || index}>
                            <td>
                              <Badge
                                bg={
                                  index < 3 ? ['warning', 'secondary', 'success'][index] : 'light'
                                }
                                text={index < 3 ? 'dark' : 'dark'}
                              >
                                #{index + 1}
                              </Badge>
                            </td>
                            <td>{result.student.firstName}</td>
                            <td>{result.student.lastName}</td>
                            <td>
                              <Badge bg={getScoreBadgeVariant(result.score || 0)}>
                                {result.score || 0}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    <i className="bi bi-info-circle me-2"></i>
                    No class results available yet.
                  </Alert>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ExerciseResults;
