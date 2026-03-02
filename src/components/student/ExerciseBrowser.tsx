import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

import './ExerciseBrowser.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Type definitions
interface Subtopic {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  name: string;
  descendants: Subtopic[];
}

interface Exercise {
  activityId: string;
  exerciseId: string;
  name: string;
  classification: string;
}

/**
 * ExerciseBrowser component for displaying and selecting available exercises
 * Organized by topics and subtopics with Bootstrap styling
 */
const ExerciseBrowser: React.FC = () => {
  const authContext = useContext(AuthContext);
  const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;

  const [topicList, setTopicList] = useState<Topic[]>([]);
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const hasFetchedData = useRef<boolean>(false);

  const createHeaders = (accessToken: string): Headers => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
    headers.append(
      'Access-Control-Allow-Headers',
      'Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, X-Requested-With'
    );
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Authorization', `Bearer ${accessToken}`);
    return headers;
  };

  const getTopicsAndSubtopics = useCallback(async (): Promise<void> => {
    try {
      if (!authContext.sessionInfo?.accessToken || !endpoint) {
        console.error('Missing access token or endpoint');
        return;
      }

      const headers = createHeaders(authContext.sessionInfo.accessToken);
      const requestOptions = { headers };

      const response = await fetch(`${endpoint}/api/v1/topics/`, requestOptions);
      const data: Topic[] = await response.json();

      setTopicList(data);

      // Auto-select first topic and subtopic if available
      if (data.length > 0 && data[0].descendants.length > 0) {
        await getExerciseList(data[0].id, data[0].descendants[0].id);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.sessionInfo?.accessToken, endpoint]); // getExerciseList causes circular dependency

  useEffect(() => {
    if (!hasFetchedData.current) {
      getTopicsAndSubtopics();
      hasFetchedData.current = true;
    }
  }, [getTopicsAndSubtopics]);

  const getExerciseList = async (topicId: string, subtopicId: string): Promise<void> => {
    try {
      if (!authContext.sessionInfo?.accessToken || !endpoint) {
        console.error('Missing access token or endpoint');
        return;
      }

      const headers = createHeaders(authContext.sessionInfo.accessToken);
      const requestOptions = { headers };

      const response = await fetch(
        `${endpoint}/api/v1/topics/${topicId}/subtopics/${subtopicId}/activities`,
        requestOptions
      );
      const data: Exercise[] = await response.json();

      setExerciseList(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  return (
    <div className="exercise-select-page">
      <div className="container">
        <h1 className="text-center mb-4">
          <i className="bi bi-bookmarks me-3"></i>
          Select Exercise
        </h1>

        <div className="row g-4">
          {/* Topics Navigation Sidebar */}
          <div className="col-lg-4 col-md-5 col-12">
            <div className="topics-sidebar p-4">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-list-ul me-2 text-primary"></i>
                <h4 className="mb-0 text-dark">Topics</h4>
              </div>
              
              {topicList.length > 0 ? (
                <ul className="list-unstyled">
                  {topicList.map(topic => (
                    <li key={topic.id} className="mb-2">
                      <button
                        className="btn btn-toggle d-flex align-items-center w-100 text-start collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${topic.id}-collapse`}
                        aria-expanded="false"
                        type="button"
                      >
                        {topic.name}
                      </button>
                      <div className="collapse" id={`${topic.id}-collapse`}>
                        <ul className="list-unstyled btn-toggle-nav">
                          {topic.descendants.map(subtopic => (
                            <li key={subtopic.id}>
                              <button
                                type="button"
                                className="btn btn-link subtopic-link text-start"
                                onClick={() => getExerciseList(topic.id, subtopic.id)}
                              >
                                <i className="bi bi-arrow-return-right me-2"></i>
                                {subtopic.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading topics...</p>
                </div>
              )}
            </div>
          </div>

          {/* Exercise Selection Main Area */}
          <div className="col-lg-8 col-md-7 col-12">
            <div className="exercises-main p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                  <i className="bi bi-collection me-2 text-success"></i>
                  <h4 className="mb-0 text-dark">Available Exercises</h4>
                </div>
                <span className="badge bg-secondary">
                  {exerciseList.length} exercise{exerciseList.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {exerciseList.length > 0 ? (
                <div className="row g-3">
                  {exerciseList.map(exercise => (
                    <div key={exercise.activityId} className="col-12">
                      <Link
                        to="/exercise/start"
                        state={exercise.exerciseId}
                        className="exercise-card list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3"
                      >
                        <div className="d-flex align-items-center">
                          <div className="icon-square flex-shrink-0 me-3">
                            {exercise.classification === 'miniquiz' && (
                              <i className="bi bi-bookmark-check-fill"></i>
                            )}
                            {exercise.classification !== 'miniquiz' && (
                              <i className="bi bi-play-circle-fill"></i>
                            )}
                          </div>
                          <div>
                            <div className="d-flex align-items-center mb-1">
                              <strong className="text-primary me-2">{exercise.activityId}</strong>
                              <span className="badge bg-light text-dark">{exercise.classification}</span>
                            </div>
                            <div className="text-muted">{exercise.name}</div>
                          </div>
                        </div>
                        <i className="bi bi-chevron-right text-muted fs-5"></i>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i className="bi bi-inbox display-1 text-muted"></i>
                  </div>
                  <h5 className="text-muted">No exercises selected</h5>
                  <p className="text-muted mb-0">
                    Choose a topic and subtopic from the sidebar to view available exercises.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="row mt-4">
          <div className="col">
            <Link to="/" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseBrowser;
