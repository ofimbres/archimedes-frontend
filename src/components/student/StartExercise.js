import React, {  useCallback, useEffect, useState, useContext } from 'react';
import {  Navigate, useLocation } from "react-router-dom";
import { AuthContext } from '../../contexts/AuthContext'
import { getActivityResults } from '../../libs/apiEndpoints';

const StartExercise = () => {

    const authContext = useContext(AuthContext);
    const username = authContext.sessionInfo.username;
    const studentId = authContext.attrInfo['custom:userId'];

    const fullname = authContext.attrInfo['given_name'] + ' ' + authContext.attrInfo['family_name']

    const miniquizEndpoint = process.env.REACT_APP_MINIQUIZ_ENDPOINT;
    const { state } = useLocation();
    const exerciseId = state; // WN16

    const [isCompleted, setCompleted] = useState(false);

    const handleOnMessage = useCallback(async (event) => {
        //if (event.origin !== miniquizEndpoint)
        //    return;
        
        await getActivityResults('<!DOCTYPE html>' + event.data.worksheetCopy, exerciseId, 'e46e7191-e31d-434a-aba3-b9a9c187a632', studentId, event.data.grade, authContext.sessionInfo.accessToken)
            .then(data => {
                setCompleted(true);
            });

    }, [authContext.sessionInfo.accessToken, exerciseId]);

    const handleOnLoad = useCallback(event => {
        const message = { studentId: studentId, studentName: fullname }; 
        event.target.contentWindow.postMessage(message, '*');
    }, []);

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

    }, [isCompleted, handleOnMessage, handleOnLoad]);

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