import './DoExercise.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class DoExercise extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        };
    }

    componentDidMount() {
        window.addEventListener("message", (event) => {
            //if (event.origin !== "http://example.org:8080")
            //  return;
            console.log(event.data.worksheetCopy);

            const formData = new FormData();
            formData.append('worksheetContentCopy', '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">' + event.data.worksheetCopy);
            formData.append('studentId', 1004);
            formData.append('exerciseCode', 'WN16');
            formData.append('score', event.data.grade);

            // Simple POST request with a JSON body using fetch
            const requestOptions = {
                method: 'POST',
                body: formData
            };
            // headers: { 'Content-Type': 'application/json' },
            //                //body: JSON.stringify({ file: event.data.worksheetCopy })
            //var endpoint = 'http://localhost:5000';
            var endpoint2 = 'http://testapp-env.eba-tqifczt7.us-west-2.elasticbeanstalk.com';
            fetch(endpoint2 + '/exercise/upload-exercise-results', requestOptions)
                //.then(response => response.json())
                .then(data => {
                    this.props.updatePageToHandler('ExerciseResults', event.data.grade);
                });


        }, false);

        var frameEl = document.getElementById('do-exercise-container');
        frameEl.onload = function() {
          var message = { studentId: '1004', studentName: 'Oscar' }; 
          frameEl.contentWindow.postMessage(message, '*');
        };
    }

    render() {
        return (
            <div className="DoExercise">
                <h1>Do Exercise</h1>
                <iframe id="do-exercise-container" scrolling="no" src="http://archimedes-mini-quizzes.s3-website-us-west-2.amazonaws.com/WN16.htm" />
            </div>
        );
    }
}

export default DoExercise;
