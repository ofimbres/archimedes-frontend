import React, { useEffect, useState, useRef, useContext } from 'react';
import {  Link } from "react-router-dom";
import { AuthContext } from '../../contexts/AuthContext'

import "bootstrap-icons/font/bootstrap-icons.css";

import { StudentContext } from '../../contexts/StudentContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { postStudentEnrollment, deleteStudentEnrollment } from '../../libs/apiEndpoints'

const EnrollPeriod = () => {

    const authContext = useContext(AuthContext);
    const studentContext = useContext(StudentContext);

    const [enrolledPeriods, setEnrolledPeriods] = useState([]);
    const [periodCode, setPeriodCode] = useState('');
    const handleRemove = async (code) => {
        const studentId = authContext.attrInfo["custom:userId"]
        await deleteStudentEnrollment(studentId, code, authContext.sessionInfo.accessToken)
            .then(data => {
                debugger;
                studentContext.refreshPeriods()
            })

        //setEnrolledPeriods(enrolledPeriods.filter(period => period.code !== code));
    }
    const handleAdd = async () => {
        const studentId = authContext.attrInfo["custom:userId"]
        await postStudentEnrollment(studentId, periodCode, authContext.sessionInfo.accessToken)
            .then(data => {
                studentContext.refreshPeriods()
                setPeriodCode('')
            })
    }


    useEffect(() => {
        setEnrolledPeriods(studentContext.availablePeriods);
    }, [studentContext.availablePeriods]);

    return (
<div className="container mt-5 text-start">
  {/* Enroll in a New Period */}
  <div className="row">
    <h4 className="fs-5 mb-3">Enroll in a New Period</h4>
    <div className="d-flex mb-4">
      <input
        type="text"
        className="form-control me-2"
        value={periodCode}
        onChange={(e) => setPeriodCode(e.target.value)}
        id="periodCode"
        placeholder="Enter period code"
      />
      <button
        type="button"
        className="btn btn-primary w-auto"
        onClick={() => handleAdd()}
      >
        Enroll
      </button>
    </div>
  </div>

  {/* My Enrolled Periods */}
  <div className="row mt-5">
    <h4 className="fs-5 mb-3">My Enrolled Periods</h4>
    <div className="row g-4">
      {enrolledPeriods.map((period, index) => (
        <div className="col-md-4 col-sm-6 col-12" key={index}>
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h6 className="card-title mb-1">{period.name}</h6>
                    </div>
                  </div>
                  <div className="row">
                    <span className="fs-6 text-muted">Code: {period.periodId}</span>
                  </div>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemove(period.periodId)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
    );
}

export default EnrollPeriod;