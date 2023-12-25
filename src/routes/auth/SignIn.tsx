import React from 'react'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

import "./SignIn.css"

const SignIn = () => {

    const [ username, setUsername ] = useState('') //useValidUsername('')
    const [ password, setPassword ] = useState('') //useValidPassword('')
    const [error, setError] = useState('')
  
    //const isValid = !usernameIsValid || username.length === 0 || !passwordIsValid || password.length === 0
  
    const navigate = useNavigate()
  
    const authContext = useContext(AuthContext)
  
    const handleSignIn = async (e: any) => {
      e.preventDefault()

      try {
        await authContext.signInWithEmail(username, password)
        navigate('/')
      } catch (err: any) {
        if (err.code === 'UserNotConfirmedException') {
          navigate('/verify')
        } else {
          setError(err.message)
        }
      }
    }
  
    /*const passwordResetClicked = async () => {
      navigate('/requestcode')
    }*/

    const handleUsername = (e: any) => {
        setUsername(e.target.value)
    }

    const handlePassword = (e: any) => {
        setPassword(e.target.value)
    }

    return (
        <main className="form-signin">
            <form onSubmit={handleSignIn}>
                <img className="mb-4" src="../assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" />
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                <div className="form-floating">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" onChange={handleUsername} />
                <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" onChange={handlePassword} />
                <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me" /> Remember me
                </label>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>

                {error}
                <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
            </form>
        </main>
    );
}

export default SignIn;