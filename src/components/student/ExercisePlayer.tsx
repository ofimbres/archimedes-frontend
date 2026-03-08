import React, { useCallback, useEffect, useState, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getActivityResults } from '../../libs/apiEndpoints';

interface MessageData {
  worksheetCopy: string;
  grade: number;
}

interface PostMessageData {
  studentId: string;
  studentName: string;
}

interface NavigationState {
  studentId: string;
  classroomId: string;
  exerciseId: string;
}

/**
 * ExercisePlayer Component - Handles exercise execution and completion
 * Integrates with mini-quiz iframe and manages exercise results
 */
const ExercisePlayer: React.FC = () => {
  const authContext = useContext(AuthContext);
  const profile = authContext?.sessionInfo?.profile as
    | { id: string; full_name?: string; first_name?: string; last_name?: string }
    | undefined;
  const username = authContext?.sessionInfo?.username || '';
  const studentId = profile?.id || '';
  const fullname =
    profile?.full_name ||
    (profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '') ||
    '';

  const miniquizEndpoint = process.env.REACT_APP_MINIQUIZ_ENDPOINT;
  const { state } = useLocation();
  const exerciseId = state as string; // WN16

  const [isCompleted, setCompleted] = useState<boolean>(false);

  const handleOnMessage = useCallback(
    async (event: MessageEvent<MessageData>) => {
      // Security check - uncomment when miniquizEndpoint is properly configured
      // if (event.origin !== miniquizEndpoint) return;

      try {
        await getActivityResults(
          '<!DOCTYPE html>' + event.data.worksheetCopy,
          exerciseId,
          'e46e7191-e31d-434a-aba3-b9a9c187a632',
          studentId,
          event.data.grade,
          authContext?.sessionInfo?.accessToken || ''
        );
        setCompleted(true);
      } catch (error) {
        console.error('Error saving activity results:', error);
      }
    },
    [authContext?.sessionInfo?.accessToken, exerciseId, studentId]
  );

  const handleOnLoad = useCallback(
    (event: Event) => {
      const target = event.target as HTMLIFrameElement;
      const message: PostMessageData = {
        studentId: studentId,
        studentName: fullname,
      };
      target.contentWindow?.postMessage(message, '*');
    },
    [studentId, fullname]
  );

  useEffect(() => {
    window.addEventListener('message', handleOnMessage);
    const frameEl = document.getElementById('webworksheet-box') as HTMLIFrameElement;

    if (!isCompleted && frameEl) {
      frameEl.addEventListener('load', handleOnLoad);
    }

    return () => {
      window.removeEventListener('message', handleOnMessage);

      if (!isCompleted && frameEl) {
        frameEl.removeEventListener('load', handleOnLoad);
      }
    };
  }, [isCompleted, handleOnMessage, handleOnLoad]);

  if (isCompleted) {
    const navigationState: NavigationState = {
      studentId: username,
      classroomId: 'e46e7191-e31d-434a-aba3-b9a9c187a632',
      exerciseId: exerciseId,
    };
    return <Navigate to="/exercise/completed" state={navigationState} />;
  }

  return (
    <div className="do-exercise-page container max-w-5xl mx-auto py-6 px-4">
      <div className="alert alert-warning rounded-bubble md:hidden mb-4" role="alert">
        <span>This exercise may be best on a larger screen. If content is cut off, try rotating your device or using a desktop browser.</span>
      </div>
      <div className="aspect-video w-full rounded-blob overflow-hidden border-2 border-water-foam/50 shadow-bubble bg-base-100">
        <iframe
          title="Start exercise"
          id="webworksheet-box"
          src={`${miniquizEndpoint}/${exerciseId}.html`}
          className="w-full h-full min-h-[400px] border-0"
          style={{ background: '#fff' }}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default ExercisePlayer;
