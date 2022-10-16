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
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
        headers.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('Authorization', 'Bearer ' + user.signInUserSession.accessToken.jwtToken);

        const requestOptions = {
            headers: headers
        };

        const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
        fetch(`${endpoint}/exercise/`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setExerciseList(data);
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
                <Link key={e.id} to="/exercise/start" state={ e.id }>{e.classification} - [{e.id}] {e.name}</Link>
                )}
            </div>
        </div>
    );
}

export default SelectExercise;