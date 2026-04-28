import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { createCampaign, getNgoProfile } from '../../api/ngoApi';

// 1. Define the validation schema for campaigns
const campaignSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(15, { message: 'Please provide a bit more detail (min 15 chars)' }),
  location: z.string().min(2, { message: 'Location is required' }),
  date: z.string().min(1, { message: 'Campaign date is required' }),
  required_skills: z.string().min(3, { message: 'Required skills are required' }),
  urgency: z.enum(['low', 'medium', 'high']),
});

export default function AddProblemPage() {
  const navigate = useNavigate();

  // 3. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      urgency: 'medium',
    },
  });

  // 4. TanStack Query Mutation
  const mutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      // Navigate back to dashboard after successful creation
      navigate('/ngo-dashboard');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  React.useEffect(() => {
    const checkNgoProfile = async () => {
      const profile = await getNgoProfile();
      if (!profile?.is_complete) {
        navigate('/profile');
      }
    };
    checkNgoProfile();
  }, [navigate]);

  return (
    <div className="w-full min-h-screen bg-white font-inter text-[#1C2B33]">
      <div className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto">
        
        {/* Header & Back Navigation */}
        <div className="mb-8">
          <Link 
            to="/ngo-dashboard" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C2B33]/60 hover:text-[#0F4C5C] transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-grotesk text-[#1C2B33]">Create a Campaign</h1>
          <p className="text-[#1C2B33]/60 text-sm mt-1">Provide details for your fundraising campaign to help those in need.</p>
        </div>

        {/* Smart AI matching hint (Using Smart Purple) */}
        <div className="flex items-start gap-3 bg-[#EDE8FD] border border-[#6C4BE8]/30 p-4 rounded-xl mb-8">
          <svg className="w-5 h-5 text-[#3d2a9e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <div>
            <p className="text-sm text-[#3d2a9e] leading-relaxed">
              <span className="font-bold">How matching works:</span> Enter campaign details and set a date. Volunteers are automatically matched based on location and skills.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#1C2B33] mb-1.5">
                Campaign title <span className="text-[#e11d48]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Flood relief for coastal villages"
                {...register('title')}
                className={`w-full px-4 py-2.5 rounded-lg border-[0.5px] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.title ? 'border-[#E8A020] focus:ring-[#E8A020]/20' : 'border-[#e0eef2] focus:border-[#0F4C5C] focus:ring-[#0F4C5C]/20'
                }`}
              />
              <p className="mt-1.5 text-[11px] text-[#1C2B33]/50 font-medium">Short, clear title for your campaign</p>
              {errors.title && <p className="mt-1 text-xs font-medium text-[#E8A020]">{errors.title.message}</p>}
            </div>

            {/* Description - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#1C2B33] mb-1.5">
                Description <span className="text-[#e11d48]">*</span>
              </label>
              <textarea
                rows="4"
                placeholder="Explain the campaign goals, what's needed, who's affected, any special requirements..."
                {...register('description')}
                className={`w-full px-4 py-3 rounded-lg border-[0.5px] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:ring-2 transition-all resize-y ${
                  errors.description ? 'border-[#E8A020] focus:ring-[#E8A020]/20' : 'border-[#e0eef2] focus:border-[#0F4C5C] focus:ring-[#0F4C5C]/20'
                }`}
              />
              {errors.description && <p className="mt-1 text-xs font-medium text-[#E8A020]">{errors.description.message}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-[#1C2B33] mb-1.5">
                Location <span className="text-[#e11d48]">*</span>
              </label>
              <input
                type="text"
                placeholder="City / Area / Region"
                {...register('location')}
                className={`w-full px-4 py-2.5 rounded-lg border-[0.5px] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.location ? 'border-[#E8A020] focus:ring-[#E8A020]/20' : 'border-[#e0eef2] focus:border-[#0F4C5C] focus:ring-[#0F4C5C]/20'
                }`}
              />
              {errors.location && <p className="mt-1 text-xs font-medium text-[#E8A020]">{errors.location.message}</p>}
            </div>

            {/* Required Skills */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#1C2B33] mb-1.5">
                Required skills <span className="text-[#e11d48]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. first aid, logistics, teaching"
                {...register('required_skills')}
                className={`w-full px-4 py-2.5 rounded-lg border-[0.5px] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.required_skills ? 'border-[#E8A020] focus:ring-[#E8A020]/20' : 'border-[#e0eef2] focus:border-[#0F4C5C] focus:ring-[#0F4C5C]/20'
                }`}
              />
              <p className="mt-1.5 text-[11px] text-[#1C2B33]/50 font-medium">Comma-separated skills for volunteer matching</p>
              {errors.required_skills && <p className="mt-1 text-xs font-medium text-[#E8A020]">{errors.required_skills.message}</p>}
            </div>

            {/* Campaign Date */}
            <div>
              <label className="block text-sm font-semibold text-[#1C2B33] mb-1.5">
                Campaign Date <span className="text-[#e11d48]">*</span>
              </label>
              <input
                type="date"
                {...register('date')}
                className={`w-full px-4 py-2.5 rounded-lg border-[0.5px] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.date ? 'border-[#E8A020] focus:ring-[#E8A020]/20' : 'border-[#e0eef2] focus:border-[#0F4C5C] focus:ring-[#0F4C5C]/20'
                }`}
              />
              {errors.date && <p className="mt-1 text-xs font-medium text-[#E8A020]">{errors.date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1C2B33] mb-1.5">
                Urgency <span className="text-[#e11d48]">*</span>
              </label>
              <select
                {...register('urgency')}
                className="w-full px-4 py-2.5 rounded-lg border-[0.5px] bg-[#F7F9FA] border-[#e0eef2] text-[#1C2B33] text-sm focus:outline-none focus:ring-2 focus:border-[#0F4C5C] focus:ring-[#0F4C5C]/20"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.urgency && <p className="mt-1 text-xs font-medium text-[#E8A020]">{errors.urgency.message}</p>}
            </div>

          </div>

          <hr className="border-[#e0eef2] my-8" />

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              to="/ngo-dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#e0eef2] text-[#1C2B33]/70 text-sm font-semibold hover:bg-[#F7F9FA] hover:text-[#1C2B33] transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:flex-1 flex justify-center items-center gap-2 px-6 py-3 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold hover:bg-[#0a3642] focus:ring-4 focus:ring-[#0F4C5C]/20 transition-all disabled:opacity-70 shadow-sm"
            >
              {mutation.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Match...
                </>
              ) : (
                'Post problem & auto-match volunteers ↗'
              )}
            </button>
          </div>
          <p className="text-center text-[11px] text-[#1C2B33]/50 font-medium">
            Volunteers are assigned automatically — no further action needed from you.
          </p>

        </form>
      </div>
    </div>
  );
}