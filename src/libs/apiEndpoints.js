const API_BASE_URL = process.env.REACT_APP_BACKEND_API_ENDPOINT;

const API_ENDPOINTS = {
  POST_STUDENT_ENROLLMENT: (studentId, periodId) => `${API_BASE_URL}/api/v1/periods/${periodId}/students/${studentId}/enrollments`,
  DELETE_STUDENT_ENROLLMENT: (studentId, periodId) => `${API_BASE_URL}/api/v1/periods/${periodId}/students/${studentId}/enrollments`,
  GET_STUDENT_PERIODS: (studentId) => `${API_BASE_URL}/api/v1/students/${studentId}/periods`,
  GET_ACTIVITY_RESULTS: () => `${API_BASE_URL}/api/v1/exerciseresults/`,
};

export async function postStudentEnrollment(studentId, periodId, accessToken) {
    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Bearer ' + accessToken
    };

    debugger;
    return await fetch(API_ENDPOINTS.POST_STUDENT_ENROLLMENT(studentId, periodId), { method: 'POST', headers: headers })
        .then(response => response.text())
        .catch(err => {
            throw err;
        }); 
}

export async function deleteStudentEnrollment(studentId, periodId, accessToken) {
    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Bearer ' + accessToken
    };

    debugger;
    return await fetch(API_ENDPOINTS.DELETE_STUDENT_ENROLLMENT(studentId, periodId), { method: 'DELETE', headers: headers })
        .then(response => response.text())
        .catch(err => {
            throw err;
        }); 
}

export async function getActivityResults(worksheetContentCopy, exerciseId, studentId, periodId, score, accessToken) {
    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Bearer ' + accessToken
    };

    let body = {
        worksheetContentCopy: worksheetContentCopy,
        exerciseId: exerciseId,
        studentId: studentId,
        periodId: periodId,
        score: score
    }

    return await fetch(API_ENDPOINTS.GET_ACTIVITY_RESULTS(), { method: 'POST', headers: headers, body: body })
        .then(response => response.text())
        .catch(err => {
            throw err;
        });
}

export async function getStudentPeriods(studentId, accessToken) {
    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Bearer ' + accessToken
    };
  
    return await fetch(API_ENDPOINTS.GET_STUDENT_PERIODS(studentId), { headers: headers })
        .then(response => response.json())
        .catch(err => {
            throw err;
        });
}
