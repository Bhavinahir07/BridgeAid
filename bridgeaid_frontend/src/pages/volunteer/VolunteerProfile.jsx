import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../../api/api';

export default function VolunteerProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    location: '',
    skills: '',
    availability: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile({
          name: data?.name || '',
          location: data?.location || '',
          skills: data?.skills || '',
          availability: data?.availability || '',
        });
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const onChange = (field) => (event) => {
    setProfile((current) => ({ ...current, [field]: event.target.value }));
  };

  const onSubmit = async () => {
    setError('');
    setIsSaving(true);
    try {
      await updateProfile({
        skills: profile.skills,
        location: profile.location,
        availability: profile.availability,
      });
      navigate('/volunteer-dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white font-inter text-[#1C2B33]">
        <div className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto w-full">
          <div className="bg-white border border-[#e0eef2] rounded-xl p-5 sm:p-6 shadow-sm">
            <p className="text-sm text-[#1C2B33]/70">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white font-inter text-[#1C2B33]">
      <div className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-grotesk text-[#1C2B33]">My profile</h1>
          <p className="text-[#1C2B33]/60 text-sm mt-1">Update your skills and availability to get better matches.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-[#e0eef2] rounded-xl p-5 sm:p-6 shadow-sm mb-4">
          
          {/* Identity */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#1AC99B]/15 text-[#0a5c3e] flex items-center justify-center text-lg font-bold shrink-0">
              {(profile.name || 'V').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1C2B33]">{profile.name || 'Volunteer'}</h2>
              <p className="text-xs text-[#1C2B33]/60 mt-0.5">Volunteer &nbsp;·&nbsp; {profile.location || 'Location pending'}</p>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-[#1C2B33]/60 mb-1.5">Full name</label>
              <input type="text" value={profile.name} disabled className="w-full px-3 py-2 rounded-lg border-[0.5px] border-[#e0eef2] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:border-[#0F4C5C] focus:ring-1 focus:ring-[#0F4C5C]/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C2B33]/60 mb-1.5">Location</label>
              <input type="text" value={profile.location} onChange={onChange('location')} className="w-full px-3 py-2 rounded-lg border-[0.5px] border-[#e0eef2] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:border-[#0F4C5C] focus:ring-1 focus:ring-[#0F4C5C]/20" />
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-[#1C2B33]/60 mb-2">Skills (affects matching)</label>
            <input type="text" value={profile.skills} onChange={onChange('skills')} placeholder="e.g. cooking, teaching" className="w-full px-3 py-2 rounded-lg border-[0.5px] border-[#e0eef2] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:border-[#0F4C5C] focus:ring-1 focus:ring-[#0F4C5C]/20" />
          </div>

          {/* Availability */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-[#1C2B33]/60 mb-2">Availability</label>
            <input type="text" value={profile.availability} onChange={onChange('availability')} placeholder="e.g. weekday evenings, weekends" className="w-full px-3 py-2 rounded-lg border-[0.5px] border-[#e0eef2] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:border-[#0F4C5C] focus:ring-1 focus:ring-[#0F4C5C]/20" />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e0eef2]">
            <button onClick={() => navigate('/volunteer-dashboard')} className="px-4 py-2 rounded-lg border border-[#e0eef2] text-[#1C2B33]/70 text-xs font-semibold hover:bg-[#F7F9FA] transition-colors">Cancel</button>
            <button onClick={onSubmit} disabled={isSaving} className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold hover:bg-[#0a3642] transition-colors disabled:opacity-70">{isSaving ? 'Saving...' : 'Save profile'}</button>
          </div>
          {error ? <p className="text-xs text-[#991B1B] mt-3">{error}</p> : null}
        </div>

        <p className="text-[11px] text-[#1C2B33]/50 italic text-center sm:text-left">
          Changing skills or availability immediately affects which problems appear in your Recommended tab.
        </p>

      </div>
    </div>
  );
}