import React, { useState, useContext } from 'react'

import { useNavigate } from 'react-router-dom'

// import { useValidPassword } from '../../hooks/useAuthHooks'

import { AuthContext } from '../../contexts/AuthContext'


export default function ChangePassword() {

  const [error, setError] = useState('')
  const [reset, setReset] = useState(false)

  const {
    password: oldPassword,
    setPassword: setOldPassword,
    passwordIsValid: oldPasswordIsValid,
  } = useValidPassword('')

  const {
    password: newPassword,
    setPassword: setNewPassword,
    passwordIsValid: newPasswordIsValid,
  } = useValidPassword('')

  const isValid = !oldPasswordIsValid || oldPassword.length === 0 || !newPasswordIsValid || newPassword.length === 0

  const navigate = useNavigate()

  const authContext = useContext(AuthContext)

  const changePassword = async () => {
    try {
      await authContext.changePassword(oldPassword, newPassword)
      setReset(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const signOut = async () => {
    try {
      await authContext.signOut()
      navigate('/')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  const updatePassword = (
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-10">
            <label htmlFor="oldPassword">Old Password</label>
            <input type="password" className="form-control" id="oldPassword" />
            </div>
            <div className="col-10">
            <label htmlFor="newPassword">Password</label>
            <input type="password" className="form-control" id="newPassword" />
            </div>
            <div className="col-10 mt-2">
            <p className="text-danger">{error}</p>
            </div>
            <div className="col-10 mt-2 d-flex justify-content-center">
            <button type="button" className="btn btn-secondary m-1" onClick={() => navigate(-1)}>
                Cancel
            </button>
            <button type="button" className="btn btn-primary m-1" disabled={isValid} onClick={changePassword}>
                Change Password
            </button>
            </div>
        </div>
    </div>
  )

  const passwordReset = (
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-12">
            <h5>Password Changed</h5>
            </div>
            <div className="col-12 mt-4">
            <button type="button" className="btn btn-primary" onClick={signOut}>
                Sign In
            </button>
            </div>
        </div>
    </div>
  )

  return (
    <div className="container">
        <div className="row justify-content-center align-items-center">
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center align-items-center">
            <div className="card" style={{ width: '100%', padding: '16px' }}>
                <div className="card-body text-center">

                <div className="my-3">
                    <h3>Change Password</h3>
                </div>

                {!reset ? updatePassword : passwordReset}
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}