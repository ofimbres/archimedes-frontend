import React, {  useCallback, useEffect, useState } from 'react';
import {  Navigate} from "react-router-dom";
import { Amplify, Auth } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

const DoExercise = () => {

    const [accessToken, setAccessToken] = useState({});
    const [isCompleted, setCompleted] = useState(false);

    const { user, signOut, authStatus } = useAuthenticator((context) => [context.user]);

    const handleOnMessage = useCallback((event) => {
        if (event.origin !== "http://archimedes-mini-quizzes.s3-website-us-west-2.amazonaws.com")
            return;

        const data = {
            worksheetContentCopy: '<!DOCTYPE html>' + event.data.worksheetCopy,
            exerciseId: 'WN16',
            classroomId: 'e46e7191-e31d-434a-aba3-b9a9c187a632',
            studentId: user.username,
            score: event.data.grade
        }
        // '3c44e80d-d9ac-4c1c-a3fa-e38317f50011',

        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        //headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:3001');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
        headers.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('Authorization', 'Bearer ' + accessToken);

        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers
        };

        let endpoint = 'http://localhost:8080';

        fetch(endpoint + '/exerciseresult/', requestOptions)
            .then(response => response.text())
            .then(data => {
                setCompleted(true);
            });
    });

    const handleOnLoad = useCallback(event => {
        //event.target.style.height = event.target.contentWindow.documentElement.scrollHeight + 'px';

        const message = { studentId: user.username, studentName: user.attributes.given_name + ' ' + user.attributes.family_name }; 
        event.target.contentWindow.postMessage(message, '*');
    });

    useEffect(() => {

        Auth.currentSession().then(data => setAccessToken(data.accessToken.jwtToken));
        Auth.currentUserInfo().then(data => console.log(data))

        window.addEventListener("message", handleOnMessage);
        const frameEl = document.getElementById('do-exercise-container');

        if (!isCompleted) {
            frameEl.addEventListener('load', handleOnLoad);
        }

        return () => {
            window.removeEventListener("message", handleOnMessage);

            if (!isCompleted)
                frameEl.removeEventListener("load", handleOnLoad);
        };

    }, [handleOnMessage, handleOnLoad]);

    if (isCompleted) {
        let state = { studentId: user.username, classroomId: 'e46e7191-e31d-434a-aba3-b9a9c187a632', exerciseId :'WN16' };
        return <Navigate to="/exercise/completed" state={ state } />
    }

    return (
        <div className="DoExercise">
            <h1>Do Exercise</h1>
            <iframe id="do-exercise-container" scrolling="no" src="http://archimedes-mini-quizzes.s3-website-us-west-2.amazonaws.com/WN16.htm" />
        </div>
    );
}

export default DoExercise;