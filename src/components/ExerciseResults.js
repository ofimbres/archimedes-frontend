import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";

import {
    Table,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
  } from '@aws-amplify/ui-react';

const ExerciseResults = () =>  {
    const endpoint = 'http://localhost:8080';
    const { state } = useLocation();
    //const { grade } = state;
    const [exerciseResults, setExerciseResults] = useState([]);
    const [exerciseResult, setExerciseResult] = useState({});
    const hasFetchedData = useRef(false);

    useEffect(() => {
        const token = localStorage.getItem('CognitoIdentityServiceProvider.2ba4j54rtfsvpgtq7rfr2a3a0m.ofimbres.accessToken');
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        //headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:3001');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
        headers.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('Authorization', 'Bearer ' + token);

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

    const heading = ['Student', 'Score'];
    
    return (
        <div className="ExerciseResults">
            <h1>Exercise Results</h1>
            <p>Score: <span id="grade">{exerciseResult.score}</span></p>
            <p>View my latest <a href={`http://archimedes-exercise-results.s3-website-us-west-2.amazonaws.com/${exerciseResult.s3Key}`} target="_blank">worksheet results</a></p>

            <Table className='center' style={{ width: 500 }} highlightOnHover={true} >
                <TableHead>
                    <TableRow>
                        { heading.map(head =>  <TableCell as="th">{head}</TableCell>) }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {exerciseResults.map(row => <TableRow><TableCell>{row.student.firstName}</TableCell><TableCell>{row.score}</TableCell></TableRow>) }
                </TableBody>
            </Table>
        </div>
    );
}

export default ExerciseResults;