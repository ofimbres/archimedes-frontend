import React, {  useCallback, useEffect, useState, useContext } from 'react';
import {  Navigate, useLocation } from "react-router-dom";
import { AuthContext } from '../../contexts/AuthContext'

const StartExercise = () => {

    const authContext = useContext(AuthContext)

    const username = 'ofimbres'
    const fullname = 'Oscar Fimbres' // user.attributes.given_name + ' ' + user.attributes.family_name

    const miniquizEndpoint = process.env.REACT_APP_MINIQUIZ_ENDPOINT;
    const { state } = useLocation();
    const exerciseId = state; // WN16

    const [isCompleted, setCompleted] = useState(false);

    const handleOnMessage = useCallback((event) => {
        //if (event.origin !== miniquizEndpoint)
        //    return;
        
        const data = {
            worksheetContentCopy: '<!DOCTYPE html>' + event.data.worksheetCopy,
            exerciseId: exerciseId,
            classroomId: 'e46e7191-e31d-434a-aba3-b9a9c187a632',
            studentId: username,
            score: event.data.grade
        }

        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        //headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
        headers.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('Authorization', 'Bearer ' + authContext.sessionInfo.accessToken);

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
        const message = { studentId: username, studentName: fullname }; 
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
        let state = { studentId: username, classroomId: 'e46e7191-e31d-434a-aba3-b9a9c187a632', exerciseId : exerciseId };
        return <Navigate to="/exercise/completed" state={ state } />
    }

    return (
        <div className="do-exercise-page">
            <iframe title="Start exercise" id="webworksheet-box"  src={`${miniquizEndpoint}/${exerciseId}.html`} />
        </div>
    );
}

export default StartExercise;