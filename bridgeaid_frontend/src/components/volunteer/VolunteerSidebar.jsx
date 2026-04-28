import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getProfile } from '../../api/api';

export default function VolunteerSidebar() {
    const location = useLocation();
    const [profile, setProfile] = useState(null);

    // Helper function to dynamically highlight the active tab
    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const loadProfile = async () => {
            try {
                const data = await getProfile();
                setProfile(data);
            } catch {
                setProfile(null);
            }
        };

        loadProfile();
    }, []);

    const initials = (profile?.name || 'V')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const skillTags = (profile?.skills || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);

    return (
        <div className="w-64 h-full bg-white border-r border-[#e0eef2] flex flex-col font-inter">

            {/* 1. Brand Logo Area */}
            <div className="p-6 border-b border-[#e0eef2] shrink-0">
                <h2 className="font-bold text-[#0F4C5C] font-grotesk text-2xl tracking-tight">BridgeAid</h2>
            </div>

            {/* 2. Volunteer Identity Area */}
            <div className="p-6 border-b border-[#e0eef2] shrink-0">
                <div className="flex items-center gap-3 mb-4">
                    {/* Avatar using the green theme to subtly distinguish Volunteers from NGOs */}
                    <div className="w-10 h-10 rounded-full bg-[#1AC99B]/15 text-[#0a5c3e] flex items-center justify-center text-sm font-bold shrink-0">
                        {initials}
                    </div>
                    <div>
                        <p className="font-semibold text-[#1C2B33] text-sm">{profile?.name || 'Volunteer'}</p>
                        <p className="text-[11px] text-[#1C2B33]/60 mt-0.5">Volunteer &nbsp;·&nbsp; {profile?.location || 'Location pending'}</p>
                    </div>
                </div>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-2">
                    {skillTags.length > 0 ? (
                        skillTags.map((skill) => (
                            <span key={skill} className="text-[10px] font-bold uppercase tracking-wider bg-[#F7F9FA] border border-[#e0eef2] text-[#1C2B33]/60 px-2 py-1 rounded-md">
                                {skill}
                            </span>
                        ))
                    ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F7F9FA] border border-[#e0eef2] text-[#1C2B33]/60 px-2 py-1 rounded-md">
                            Add skills
                        </span>
                    )}
                </div>
            </div>

            {/* 3. Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                <Link
                    to="/volunteer-dashboard"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${isActive('/volunteer-dashboard')
                        ? 'bg-[#0F4C5C]/5 text-[#0F4C5C] font-semibold'
                        : 'text-[#1C2B33]/70 font-medium hover:bg-[#F7F9FA] hover:text-[#1C2B33]'
                        }`}
                >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                        <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                        <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                        <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                    </svg>
                    Dashboard
                </Link>

                <Link
                    to="/volunteer-profile"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${isActive('/volunteer-profile')
                        ? 'bg-[#0F4C5C]/5 text-[#0F4C5C] font-semibold'
                        : 'text-[#1C2B33]/70 font-medium hover:bg-[#F7F9FA] hover:text-[#1C2B33]'
                        }`}
                >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    My profile
                </Link>

                <Link
                    to="/volunteer-settings"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${isActive('/volunteer-settings')
                        ? 'bg-[#0F4C5C]/5 text-[#0F4C5C] font-semibold'
                        : 'text-[#1C2B33]/70 font-medium hover:bg-[#F7F9FA] hover:text-[#1C2B33]'
                        }`}
                >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Settings
                </Link>
            </nav>
            {/* 4. Logout Section */}
            <div className="p-4 border-t border-[#e0eef2] shrink-0">
                <Link
                    to="/login"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#e11d48] hover:bg-[#ffe4e6] rounded-lg transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="shrink-0"><path d="M5 2H2.5A1 1 0 001.5 3v8a1 1 0 001 1H5M9.5 10l3-3-3-3M12.5 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Log out
                </Link>
            </div>

        </div>
    );
}