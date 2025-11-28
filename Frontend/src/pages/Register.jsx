import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const baseFieldShape = {
  displayName: z.string().min(3, 'Full name is required'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
  photoURL: z.string().url().optional()
};

const companyFieldShape = {
  companyName: z.string().min(3),
  registrationNumber: z.string().min(3),
  address: z.string().min(10),
  documents: z.array(z.instanceof(File)).min(1, 'Upload at least one document')
};

const buildSchema = (role) => {
  const shape = role === 'company'
    ? { ...baseFieldShape, ...companyFieldShape }
    : baseFieldShape;

  return z.object(shape).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });
};

export default function Register() {
  const [role, setRole] = useState('user');
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const { signup, login, googleLogin: googleSignup } = useAuth();

  const schema = useMemo(() => buildSchema(role), [role]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      documents: []
    }
  });

  const encodeDocuments = async (files) => {
    const readers = Array.from(files).map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            fileName: file.name,
            base64: reader.result
          });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );
    return Promise.all(readers);
  };

  const onSubmit = async (values) => {
    try {
      const payload = {
        email: values.email,
        password: values.password,
        displayName: values.displayName,
        role,
        photoURL: values.photoURL || undefined
      };

      if (role === 'company') {
        const encodedDocs = await encodeDocuments(documents);
        payload.company = {
          companyName: values.companyName,
          registrationNumber: values.registrationNumber,
          address: values.address,
          documents: encodedDocs
        };
      }

      await signup(payload);

      if (role === 'user') {
        await login({ email: values.email, password: values.password });
        navigate('/dashboard', { replace: true });
      } else {
        setDocuments([]);
        toast.success('Company submitted. Government approval pending.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.message
        || 'Unable to register';
      const errorHint = error.response?.data?.hint || '';
      toast.error(errorHint ? `${errorMessage}. ${errorHint}` : errorMessage);
    }
  };

  const onGoogleSignup = handleSubmit(async (values) => {
    try {
      let companyDetails;
      if (role === 'company') {
        const encodedDocs = await encodeDocuments(documents);
        companyDetails = {
          companyName: values.companyName,
          registrationNumber: values.registrationNumber,
          address: values.address,
          documents: encodedDocs
        };
      }
      const userProfile = await googleSignup({
        role,
        company: companyDetails
      });
      const redirectTo = userProfile.role === 'company' ? '/company-dashboard' : '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Google signup failed');
    }
  });

  const handleDocumentChange = (event) => {
    const files = Array.from(event.target.files);
    setDocuments(files);
    setValue('documents', files);
  };

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-6xl rounded-3xl shadow-2xl bg-white overflow-hidden grid lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between bg-linear-to-b from-indigo-600 via-blue-700 to-slate-900 text-white p-10">
          <div>
            <p className="uppercase text-xs tracking-[0.4em] text-blue-100 font-semibold">Create account</p>
            <h1 className="text-4xl font-bold mt-4 leading-tight">Step into the WatchOut ecosystem.</h1>
            <p className="text-blue-100/80 mt-4 text-sm max-w-sm">
              Pick a public profile to monitor tenders or onboard your company to submit bids. Government teams keep every request in check.
            </p>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-4">
              <span className="text-2xl">🌐</span>
              <p>Single sign-on for public users and companies, with seamless Google OAuth fallback.</p>
            </li>
            <li className="flex gap-4">
              <span className="text-2xl">🧾</span>
              <p>Upload compliance docs securely for quick government reviews.</p>
            </li>
            <li className="flex gap-4">
              <span className="text-2xl">📈</span>
              <p>Track approval status, activity logs, and analytics once you are verified.</p>
            </li>
          </ul>
          <p className="text-xs text-blue-100/70">Secure • Audited • Role aware</p>
        </div>

        <div className="p-8 sm:p-10">
          <div className="space-y-2 mb-8">
            <p className="text-sm font-semibold text-blue-600">Get started</p>
            <h2 className="text-3xl font-bold text-slate-900">Join WatchOut</h2>
            <p className="text-sm text-slate-500">Choose your role and share the requested details.</p>
          </div>

          <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-full">
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

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-sm font-semibold text-slate-700">Full name</label>
              <input
                type="text"
                className="mt-1 w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Jane Doe"
                {...register('displayName')}
              />
              {errors.displayName && <p className="text-sm text-red-500 mt-1">{errors.displayName.message}</p>}
            </div>

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

            <div className="grid sm:grid-cols-2 gap-4">
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
              <div>
                <label className="text-sm font-semibold text-slate-700">Confirm password</label>
                <input
                  type="password"
                  className="mt-1 w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {role === 'company' && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Company name</label>
                    <input
                      type="text"
                      className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ACME Industries"
                      {...register('companyName')}
                    />
                    {errors.companyName && <p className="text-sm text-red-500 mt-1">{errors.companyName.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Registration number</label>
                    <input
                      type="text"
                      className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="REG-123456"
                      {...register('registrationNumber')}
                    />
                    {errors.registrationNumber && <p className="text-sm text-red-500 mt-1">{errors.registrationNumber.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Company address</label>
                  <textarea
                    rows="3"
                    className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full registered address"
                    {...register('address')}
                  />
                  {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Supporting documents (PDF/Images)</label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentChange}
                    className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                  />
                  {errors.documents && <p className="text-sm text-red-500 mt-1">{errors.documents.message}</p>}
                </div>
              </>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold shadow-lg hover:bg-slate-800 transition disabled:opacity-60"
              >
                {isSubmitting ? 'Creating account...' : role === 'user' ? 'Create public account' : 'Submit company for approval'}
              </button>
              <button
                type="button"
                onClick={onGoogleSignup}
                className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {role === 'company' ? 'Google signup for companies' : 'Sign up with Google'}
              </button>
              <p className="text-center text-sm text-slate-500">
                Already registered?{' '}
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                  Back to Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
