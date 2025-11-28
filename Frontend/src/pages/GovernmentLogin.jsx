import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export default function GovernmentLogin() {
  const { governmentLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values) => {
    await governmentLogin(values);
    const redirectTo = location.state?.from?.pathname || '/government/dashboard';
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 space-y-6">
        <div>
          <p className="text-sm font-semibold text-purple-600 uppercase tracking-widest">Government Access</p>
          <h1 className="text-3xl font-bold mt-2 text-gray-900">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">
            Restricted access for verified government officials only.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              {...register('password')}
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-60"
          >
            {isSubmitting ? 'Validating...' : 'Enter Dashboard'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Need a regular account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Go back to user login
          </Link>
        </div>
      </div>
    </div>
  );
}

