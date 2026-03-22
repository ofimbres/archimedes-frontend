/**
 * Archimedes miniquiz helper: read launch params from query, session JWT from URL hash,
 * POST completion to {archimedes_api_base}/api/v1/assignments/{assignment_id}/completions.
 *
 * Hash must be set by the student app, e.g. #id_token=<encodeURIComponent(token)>
 * or #access_token=<encodeURIComponent(token)>.
 */

function parseHashToken() {
  var raw = (window.location.hash || '').replace(/^#/, '');
  if (!raw) return { key: '', value: '' };
  var parts = raw.split('&');
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];
    var eq = p.indexOf('=');
    if (eq === -1) continue;
    var k = p.slice(0, eq);
    var v = p.slice(eq + 1);
    if (k === 'id_token' || k === 'access_token') {
      try {
        return { key: k, value: decodeURIComponent(v) };
      } catch (e) {
        return { key: k, value: v };
      }
    }
  }
  return { key: '', value: '' };
}

function getLaunchParams() {
  var sp = new URLSearchParams(window.location.search);
  return {
    archimedesApiBase: (sp.get('archimedes_api_base') || '').replace(/\/+$/, ''),
    assignmentId: sp.get('assignment_id') || '',
    studentId: sp.get('student_id') || '',
    studentName: sp.get('student_name') || sp.get('studentName') || '',
  };
}

function parseScoreForArchimedes(grade) {
  if (grade == null || grade === '') return null;
  var s = String(grade).trim();
  if (s === '') return null;
  var pct = s.indexOf('%');
  if (pct !== -1) s = s.slice(0, pct).trim();
  var n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function submitToArchimedesApi(grade) {
  var tok = parseHashToken();
  var token = tok.value;
  var launch = getLaunchParams();
  if (!token || !launch.archimedesApiBase || !launch.assignmentId || !launch.studentId) {
    console.warn('Archimedes completion: missing id_token/access_token in hash or launch query params');
    return Promise.resolve(false);
  }
  var url =
    launch.archimedesApiBase +
    '/api/v1/assignments/' +
    encodeURIComponent(launch.assignmentId) +
    '/completions';
  var score = parseScoreForArchimedes(grade);
  var body = { student_id: launch.studentId };
  if (score != null) body.score = score;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  })
    .then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          console.warn('Archimedes completion failed', res.status, t);
          return false;
        });
      }
      return true;
    })
    .catch(function (err) {
      console.warn('Archimedes completion error', err);
      return false;
    });
}

function submitForm() {
  var studentGradeCell = document.querySelectorAll('[data-grade-field]')[0];
  var grade = studentGradeCell ? studentGradeCell.getAttribute('data-cval') : null;
  if (typeof createStaticForm === 'function') {
    try {
      createStaticForm(true);
    } catch (e) {
      /* optional hook from worksheet HTML */
    }
  }

  submitToArchimedesApi(grade).then(function (ok) {
    if (ok) {
      document.write('Submitted. You can close this tab and return to Archimedes to see your updated assignments.');
    } else {
      document.write('Could not submit to Archimedes. Return to the assignments page and try again, or contact your teacher.');
    }
  });

  return false;
}

function updateCellFields(event) {
  var studentNameElement = document.querySelectorAll('[data-name-field]')[0];
  var studentIdElement = document.querySelectorAll('[data-id-field]')[0];
  if (!studentNameElement || !studentIdElement) return;

  var message = event.data;
  if (!message) return;

  studentNameElement.innerHTML = message.studentName;
  studentIdElement.innerHTML = generateNumericId(message.studentId);
  studentIdElement.setAttribute('data-cval', generateNumericId(message.studentId));
  calculate(studentIdElement.id);
}

function prefillStudentFromQuery() {
  var launch = getLaunchParams();
  if (!launch.studentName) return;
  var studentNameElement = document.querySelectorAll('[data-name-field]')[0];
  if (studentNameElement) {
    studentNameElement.textContent = launch.studentName;
  }
}

function init() {
  prefillStudentFromQuery();
  window.addEventListener('message', updateCellFields, false);
}

function generateNumericId(studentId) {
  var hash = hashCode(studentId).toString();
  return hash.substring(hash.length - 5);
}

function hashCode(str) {
  var hash = 0,
    i,
    chr;
  if (!str || str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

init();
