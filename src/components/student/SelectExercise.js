import React, { useEffect, useState, useRef, useContext } from 'react';
import {  Link } from "react-router-dom";
import { AuthContext } from '../../contexts/AuthContext'

import './SelectExercise.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const SelectExercise = () => {

    const authContext = useContext(AuthContext)
    const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;

    const [topicList, setTopicList] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    const hasFetchedData = useRef(false);

    useEffect(() => {

        if (!hasFetchedData.current) {
            getTopicsAndSubtopics();
            hasFetchedData.current = true;
        }

        return () => {
        };
    });

    function getTopicsAndSubtopics() {
        let headers = createHeaders(authContext.sessionInfo.accessToken);

        const requestOptions = {
            headers: headers
        };

        fetch(`${endpoint}/api/v1/topics/`, requestOptions)
        .then(response => response.json())
        .then(data => {
            setTopicList(data);

            if (data.length > 0 && data[0].descendants.length > 0) {
                getExerciseList(data[0].id, data[0].descendants[0].id);
            }
        });
    }

    function getExerciseList(topicId, subtopicId) {
        let headers = createHeaders(authContext.sessionInfo.accessToken);

        const requestOptions = {
            headers: headers
        };

        fetch(`${endpoint}/api/v1/topics/${topicId}/subtopics/${subtopicId}/activities`, requestOptions)
        .then(response => response.json())
        .then(data => {
            setExerciseList(data);
        });
    }

    function createHeaders(accessToken) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
        headers.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, X-Requested-With');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('Authorization', 'Bearer ' + accessToken);
        return headers;
    }

    return (
<div className="exercise-select-page">
  <h1 className="text-center mb-4">Select Exercise</h1>

  <div className="container">
    <div className="row">
      
      {/* Index Section */}
      <div className="col-md-4 col-12">
        <div className="card p-3 shadow-sm">
          <h3>Index</h3>
          <ul className="list-unstyled">
            {topicList.map(e => (
              <li key={e.id} className="mb-3">
                <button
                  className="btn btn-toggle d-flex align-items-center w-100 rounded collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target={"#" + e.id + "-collapse"}
                  aria-expanded="false"
                >
                  {e.name}
                </button>
                <div className="collapse" id={e.id + "-collapse"}>
                  <ul className="list-unstyled ms-3 fw-normal pb-1 small">
                    {e.descendants.map(e2 => (
                      <li key={e2.id}>
                        <Link
                          to="#"
                          className="link-dark rounded"
                          onClick={() => getExerciseList(e.id, e2.id)}
                        >
                          {e2.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Exercise List Section */}
      <div className="col-md-8 col-12">
        <div className="card p-3 shadow-sm">
          <h3>Exercise List</h3>
          <div className="list-group">
            {exerciseList.map(e => (
              <Link
                key={e.activityId}
                to="/exercise/start"
                state={e.exerciseId}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              >
                <div className="d-flex">
                  <div className="icon-square bg-warning text-dark flex-shrink-0 me-3">
                    {e.classification === "miniquiz" && (
                      <i className="bi bi-bookmark-check-fill"></i>
                    )}
                  </div>
                  <div>{e.activityId} - {e.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>
    );
}

export default SelectExercise;