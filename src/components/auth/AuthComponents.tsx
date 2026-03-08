import React from 'react';

const inputClass = 'input input-bordered rounded-bubble border-2 border-water-foam w-full focus:border-water-mid focus:outline-none';
const inputInvalidClass = 'input input-bordered input-error rounded-bubble border-2 w-full';

export const Email: React.FunctionComponent<{
  emailIsValid: boolean;
  setEmail: (_: string) => void;
}> = ({ emailIsValid, setEmail }) => (
  <div className="form-control">
    <label className="label"><span className="label-text">Email</span></label>
    <input
      type="email"
      placeholder={emailIsValid ? 'Email' : 'Invalid Email'}
      onChange={(e) => setEmail(e.target.value)}
      className={!emailIsValid ? inputInvalidClass : inputClass}
    />
  </div>
);

export const Password: React.FunctionComponent<{
  label: string;
  passwordIsValid: boolean;
  setPassword: (_: string) => void;
}> = ({ label, passwordIsValid, setPassword }) => (
  <div className="form-control">
    <label className="label"><span className="label-text">{label}</span></label>
    <input
      type="password"
      placeholder={passwordIsValid ? label : 'Minimum 8 characters'}
      onChange={(e) => setPassword(e.target.value)}
      className={!passwordIsValid ? inputInvalidClass : inputClass}
    />
  </div>
);

export const Username: React.FunctionComponent<{
  usernameIsValid: boolean;
  setUsername: (_: string) => void;
}> = ({ usernameIsValid, setUsername }) => (
  <div className="form-control">
    <label className="label"><span className="label-text">Username</span></label>
    <input
      type="text"
      placeholder={usernameIsValid ? 'Username' : 'Minimum 3 characters'}
      onChange={(e) => setUsername(e.target.value)}
      className={!usernameIsValid ? inputInvalidClass : inputClass}
    />
  </div>
);

export const Code: React.FunctionComponent<{
  codeIsValid: boolean;
  setCode: (_: string) => void;
}> = ({ codeIsValid, setCode }) => (
  <div className="form-control">
    <label className="label"><span className="label-text">Code</span></label>
    <input
      type="text"
      placeholder={codeIsValid ? 'Code' : 'Minimum 6 characters'}
      onChange={(e) => setCode(e.target.value)}
      className={!codeIsValid ? inputInvalidClass : inputClass}
    />
  </div>
);

export const GivenName: React.FunctionComponent<{
  givenNameIsValid: boolean;
  setGivenName: (_: string) => void;
}> = ({ givenNameIsValid, setGivenName }) => (
  <div className="form-control">
    <label className="label"><span className="label-text">Given Name</span></label>
    <input
      type="text"
      placeholder={givenNameIsValid ? 'Given Name' : 'Min 1 character'}
      onChange={(e) => setGivenName(e.target.value)}
      className={!givenNameIsValid ? inputInvalidClass : inputClass}
    />
  </div>
);

export const FamilyName: React.FunctionComponent<{
  familyNameIsValid: boolean;
  setFamilyName: (_: string) => void;
}> = ({ familyNameIsValid, setFamilyName }) => (
  <div className="form-control">
    <label className="label"><span className="label-text">Family Name</span></label>
    <input
      type="text"
      placeholder={familyNameIsValid ? 'Family Name' : 'Min 1 character'}
      onChange={(e) => setFamilyName(e.target.value)}
      className={!familyNameIsValid ? inputInvalidClass : inputClass}
    />
  </div>
);
