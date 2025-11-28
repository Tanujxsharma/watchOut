import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const heroHighlights = [
  { title: 'Realtime transparency', description: 'Monitor tenders, complaints, and resolutions with one login.' },
  { title: 'Dual access', description: 'Switch between public and company flows without leaving the screen.' },
  { title: 'Secure workflows', description: 'Every action is protected with Firebase auth, CSRF, and rate limiting.' }
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();
  const [role, setRole] = useState('user');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values) => {
    try {
      const user = await login(values);
      const redirectTo = location.state?.from?.pathname || (user.role === 'company' ? '/company-dashboard' : '/dashboard');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to login');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await googleLogin({ role });
      const redirectTo = user.role === 'company' ? '/company-dashboard' : '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Google login failed');
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-6xl rounded-3xl shadow-2xl bg-white overflow-hidden grid lg:grid-cols-2">
        <div className="relative hidden lg:flex flex-col justify-between bg-linear-to-br from-blue-600 via-indigo-600 to-slate-900 text-white p-10">
          <div>
            <p className="uppercase text-xs tracking-[0.4em] text-blue-100 font-semibold">WatchOut Portal</p>
            <h1 className="text-4xl font-bold mt-4 leading-tight">
              One door for citizens, companies, and compliance officers.
            </h1>
            <p className="text-blue-100/80 mt-4 text-sm max-w-sm">
              File complaints, manage bids, or review approvals in a single secure workspace backed by Firebase & Cloudinary.
            </p>
          </div>

          <ul className="space-y-5 text-sm">
            {heroHighlights.map((item) => (
              <li key={item.title} className="flex gap-4 items-start">
                <span className="h-10 w-10 flex items-center justify-center rounded-full border border-white/30">
                  <span className="text-lg">✦</span>
                </span>
                <div>
                  <p className="font-semibold tracking-wide">{item.title}</p>
                  <p className="text-blue-100/70">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="text-xs text-blue-100/70">
            Protected by multi-layer security · Gov approval ready · Cloud-native
          </div>
        </div>

        <div className="p-8 sm:p-10 space-y-8">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-blue-600">Welcome back</p>
            <h2 className="text-3xl font-bold text-slate-900">Sign in to continue</h2>
            <p className="text-sm text-slate-500">Choose your role and authenticate securely.</p>
          </div>

          <div className="flex gap-2 bg-slate-100 p-1 rounded-full">
            {['user', 'company'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setRole(type)}
                className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition ${role === type ? 'bg-white shadow text-blue-600' : 'text-slate-500'
                  }`}
              >
                {type === 'user' ? 'Public user' : 'Company'}
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                className="mt-1 w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                className="mt-1 w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold shadow-lg hover:bg-slate-800 transition disabled:opacity-60"
            >
              {isSubmitting ? 'Signing you in...' : 'Access dashboard'}
            </button>
          </form>

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {role === 'company' ? 'Continue as company via Google' : 'Continue with Google'}
            </button>

            <div className="text-sm text-slate-500 text-center">
              New to WatchOut?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                Create an account
              </Link>
            </div>
            <div className="text-sm text-slate-400 text-center">
              Government official?{' '}
              <Link to="/government/login" className="font-semibold text-purple-600 hover:text-purple-700">
                Access admin console
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}