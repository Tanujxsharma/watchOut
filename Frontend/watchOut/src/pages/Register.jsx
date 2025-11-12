import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Auth.css'

export default function Register () {
  const [userType, setUserType] = useState('public') // 'public' | 'company'
  const location = useLocation()
  const isRegisterPage = location.pathname === '/register'

  return (
    <div className='auth-container'>
      <div className='auth-panel'>
        <h2 className='auth-title'>Register</h2>
        <p className='auth-subtitle'>Create an account to promote financial transparency</p>

        {/* Switch between Login & Register */}
        <div className='auth-switch'>
          <Link to='/login' className={!isRegisterPage ? 'switch-link active' : 'switch-link'}>Login</Link>
          <Link to='/register' className={isRegisterPage ? 'switch-link active' : 'switch-link'}>Register</Link>
        </div>

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

        <form className='auth-form' onSubmit={e => e.preventDefault()}>
          {userType === 'public' ? (
            <>
              <label>Name</label>
              <input type='text' placeholder='John Doe' required />

              <label>Email</label>
              <input type='email' placeholder='your.email@example.com' required />
            </>
          ) : (
            <>
              <label>Company Name</label>
              <input type='text' placeholder='ACME Inc.' required />

              <label>Email</label>
              <input type='email' placeholder='contact@company.com' required />

              <label>GST Number</label>
              <input type='text' placeholder='22AAAAA0000A1Z5' required />

              <label>About Company</label>
              <textarea placeholder='Brief description of your company' rows='3' required />
            </>
          )}

          <label>Password</label>
          <input type='password' placeholder='Create a strong password' required />

          <button type='submit' className='primary-btn'>
            {userType === 'public' ? 'Register as Public User' : 'Send Register Company Request'}
          </button>
        </form>

        <div className='divider'>Already have an account?</div>
        <a href='/login' className='link-btn'>Back to Login</a>
      </div>
    </div>
  )
}