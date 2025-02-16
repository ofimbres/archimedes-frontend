import React, { useState, useEffect, useContext } from 'react'

import { jwtDecode } from "jwt-decode";

// import * as cognito from '../libs/cognito'

export enum AuthStatus {
  Loading,
  SignedIn,
  SignedOut,
  InProcess
}

export interface IAuth {
  sessionInfo?: { username?: string; email?: string; sub?: string; accessToken?: string; refreshToken?: string, groups?: string[] }
  attrInfo?: any
  authStatus?: AuthStatus
  signInWithEmail?: any
  signUpWithEmail?: any
  signOut?: any
  verifyCode?: any
  getSession?: any
  sendCode?: any
  forgotPassword?: any
  changePassword?: any
  getAttributes?: any
  //setAttribute?: any
}

const defaultState: IAuth = {
  sessionInfo: {},
  authStatus: AuthStatus.Loading,
}

type Props = {
  children?: React.ReactNode,
  role?: string
}

export const AuthContext = React.createContext(defaultState)

export const AuthIsSignedIn = ({ children, role }: Props) => {
  const { authStatus, sessionInfo }: IAuth = useContext(AuthContext)

  return role
   ? <>{authStatus === AuthStatus.SignedIn && sessionInfo?.groups?.includes(role) ? children : null}</>
   : <>{authStatus === AuthStatus.SignedIn ? children : null}</>
}

export const AuthIsNotSignedIn = ({ children }: Props) => {
  const { authStatus }: IAuth = useContext(AuthContext)

  return <>{authStatus === AuthStatus.SignedOut ? children : null}</>
}

const AuthProvider = ({ children }: Props) => {
  const [authStatus, setAuthStatus] = useState(AuthStatus.Loading)
  const [sessionInfo, setSessionInfo] = useState({})
  const [attrInfo, setAttrInfo] = useState([])

  useEffect(() => {
    async function getSessionInfo() {
      try {
        const session: any = await getSession()
        setSessionInfo({
          accessToken: session.accessToken.jwtToken,
          refreshToken: session.refreshToken.token,
          groups: session.accessToken.payload['cognito:groups'],
          username: session.accessToken.payload['username'],
        })
        //window.localStorage.setItem('accessToken', `${session.accessToken.jwtToken}`)
        //window.localStorage.setItem('refreshToken', `${session.refreshToken.token}`)
        // await setAttribute({ Name: 'website', Value: 'https://github.com/dbroadhurst/aws-cognito-react' })
        const attr: any = await getAttributes()
        setAttrInfo(attr)
        setAuthStatus(AuthStatus.SignedIn)
      } catch (err) {
        setAuthStatus(AuthStatus.SignedOut)
      }
    }
    getSessionInfo()
  }, [setAuthStatus, authStatus])

  if (authStatus === AuthStatus.Loading) {
    return null
  }

  async function signInWithEmail(username: string, password: string) {
    try {
      const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
      let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
      }

      let body = {
        username: username,
        password: password
      }
      let response = await fetch(`${endpoint}/api/v1/auth/login`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      })
      let data = await response.json()
      localStorage.setItem('lastUsername', data.user.username);
      localStorage.setItem('accessToken', data.user.accessToken);
      //await cognito.signInWithEmail(username, password)
      setAuthStatus(AuthStatus.InProcess)
    } catch (err) {
      setAuthStatus(AuthStatus.SignedOut)
      throw err
    }
  }

  async function signUpWithEmail(givenName: string, familyName: string, username: string, email: string, password: string, userType: string) {
    try {
      //await cognito.signUpUserWithEmail(givenName, familyName, username, email, password)
      const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
      let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
      }

      let body = {
        username: username,
        password: password,
        email: email,
        givenName: givenName,
        familyName: familyName,
        userType: userType
      }
      let response = await fetch(`${endpoint}/api/v1/auth/register`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      })
      let data = await response.text()
    } catch (err) {
      throw err
    }
  }

  function signOut() {
    // cognito.signOut()
    localStorage.removeItem('lastUsername');
    localStorage.removeItem('accessToken');
    setAuthStatus(AuthStatus.SignedOut)
  }

  // TODO
  async function verifyCode(username: string, code: string) {
    try {
      //await cognito.verifyCode(username, code)
      //const username = localStorage.getItem('lastUsername');
      const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
      let body = {
        username: username,
        confirmationCode: code
      }
      let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
      }

      let response = await fetch(`${endpoint}/api/v1/auth/verify-code`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      })
      let data = await response.text();
      return data;
    } catch (err) {
      throw err
    }
  }

  async function getSession() {
    try {
      //const session = await cognito.getSession()
      //return session;
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken != null) {
        const payload = jwtDecode(accessToken);

        return {
          accessToken: {
            jwtToken: accessToken,
            payload: payload
          },
          refreshToken: {
            token: 'refreshToken'
          }
        };
      }
      return null;
    } catch (err) {
      throw err
    }
  }

  async function getAttributes() {
    try {
      //const attr = await cognito.getAttributes()
      //return attr
      const username = localStorage.getItem('lastUsername');
      const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
      let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
      }

      let response = await fetch(`${endpoint}/api/v1/auth/${username}/attributes`, {
        method: 'GET',
        headers: headers
      })
      let data = await response.json();
      return data;
    } catch (err) {
      throw err
    }
  }

  // async function setAttribute(attr: any) {
  //   try {
  //     const res = await cognito.setAttribute(attr)
  //     return res
  //   } catch (err) {
  //     throw err
  //   }
  // }

  async function sendCode(username: string) {
    try {
      //await cognito.sendCode(username)
    } catch (err) {
      throw err
    }
  }

  async function forgotPassword(username: string) {
    try {
      //await cognito.forgotPassword(username, code, password)
      //await cognito.verifyCode(username, code)
      //const username = localStorage.getItem('lastUsername');
      const endpoint = process.env.REACT_APP_BACKEND_API_ENDPOINT;
      let body = {
        username: username
      }
      let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
      }

      let response = await fetch(`${endpoint}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      })
      let data = await response.text();
      return data;
    } catch (err) {
      throw err
    }
  }

  async function changePassword(oldPassword: string, newPassword: string) {
    try {
      // await cognito.changePassword(oldPassword, newPassword)
      // TODO
    } catch (err) {
      throw err
    }
  }

  const state: IAuth = {
    authStatus,
    sessionInfo,
    attrInfo,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    verifyCode,
    getSession,
    sendCode,
    forgotPassword,
    changePassword,
    getAttributes,
    //setAttribute,
  }

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export default AuthProvider