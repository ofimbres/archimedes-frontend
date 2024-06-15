import React, { useState, useContext } from 'react'

import { useNavigate } from 'react-router-dom'

import { useValidEmail, useValidPassword, useValidUsername, useValidGivenName, useValidFamilyName } from '../../hooks/UseAuthHooks'
import { Email, Password, Username, GivenName, FamilyName } from '../../components/auth/AuthComponents'

import { AuthContext } from '../../contexts/AuthContext'


const SignUp: React.FunctionComponent<{}> = () => {

  const { email, setEmail, emailIsValid } = useValidEmail('')
  const { password, setPassword, passwordIsValid } = useValidPassword('')
  const { username, setUsername, usernameIsValid } = useValidUsername('')
  const { givenName, setGivenName, givenNameIsValid } = useValidGivenName('')
  const { familyName, setFamilyName, familyNameIsValid } = useValidFamilyName('')
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('')
  const [created, setCreated] = useState(false)

  const {
    password: passwordConfirm,
    setPassword: setPasswordConfirm,
    passwordIsValid: passwordConfirmIsValid,
  } = useValidPassword('')

  const isValid =
    !emailIsValid || email.length === 0 ||
    !usernameIsValid || username.length === 0 ||
    !passwordIsValid || password.length === 0 ||
    !passwordConfirmIsValid || passwordConfirm.length === 0 ||
    !givenNameIsValid || givenName.length === 0 ||
    !familyNameIsValid || familyName.length === 0

  const navigate = useNavigate()

  const authContext = useContext(AuthContext)

  const signInClicked = async () => {
    try {
      await authContext.signUpWithEmail(givenName, familyName, username, email, password)
      setCreated(true)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  const userTypeButtons = (
    <div className="d-flex flex-column align-items-center">
    <p className="m-1">Who are you?</p>
    <div className="d-flex justify-content-center">
      <button onClick={() => setUserType('students')} className="btn btn-primary btn-lg m-1">
        I am a Student
      </button>
      <button onClick={() => setUserType('teachers')} className="btn btn-primary btn-lg m-1">
        I am a Teacher
      </button>
    </div>
  </div>
);

  const signUp = (
    <div className="container" style={{width: "80%"}}>
        <div className="m-1">
            <GivenName givenNameIsValid={givenNameIsValid} setGivenName={setGivenName} />
        </div>
        <div className="m-1">
            <FamilyName familyNameIsValid={familyNameIsValid} setFamilyName={setFamilyName} />
        </div>
        <div className="m-1">
            <Email emailIsValid={emailIsValid} setEmail={setEmail} />
        </div>
        <div className="m-1">
            <Username usernameIsValid={usernameIsValid} setUsername={setUsername} />
        </div>
        <div className="m-1">
            <Password label="Password" passwordIsValid={passwordIsValid} setPassword={setPassword} />
        </div>
        <div className="m-1">
            <Password label="Confirm Password" passwordIsValid={passwordConfirmIsValid} setPassword={setPasswordConfirm} />
        </div>
        <div className="mt-2">
            <p className="text-danger">
            {error}
            </p>
        </div>

        {/* Buttons */}
        <div className="mt-2">
            <div className="d-flex justify-content-center">
            <div className="m-1">
                <button onClick={() => navigate(-1)} className="btn btn-secondary">
                Cancel
                </button>
            </div>
            <div className="m-1">
                <button disabled={isValid} className="btn btn-primary" onClick={signInClicked}>
                Sign Up
                </button>
            </div>
            </div>
        </div>
    </div>
  )

  const accountCreated = (
    <div>
    <h5>Created {username} account</h5>
    <h6>Verify Code sent to {email}</h6>

    <div className="m-4">
        <button onClick={() => navigate('/verify')} className="btn btn-primary">
        Send Code
        </button>
    </div>
    </div>
  )

  return (
    <div className="d-flex justify-content-center align-items-center">
        <div className="col-11 col-sm-6 col-lg-4 d-flex justify-content-center align-items-center">
            <div className="card" style={{ width: '100%', padding: 16 }}>
            <div className="d-flex flex-column justify-content-center align-items-center">
                {/* Title */}
                <div className="m-3">
                    <div className="d-flex justify-content-center align-items-center">
                        <h3>Sign Up</h3>
                    </div>
                </div>

                {!userType ? userTypeButtons : !created ? signUp : accountCreated}
            </div>
            </div>
        </div>
    </div>
  )
}

export default SignUp