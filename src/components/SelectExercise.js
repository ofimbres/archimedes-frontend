import React, {  useCallback, useEffect, useState, useRef } from 'react';
import {  Navigate, Link } from "react-router-dom";
import { Amplify, Auth } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

const SelectExercise = () => {

    const [isCompleted, setCompleted] = useState(false);

    const { user, signOut, authStatus } = useAuthenticator((context) => [context.user]);

    const [exerciseList, setExerciseList] = useState([]);
    const hasFetchedData = useRef(false);

    useEffect(() => {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
        headers.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, X-Requested-With');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('Authorization', 'Bearer ' + user.signInUserSession.accessToken.jwtToken);

        const requestOptions = {
            headers: headers
        };
        
        var topic = 'ALGEBRAIC_EXPRESSIONS';
        var subtopic = 'AX';
        const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
        fetch(`${endpoint}/api/v1/topic/${topic}/subtopic/${subtopic}/exercises/`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setExerciseList(data);
                console.log(data[0].id);
            });

        hasFetchedData.current = true;

        return () => {
        };
    }, []);

    return (
        <div className="exercise-select-page">
            <h1>Select exercise</h1>
            <div>
                {exerciseList.map(e => 
                <p key={e.id}><Link to="/exercise/start" state={ e.id }>{e.classification} - [{e.id}] {e.name}</Link></p>
                )}
            </div>
        </div>
    );
}

export default SelectExercise;