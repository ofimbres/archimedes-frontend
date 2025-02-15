import React, { useState, useContext } from 'react'

import { useNavigate } from 'react-router-dom'

import { useValidUsername } from '../../hooks/UseAuthHooks'
import { Username } from '../../components/auth/AuthComponents'

import { AuthContext } from '../../contexts/AuthContext'

export default function RequestCode() {

  const { username, setUsername, usernameIsValid } = useValidUsername('')
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const isValid = !usernameIsValid || username.length === 0

  const navigate = useNavigate()

  const authContext = useContext(AuthContext)

  const sendCodeClicked = async () => {
    try {
      await authContext.sendCode(username)
      setResetSent(true)
    } catch (err) {
      setError('Unknown user')
    }
  }

  const emailSent = (
    <div>
        <div className="mt-3">
            <h5>{`Reset Code Sent to ${username}`}</h5>
        </div>
        <div className="mt-4">
            <button onClick={() => navigate('/forgotpassword')} className="btn btn-primary">
            Reset Password
            </button>
        </div>
    </div>
  )

  const sendCode = (
    <div>
        <div className="m-3" style={{width: "80%"}}>
            <Username usernameIsValid={usernameIsValid} setUsername={setUsername} />
        </div>
        <div className="mt-2">
            <p className="text-danger">
            {error}
            </p>
        </div>

        <div className="mt-2 d-flex justify-content-center">
            <div className="m-1">
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
                Cancel
            </button>
            </div>
            <div className="m-1">
            <button disabled={isValid} onClick={sendCodeClicked} className="btn btn-primary">
                Send Code
            </button>
            </div>
        </div>
    </div>
  )

  return (
    <div className="d-flex justify-content-center align-items-center">
        <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center align-items-center">
            <div className="w-100 p-4" style={{backgroundColor: '#ffffff'}}>
              <div className="d-flex flex-column justify-content-center align-items-center">
                  <div className="m-2">
                      <h3>Send Reset Code</h3>
                  </div>

                  {resetSent ? emailSent : sendCode}
              </div>
            </div>
        </div>
    </div>
  )
}