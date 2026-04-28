import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

// Zod validation schema with password confirmation
const signupSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().min(1, { message: 'Email is required' }).email({
        message: 'Must be a valid email',
    }),
    password: z.string().min(6, {
        message: 'Password must be at least 6 characters',
    }),
    confirmPassword: z.string(),
    role: z.enum(['volunteer', 'ngo']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
});

export default function SignupPage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: 'volunteer', // Default selection
        }
    });

    const selectedRole = watch('role');

    const mutation = useMutation({
        mutationFn: authAPI.signupUser,
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
        // Off White Canvas Background & Inter Font
        <div className="min-h-screen flex items-center justify-center bg-[#F7F9FA] px-4 sm:px-6 lg:px-8 font-inter py-12">

            <div className="max-w-md w-full bg-white rounded-[14px] p-8 border-[0.5px] border-[#e0eef2] shadow-sm">

                {/* Header Section */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                        <h1 className="text-4xl font-bold text-[#0F4C5C] font-grotesk tracking-tight mb-2">
                            BridgeAid
                        </h1>
                    </Link>
                    <p className="text-[#1C2B33] text-sm">
                        Create an account to start making an impact
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Custom Role Selector */}
                    <div className="flex gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => setValue('role', 'volunteer')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg border transition-all ${selectedRole === 'volunteer'
                                    ? 'bg-[#0F4C5C]/10 border-[#0F4C5C] text-[#0F4C5C]'
                                    : 'bg-white border-[#e0eef2] text-[#1C2B33]/60 hover:bg-[#F7F9FA]'
                                }`}
                        >
                            Volunteer
                        </button>
                        <button
                            type="button"
                            onClick={() => setValue('role', 'ngo')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg border transition-all ${selectedRole === 'ngo'
                                    ? 'bg-[#0F4C5C]/10 border-[#0F4C5C] text-[#0F4C5C]'
                                    : 'bg-white border-[#e0eef2] text-[#1C2B33]/60 hover:bg-[#F7F9FA]'
                                }`}
                        >
                            NGO
                        </button>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-[#1C2B33] mb-1.5">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            {...register('name')}
                            className={`w-full px-4 py-2.5 rounded-lg border-[0.5px] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-[#E8A020] focus:ring-[#E8A020]/20' : 'border-[#e0eef2] focus:border-[#0F4C5C] focus:ring-[#0F4C5C]/20'
                                }`}
                        />
                        {errors.name && <p className="mt-1.5 text-xs font-medium text-[#E8A020]">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-[#1C2B33] mb-1.5">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            {...register('email')}
                            className={`w-full px-4 py-2.5 rounded-lg border-[0.5px] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-[#E8A020] focus:ring-[#E8A020]/20' : 'border-[#e0eef2] focus:border-[#0F4C5C] focus:ring-[#0F4C5C]/20'
                                }`}
                        />
                        {errors.email && <p className="mt-1.5 text-xs font-medium text-[#E8A020]">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-[#1C2B33] mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                            className={`w-full px-4 py-2.5 rounded-lg border-[0.5px] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-[#E8A020] focus:ring-[#E8A020]/20' : 'border-[#e0eef2] focus:border-[#0F4C5C] focus:ring-[#0F4C5C]/20'
                                }`}
                        />
                        {errors.password && <p className="mt-1.5 text-xs font-medium text-[#E8A020]">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#1C2B33] mb-1.5">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                            className={`w-full px-4 py-2.5 rounded-lg border-[0.5px] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword ? 'border-[#E8A020] focus:ring-[#E8A020]/20' : 'border-[#e0eef2] focus:border-[#0F4C5C] focus:ring-[#0F4C5C]/20'
                                }`}
                        />
                        {errors.confirmPassword && <p className="mt-1.5 text-xs font-medium text-[#E8A020]">{errors.confirmPassword.message}</p>}
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
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#0F4C5C] hover:bg-[#0a3642] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F4C5C] transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                    >
                        {mutation.isPending ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>


                <div className="mt-6 text-center">
                    <p className="text-sm text-[#1C2B33]">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-[#0F4C5C] hover:text-[#0F4C5C]/80 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}