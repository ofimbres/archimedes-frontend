import React, {  useCallback, useEffect, useState } from 'react';
import {  Navigate, useLocation } from "react-router-dom";
import { useAuthenticator } from '@aws-amplify/ui-react';

const StartExercise = () => {

    const miniquizEndpoint = process.env.REACT_APP_MINIQUIZ_ENDPOINT;
    const { state } = useLocation();
    const exerciseId = state; // WN16

    const [isCompleted, setCompleted] = useState(false);

    const { user } = useAuthenticator((context) => [context.user]);

    const handleOnMessage = useCallback((event) => {
        //if (event.origin !== miniquizEndpoint)
        //    return;
        
        const data = {
            worksheetContentCopy: '<!DOCTYPE html>' + event.data.worksheetCopy,
            exerciseId: exerciseId,
            classroomId: 'e46e7191-e31d-434a-aba3-b9a9c187a632',
            studentId: user.username,
            score: event.data.grade
        }

        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        //headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
        headers.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('Authorization', 'Bearer ' + user.signInUserSession.accessToken.jwtToken);

        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers
        };

        const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
        fetch(`${endpoint}/api/v1/exerciseresult/`, requestOptions)
            .then(response => response.text())
            .then(data => {
                setCompleted(true);
            });
    });

    const handleOnLoad = useCallback(event => {
        const message = { studentId: user.username, studentName: user.attributes.given_name + ' ' + user.attributes.family_name }; 
        event.target.contentWindow.postMessage(message, '*');
    });

    useEffect(() => {
        window.addEventListener("message", handleOnMessage);
        const frameEl = document.getElementById('webworksheet-box');

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
        let state = { studentId: user.username, classroomId: 'e46e7191-e31d-434a-aba3-b9a9c187a632', exerciseId : exerciseId };
        return <Navigate to="/exercise/completed" state={ state } />
    }

    return (
        <div className="do-exercise-page">
            <iframe title="Start exercise" id="webworksheet-box"  src={`${miniquizEndpoint}/${exerciseId}.html`} />
        </div>
    );
}

export default StartExercise;