import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class ExercisesToDo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            exerciseList: []
        };
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        var endpoint = 'http://testapp-env.eba-tqifczt7.us-west-2.elasticbeanstalk.com/exercise/';
        //var endpoint = 'http://localhost:5000/exercise/';
        fetch(endpoint)
            .then((res => res.json()))
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        exerciseList: [result]
                    });
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    render() {
        console.log(this.state.exerciseList)
        return (
            <div className="ExercisesToDo">
                <h1>Exercises to Do</h1>
                { this.state.exerciseList.map(item => (
                    <button key="{item.name}" onClick={this.handleClick}>{item.name}</button>
                ))}
            </div>
        );
    }

    handleClick() {
        this.props.updatePageToHandler('DoExercise');
    }
}

export default ExercisesToDo;
