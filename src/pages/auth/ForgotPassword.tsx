import React, { useState, useContext } from 'react'

import { useNavigate } from 'react-router-dom'

import { useValidCode, useValidPassword, useValidUsername } from '../../hooks/UseAuthHooks'
import { Code, Password, Username } from '../../components/auth/AuthComponents'

import { AuthContext } from '../../contexts/AuthContext'


export default function ForgotPassword() {
  const { code, setCode, codeIsValid } = useValidCode('')
  const { password, setPassword, passwordIsValid } = useValidPassword('')
  const { username, setUsername, usernameIsValid } = useValidUsername('')
  const [error, setError] = useState('')
  const [reset, setReset] = useState(false)

  const {
    password: passwordConfirm,
    setPassword: setPasswordConfirm,
    passwordIsValid: passwordConfirmIsValid,
  } = useValidPassword('')

  const isValid =
    !codeIsValid ||
    code.length === 0 ||
    !usernameIsValid ||
    username.length === 0 ||
    !passwordIsValid ||
    password.length === 0 ||
    !passwordConfirmIsValid ||
    passwordConfirm.length === 0

  const navigate = useNavigate()

  const authContext = useContext(AuthContext)

  const resetPassword = async () => {
    try {
      await authContext.forgotPassword(username, code, password)
      setReset(true)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  const updatePassword = (
    <div className="container" style={{width: '80%'}}>
    <div className="my-3">
        <Code codeIsValid={codeIsValid} setCode={setCode} />
    </div>
    <div className="my-3">
        <Username usernameIsValid={usernameIsValid} setUsername={setUsername} />
    </div>
    <div className="my-3">
        <Password label="Password" passwordIsValid={passwordIsValid} setPassword={setPassword} />
    </div>
    <div className="my-3">
        <Password label="Confirm Password" passwordIsValid={passwordConfirmIsValid} setPassword={setPasswordConfirm} />
    </div>

    <div className="mt-4">
        <p className="text-danger">{error}</p>
    </div>

    <div className="mt-4 d-flex justify-content-center">
        <div className="mx-2">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
        </button>
        </div>
        <div className="mx-2">
        <button className="btn btn-primary" disabled={isValid} onClick={resetPassword}>
            Change Password
        </button>
        </div>
    </div>
    </div>
  )

  const passwordReset = (
    <div className="container">
        <h5>Password Reset</h5>

        <div className="mt-4">
            <button onClick={() => navigate('/signin')} className="btn btn-primary">
            Sign In
            </button>
        </div>
    </div>
  )

  return (
    <div className="d-flex justify-content-center align-items-center">
    <div className="col-xs-11 col-sm-6 col-lg-4 d-flex justify-content-center align-items-center">
        <div className="card" style={{ width: '100%', padding: '16px' }}>
        <div className="d-flex flex-column justify-content-center align-items-center">
            {/* Title */}
            <div className="my-3 d-flex justify-content-center align-items-center">
            <h3>Forgot Password</h3>
            </div>

            {!reset ? updatePassword : passwordReset}
        </div>
        </div>
    </div>
    </div>

  )
}