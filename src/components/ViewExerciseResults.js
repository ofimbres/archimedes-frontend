import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useAuthenticator } from '@aws-amplify/ui-react';

const ViewExerciseResults = () =>  {
    const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
    const { state } = useLocation();

    const { user } = useAuthenticator((context) => [context.user]);

    const [exerciseResults, setExerciseResults] = useState([]);
    const [exerciseResult, setExerciseResult] = useState({});
    const hasFetchedData = useRef(false);

    useEffect(() => {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        //headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:3001');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
        headers.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('Authorization', 'Bearer ' + user.signInUserSession.accessToken.jwtToken);

        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'GET',
            headers: headers
        };

        if (!hasFetchedData.current) {
            const classroomId = state.classroomId;
            const studentId = state.studentId;
            const exerciseId = state.exerciseId;

            fetch(`${endpoint}/exerciseresult/class/${classroomId}/student/${studentId}/exercise/${exerciseId}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setExerciseResult(data)
            });

            fetch(`${endpoint}/exerciseresult/class/${classroomId}/exercise/${exerciseId}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setExerciseResults(data)
            });

            hasFetchedData.current = true;
        }
    }, []);
    
    return (
        <div className="ExerciseResults">
            <h1>Exercise Results</h1>
            <p>My score: <span id="grade">{exerciseResult.score}</span></p>
            <p>View my latest <a href={`http://archimedes-exercise-results.s3-website-us-west-2.amazonaws.com/${exerciseResult.s3Key}`} target="_blank">worksheet results</a></p>

            <table className="table w-50 mx-auto">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">First name</th>
                  <th scope="col">Last name</th>
                  <th scope="col">Score</th>
                </tr>
              </thead>
              <tbody>
                {exerciseResults.map((row, i) => 
                <tr key={i}>
                  <th scope="row">{i+1}</th>
                  <td>{row.student.firstName}</td>
                  <td>{row.student.lastName}</td>
                  <td>{row.score}</td>
                </tr>
                )}
              </tbody>
            </table>
        </div>
    );
}

export default ViewExerciseResults;