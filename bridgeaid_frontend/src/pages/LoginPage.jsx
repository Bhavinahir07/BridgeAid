import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

// Zod validation schema
const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({
    message: 'Must be a valid email',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
});

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: authAPI.loginUser,
    onSuccess: (profile) => {
      if (profile.role === 'volunteer') {
        navigate('/volunteer-dashboard');
      } else if (profile.role === 'ngo') {
        navigate('/ngo-dashboard');
      }
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    // Off White Canvas Background
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9FA] px-4 sm:px-6 lg:px-8 font-inter">

      {/* Login Card */}
      <div className="max-w-md w-full bg-white rounded-[14px] p-8 border-[0.5px] border-[#e0eef2] shadow-sm">

        {/* Header Section */}
        <div className="text-center mb-8">
          {/* Brand Teal & Space Grotesk for the Logo */}
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="text-4xl font-bold text-[#0F4C5C] font-grotesk tracking-tight mb-2">
              BridgeAid
            </h1>
          </Link>
          {/* Charcoal Text for subtitles */}
          <p className="text-[#1C2B33] text-sm">
            Sign in to access your volunteer dashboard
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#1C2B33] mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              className={`w-full px-4 py-2.5 rounded-lg border-[0.5px] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:ring-2 transition-all ${errors.email
                ? 'border-[#E8A020] focus:ring-[#E8A020]/20' // Vivid Amber for validation attention
                : 'border-[#e0eef2] focus:border-[#0F4C5C] focus:ring-[#0F4C5C]/20'
                }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs font-medium text-[#E8A020]">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#1C2B33]"
              >
                Password
              </label>
              <Link
                to=""
                className="text-xs font-semibold text-[#0F4C5C] hover:text-[#0F4C5C]/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full px-4 py-2.5 rounded-lg border-[0.5px] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:ring-2 transition-all ${errors.password
                ? 'border-[#E8A020] focus:ring-[#E8A020]/20'
                : 'border-[#e0eef2] focus:border-[#0F4C5C] focus:ring-[#0F4C5C]/20'
                }`}
            />
            {errors.password && (
              <p className="mt-1.5 text-xs font-medium text-[#E8A020]">
                {errors.password.message}
              </p>
            )}
          </div>

          {mutation.isError && (
            <div className="p-3 bg-[#FFF0D6] rounded-lg border-[0.5px] border-[#E8A020]/30">
              <p className="text-xs font-semibold text-[#8a4f00] text-center">
                {mutation.error.message}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            // Deep Teal for the primary button
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#0F4C5C] hover:bg-[#0a3642] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F4C5C] transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {mutation.isPending ? (
              <span className="flex items-center gap-2">
                {/* Simple loading spinner matching the design */}
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Signup Redirect */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#1C2B33]">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-[#0F4C5C] hover:text-[#0F4C5C]/80 transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        {/* Smart Purple hook for AI features (Optional, purely aesthetic based on your guide) */}
        <div className="mt-8 pt-6 border-t-[0.5px] border-[#e0eef2]">
          <div className="flex items-start gap-3 bg-[#EDE8FD] p-3 rounded-[9px] border-l-4 border-[#6C4BE8]">
            <svg className="w-5 h-5 text-[#3d2a9e] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-xs text-[#3d2a9e] font-medium leading-relaxed">
              BridgAid uses AI to securely match volunteers with requests in real-time.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}