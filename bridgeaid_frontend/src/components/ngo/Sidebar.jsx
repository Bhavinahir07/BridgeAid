import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getNgoProfile } from '../../api/ngoApi';


export default function Sidebar() {
  // We use this to check which page is active so we can highlight the correct link
  const location = useLocation();
  const currentPath = location.pathname;
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getNgoProfile();
        setProfile(data);
      } catch {
        setProfile(null);
      }
    };
    loadProfile();
  }, []);

  const displayName = profile?.organization_name || profile?.name || 'NGO';
  const displayLocation = profile?.address || 'Address pending';
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    // Fixed width, full height, border on the right
    <div className="w-64 min-h-screen bg-white border-r border-[#e0eef2] flex flex-col font-inter">
      
      {/* Brand Logo Section */}
      <div className="p-6 border-b border-[#e0eef2]">
        <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-bold text-[#0F4C5C] font-grotesk tracking-tight">
            BridgeAid
          </h1>
        </Link>
      </div>

      {/* NGO Identity Block (Moved here from the dashboard topbar) */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-[#0F4C5C]/10 flex items-center justify-center text-[#0F4C5C] font-bold text-sm shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1C2B33] font-grotesk leading-tight">{displayName}</h2>
            <p className="text-xs text-[#1C2B33]/60">{displayLocation}</p>
          </div>
        </div>
        
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 mt-2">
        
        <Link
          to="/ngo-dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            currentPath === '/ngo-dashboard'
              ? 'bg-[#0F4C5C]/10 text-[#0F4C5C]' // Active state
              : 'text-[#1C2B33]/70 hover:bg-[#F7F9FA] hover:text-[#1C2B33]' // Inactive state
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
          </svg>
          Dashboard
        </Link>

        {/* Primary CTA styled as a button using Vivid Amber */}
        <div className="pt-2 pb-1">
          <Link
            to="/add-problem"
            className="flex items-center justify-center gap-2 w-full bg-[#E8A020] text-[#3a2000] px-4 py-2.5 rounded-lg text-sm font-bold hover:brightness-105 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create Campaign
          </Link>
        </div>

        <Link
          to="/profile"
          className={`flex items-center gap-3 px-3 py-5 rounded-lg text-sm font-semibold transition-colors ${
            currentPath === '/profile'
              ? 'bg-[#0F4C5C]/10 text-[#0F4C5C]'
              : 'text-[#1C2B33]/70 hover:bg-[#F7F9FA] hover:text-[#1C2B33]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Profile / Settings
        </Link>
      </nav>

      {/* Bottom Section (Logout) */}
      <div className="p-4 border-t border-[#e0eef2]">
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1C2B33]/50 hover:bg-[#F7F9FA] hover:text-[#e11d48] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Log out
        </button>
      </div>

    </div>
  );
}