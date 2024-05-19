import React, { useState, useContext } from 'react'

import { useNavigate } from 'react-router-dom'

import { useValidCode, useValidUsername } from '../../hooks/UseAuthHooks'
import { Code, Username } from '../../components/auth/AuthComponents'

import { AuthContext } from '../../contexts/AuthContext'


const VerifyCode: React.FunctionComponent<{}> = () => {
  const { username, setUsername, usernameIsValid } = useValidUsername('')
  const { code, setCode, codeIsValid } = useValidCode('')
  const [error, setError] = useState('')

  const isValid = !usernameIsValid || username.length === 0 || !codeIsValid || code.length === 0

  const navigate = useNavigate()

  const authContext = useContext(AuthContext)

  const sendClicked = async () => {
    try {
      await authContext.verifyCode(username, code)
      navigate('/signin')
    } catch (err) {
      setError('Invalid Code')
    }
  }

  const passwordResetClicked = async () => {
    navigate('/resetpassword')
  }

  return (
    <div className="container d-flex justify-content-center align-items-center">
        <div className="row">
            <div className="w-100 p-4 d-flex justify-content-center align-items-center">
              <div className="card" style={{width: '100%', padding: '32px'}}>
                  <div className="container d-flex flex-column justify-content-center align-items-center">
                    <div className="m-3">
                        <h3>Send Code</h3>
                    </div>

                    <div className="w-80 m-1">
                        <Username usernameIsValid={usernameIsValid} setUsername={setUsername} />
                    </div>
                    <div className="w-80 m-1">
                        <Code codeIsValid={codeIsValid} setCode={setCode} />
                        <div className="container d-flex flex-row justify-content-start align-items-center">
                          <div className="mt-2" onClick={passwordResetClicked}>
                              <p className="text-body">Resend Code</p>
                              <div className="mt-2">
                                <p className="text-danger">{error}</p>
                              </div>
                          </div>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="container d-flex flex-row justify-content-center">
                          <div className="m-1">
                              <button className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
                          </div>
                          <div className="m-1">
                              <button className="btn btn-primary" disabled={isValid} onClick={sendClicked}>Send</button>
                          </div>
                        </div>
                    </div>
                  </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default VerifyCode