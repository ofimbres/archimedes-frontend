import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class ExerciseResults extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filename: ''
        };
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        //var endpoint = 'http://localhost:5000';
        var endpoint2 = 'http://testapp-env.eba-tqifczt7.us-west-2.elasticbeanstalk.com';
        fetch(endpoint2 + '/exercise/get-latest-exercise-results?studentId=1004&exerciseCode=WN16')
        .then(response => response.text())
        .then(data => {
            this.setState({ filename: data })
        });
    }

    render() {
        return (
            <div className="ExerciseResults">
                <h1>Exercise Results</h1>
                <p>Grade: <span id="grade">{this.props.grade}</span></p>
                <p>See latest <a href={`http://archimedes-exercise-results.s3-website-us-west-2.amazonaws.com/${this.state.filename}`} target="_blank">student worksheet copy</a></p>
            </div>
        );
    }

    handleClick() {
        this.props.updatePageToHandler('ExercisesToDo');
    }
}

export default ExerciseResults;
