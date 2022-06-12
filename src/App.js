import logo from './logo.svg';
import './App.css';
import ExercisesToDo from './ExercisesToDo.js';
import DoExercise from './DoExercise.js';
import ExerciseResults from './ExerciseResults.js';
import React, { Component } from 'react';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        currentPage: 'ExercisesToDo'
    };
  }

  updatePageToHandler(page, grade) {
    this.setState({
      currentPage: page,
      grade: grade
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>ARCHIMEDES</p>
        </header>
        <div id="content">
          {this.state.currentPage == "ExercisesToDo" ? <ExercisesToDo updatePageToHandler={this.updatePageToHandler.bind(this)} /> : null }
          {this.state.currentPage == "DoExercise" ? <DoExercise updatePageToHandler={this.updatePageToHandler.bind(this)} /> : null }
          {this.state.currentPage == "ExerciseResults" ? <ExerciseResults updatePageToHandler={this.updatePageToHandler.bind(this)} grade={this.state.grade} /> : null }
        </div>
      </div>
    );
  }
}

export default App;
