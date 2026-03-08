import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

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

const ExerciseBrowser: React.FC = () => {
  const authContext = useContext(AuthContext);
  const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
  const [topicList, setTopicList] = useState<Topic[]>([]);
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const [openTopicId, setOpenTopicId] = useState<string | null>(null);
  const hasFetchedData = useRef<boolean>(false);

  const createHeaders = (accessToken: string): Headers => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Bearer ${accessToken}`);
    return headers;
  };

  const getExerciseList = useCallback(async (topicId: string, subtopicId: string): Promise<void> => {
    try {
      if (!authContext.sessionInfo?.accessToken || !endpoint) return;
      const headers = createHeaders(authContext.sessionInfo.accessToken);
      const response = await fetch(
        `${endpoint}/api/v1/topics/${topicId}/subtopics/${subtopicId}/activities`,
        { headers }
      );
      const data: Exercise[] = await response.json();
      setExerciseList(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  }, [authContext.sessionInfo?.accessToken, endpoint]);

  const getTopicsAndSubtopics = useCallback(async (): Promise<void> => {
    try {
      if (!authContext.sessionInfo?.accessToken || !endpoint) return;
      const headers = createHeaders(authContext.sessionInfo.accessToken);
      const response = await fetch(`${endpoint}/api/v1/topics/`, { headers });
      const data: Topic[] = await response.json();
      setTopicList(data);
      if (data.length > 0 && data[0].descendants.length > 0) {
        setOpenTopicId(data[0].id);
        await getExerciseList(data[0].id, data[0].descendants[0].id);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  }, [authContext.sessionInfo?.accessToken, endpoint, getExerciseList]);

  useEffect(() => {
    if (!hasFetchedData.current) {
      getTopicsAndSubtopics();
      hasFetchedData.current = true;
    }
  }, [getTopicsAndSubtopics]);

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-water-deep text-center mb-8">
          Select exercise
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Topics sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-base-100 rounded-blob border-2 border-water-foam/50 shadow-bubble p-4 max-h-[70vh] overflow-y-auto">
              <h2 className="font-display font-semibold text-water-deep mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                Topics
              </h2>
              {topicList.length > 0 ? (
                <ul className="space-y-1">
                  {topicList.map((topic) => (
                    <li key={topic.id}>
                      <button
                        type="button"
                        className={`btn btn-ghost w-full justify-start rounded-bubble ${openTopicId === topic.id ? 'btn-active' : ''}`}
                        onClick={() => {
                          setOpenTopicId((prev) => (prev === topic.id ? null : topic.id));
                          if (topic.descendants[0]) {
                            getExerciseList(topic.id, topic.descendants[0].id);
                          }
                        }}
                      >
                        {topic.name}
                      </button>
                      {openTopicId === topic.id && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {topic.descendants.map((subtopic) => (
                            <li key={subtopic.id}>
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm w-full justify-start text-base-content/80 rounded-bubble"
                                onClick={() => getExerciseList(topic.id, subtopic.id)}
                              >
                                <span className="mr-2">→</span>
                                {subtopic.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <span className="loading loading-spinner loading-md text-primary" />
                  <p className="mt-2 text-base-content/70">Loading topics…</p>
                </div>
              )}
            </div>
          </div>

          {/* Exercises list */}
          <div className="lg:col-span-8">
            <div className="bg-base-100 rounded-blob border-2 border-water-foam/50 shadow-bubble p-4 min-h-[60vh]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-water-deep flex items-center gap-2">
                  <span className="text-success">●</span>
                  Available exercises
                </h2>
                <span className="badge badge-ghost">{exerciseList.length} exercise{exerciseList.length !== 1 ? 's' : ''}</span>
              </div>
              {exerciseList.length > 0 ? (
                <div className="space-y-2">
                  {exerciseList.map((exercise) => (
                    <Link
                      key={exercise.activityId}
                      to="/exercise/start"
                      state={exercise.exerciseId}
                      className="flex justify-between items-center p-4 rounded-bubble border-2 border-water-foam/50 hover:border-water-mid hover:shadow-bubble-hover transition-all btn-bouncy bg-base-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-lg">
                          {exercise.classification === 'miniquiz' ? '✓' : '▶'}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-primary">{exercise.activityId}</span>
                            <span className="badge badge-ghost badge-sm">{exercise.classification}</span>
                          </div>
                          <div className="text-base-content/80 text-sm">{exercise.name}</div>
                        </div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="text-4xl text-base-content/30 mb-2">📭</span>
                  <h3 className="font-display font-semibold text-base-content/70">No exercises selected</h3>
                  <p className="text-sm text-base-content/60 mt-1">Choose a topic and subtopic from the sidebar.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/" className="btn btn-ghost rounded-bubble gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExerciseBrowser;
