import './DoExercise.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { useParams, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

class DoExercise extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            isCompleted: false
        };
    }

    componentDidMount() {
        window.addEventListener("message", (event) => {
            if (event.origin !== "http://archimedes-mini-quizzes.s3-website-us-west-2.amazonaws.com")
              return;

            const data = {
                worksheetContentCopy: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">' + event.data.worksheetCopy,
                exerciseCode: 'WN16',
                score: event.data.grade
            }

            const token = localStorage.getItem('CognitoIdentityServiceProvider.3n6mitm1fj8q4kjco00fnp45kf.ofimbres.accessToken');
            let headers = new Headers();

            headers.append('Content-Type', 'application/json');
            //headers.append('Accept', 'application/json');
            headers.append('Access-Control-Allow-Origin', 'http://localhost:3006');
            headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
            headers.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
            headers.append('Authorization', 'Bearer ' + token);

            // Simple POST request with a JSON body using fetch
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: headers
            };

            let endpoint = 'http://localhost:8080';
            fetch(endpoint + '/exercise/get-latest-exercise-results', {
                method: 'GET',
                headers: headers
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });

            /*fetch(endpoint + '/exercise/submit-exercise-results', requestOptions)
                .then(response => response.text())
                .then(data => {
                    console.log(data);

                    this.setState({ isCompleted: true })
                });*/

        }, false);

        var frameEl = document.getElementById('do-exercise-container');
        frameEl.onload = function() {
          var message = { studentId: '1008', studentName: 'Guadalupe' }; 
          console.log('onload');
          frameEl.contentWindow.postMessage(message, '*');
        };
    }

    render() {
        const { isCompleted } = this.state
        
        if (isCompleted) {
            return <Navigate to="/exercise/W16-completed" />
        }

        return (
            <div className="DoExercise">
                <h1>Do Exercise</h1>
                <iframe id="do-exercise-container" scrolling="no" src="http://archimedes-mini-quizzes.s3-website-us-west-2.amazonaws.com/WN16.htm" />
            </div>
        );
    }
}

export default DoExercise;