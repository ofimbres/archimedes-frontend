import React from 'react';
import { Form } from 'react-bootstrap';

export const Email: React.FunctionComponent<{
  emailIsValid: boolean;
  setEmail: (_: string) => void;
}> = ({ emailIsValid, setEmail }) => {
  return (
    <div className="form-floating">
      <Form.Control
        id="floatingInput"
        type="email"
        isInvalid={!emailIsValid}
        placeholder={emailIsValid ? 'Email' : 'Invalid Email'}
        onChange={evt => {
          setEmail(evt.target.value);
        }}
      />
      <label htmlFor="floatingInput">Email</label>
    </div>
  );
};

export const Password: React.FunctionComponent<{
  label: string;
  passwordIsValid: boolean;
  setPassword: (_: string) => void;
}> = ({ label, passwordIsValid, setPassword }) => {
  return (
    <div className="form-floating">
      <Form.Control
        id="floatingInput"
        type="password"
        isInvalid={!passwordIsValid}
        placeholder={passwordIsValid ? label : 'Minimum 8 characters'}
        onChange={evt => {
          setPassword(evt.target.value);
        }}
      />
      <label htmlFor="floatingInput">{label}</label>
    </div>
  );
};

export const Username: React.FunctionComponent<{
  usernameIsValid: boolean;
  setUsername: (_: string) => void;
}> = ({ usernameIsValid, setUsername }) => {
  return (
    <div className="form-floating">
      <Form.Control
        id="floatingInput"
        type="text"
        isInvalid={!usernameIsValid}
        placeholder={usernameIsValid ? 'Username' : 'Minimum 8 characters'}
        onChange={evt => {
          setUsername(evt.target.value);
        }}
      />
      <label htmlFor="floatingInput">Username</label>
    </div>
  );
};

export const Code: React.FunctionComponent<{
  codeIsValid: boolean;
  setCode: (_: string) => void;
}> = ({ codeIsValid, setCode }) => {
  return (
    <div className="form-floating">
      <Form.Control
        id="floatingInput"
        type="text"
        isInvalid={!codeIsValid}
        placeholder={codeIsValid ? 'Code' : 'Minimum 6 characters'}
        onChange={evt => {
          setCode(evt.target.value);
        }}
      />
      <label htmlFor="floatingInput">Code</label>
    </div>
  );
};

export const GivenName: React.FunctionComponent<{
  givenNameIsValid: boolean;
  setGivenName: (_: string) => void;
}> = ({ givenNameIsValid, setGivenName }) => {
  return (
    <div className="form-floating">
      <Form.Control
        id="floatingInput"
        type="text"
        isInvalid={!givenNameIsValid}
        placeholder={givenNameIsValid ? 'Given Name' : 'Minimum 1 character'}
        onChange={evt => {
          setGivenName(evt.target.value);
        }}
      />
      <label htmlFor="floatingInput">Given Name</label>
    </div>
  );
};

export const FamilyName: React.FunctionComponent<{
  familyNameIsValid: boolean;
  setFamilyName: (_: string) => void;
}> = ({ familyNameIsValid, setFamilyName }) => {
  return (
    <div className="form-floating">
      <Form.Control
        id="floatingInput"
        type="text"
        isInvalid={!familyNameIsValid}
        placeholder={familyNameIsValid ? 'Family Name' : 'Minimum 1 character'}
        onChange={evt => {
          setFamilyName(evt.target.value);
        }}
      />
      <label htmlFor="floatingInput">Family Name</label>
    </div>
  );
};
