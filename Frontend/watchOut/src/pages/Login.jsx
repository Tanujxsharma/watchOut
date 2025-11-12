import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Auth.css'

export default function Login () {
  const [userType, setUserType] = useState('public') // 'public' | 'company'
  const location = useLocation()
  const navigate = useNavigate()
  const isLoginPage = location.pathname === '/login'

  return (
    <div className='auth-container'>
      <div className='auth-panel'>
        <h2 className='auth-title'>Login</h2>
        <p className='auth-subtitle'>Join the movement for government financial transparency</p>

        {/* Switch between Login & Register */}
        <div className='auth-switch'>
          <Link to='/login' className={isLoginPage ? 'switch-link active' : 'switch-link'}>Login</Link>
          <Link to='/register' className={!isLoginPage ? 'switch-link active' : 'switch-link'}>Register</Link>
        </div>

        {/* User type toggle */}
        <div className='user-type-toggle'>
          <button
            className={userType === 'public' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setUserType('public')}
          >
            Public User
          </button>
          <button
            className={userType === 'company' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setUserType('company')}
          >
            Company
          </button>
        </div>

        <form className='auth-form' onSubmit={e => {
          e.preventDefault()
          localStorage.setItem('userType', userType)
          navigate('/dashboard', { state: { userType } })
        }}>
          {userType === 'public' ? (
            <>
              <label>Email</label>
              <input type='email' placeholder='your.email@example.com' required />
            </>
          ) : (
            <>
              <label>Company Name</label>
              <input type='text' placeholder='ACME Inc.' required />
            </>
          )}

          <label>Password</label>
          <input type='password' placeholder='••••••••' required />

          <div className='auth-extra'>
            <label className='remember-me'>
              <input type='checkbox' /> Remember me
            </label>
            <a href='#' className='forgot-link'>Forgot password?</a>
          </div>

          <button type='submit' className='primary-btn'>
            {userType === 'public' ? 'Login as Public User' : 'Login as Company'}
          </button>
        </form>

        <div className='divider'>or continue with</div>

        <div className='oauth-buttons'>
          <button className='oauth-btn google'>Google</button>
          <button className='oauth-btn gov-id'>Gov ID</button>
        </div>
      </div>
    </div>
  )
}