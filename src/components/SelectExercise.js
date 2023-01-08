import React, {  useCallback, useEffect, useState, useRef } from 'react';
import {  Navigate, Link } from "react-router-dom";
import { Amplify, Auth } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';
import "../styles/sidebars.css";
import "./sidebars";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import * as bootstrap from 'bootstrap';
import 'bootstrap';

<link href="../assets/dist/css/bootstrap.min.css" rel="stylesheet"></link>

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
        <div class="container ">
        <div class="row">
        <div className='col-4'> 
        
    <ul class="list-unstyled ps-0"></ul>
        <ul class="mb-1">
            <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
            Geometry
            </button>
    <div class="collapse show" id="home-collapse">
        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Circles</a></li>
            <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Squares</a></li>
            <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Prisms</a></li>
        </ul>
    </div>
        </ul>
  <ul class="mb-2">
    <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
        PEMDAS
    </button>
    <div class="collapse" id="dashboard-collapse">
      <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
        <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Addition</a></li>
        <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Substraction</a></li>
        <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Multiplication</a></li>
        <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">AX+B</a></li>
      </ul>
    </div>
  </ul>
  <ul class="mb-3">
    <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="false">
      Perimeters
    </button>
    <div class="collapse" id="orders-collapse">
      <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
        <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">New</a></li>
        <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Processed</a></li>
        <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Shipped</a></li>
        <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Returned</a></li>
      </ul>
    </div>
  </ul>
  <ul class="border-top my-3"></ul>
  <ul class="mb-4">
    <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" data-bs-toggle="collapse" data-bs-target="#account-collapse" aria-expanded="false">
      Account
    </button>
    <div class="collapse" id="account-collapse">
      <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
        <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">New...</a></li>
        <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Profile</a></li>
        <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Settings</a></li>
        <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Sign out</a></li>
      </ul>
    </div>
    
  </ul>
  </div>
  </div>
  </div>

            <div>
                {exerciseList.map(e => 
                <p key={e.id}><Link to="/exercise/start" state={ e.id }>{e.classification} - [{e.id}] {e.name}</Link></p>
                )}
            </div>
        </div>
    );
    
}


export default SelectExercise;