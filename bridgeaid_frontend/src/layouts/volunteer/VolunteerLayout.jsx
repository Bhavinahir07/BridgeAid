import React, { useEffect, useState } from 'react';
import VolunteerSidebar from '../../components/volunteer/VolunteerSidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getProfile } from '../../api/api';

export default function VolunteerLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const checkProfile = async () => {
      try {
        const profile = await getProfile();
        const incomplete = !profile?.skills?.trim() || !profile?.location?.trim();
        if (incomplete && location.pathname !== '/volunteer-profile') {
          navigate('/volunteer-profile', { replace: true });
        }
      } catch {
        // Let page-level handlers show errors where needed.
      }
    };

    checkProfile();
  }, [location.pathname, navigate]);

  return (
    <div className="flex h-screen bg-[#F7F9FA] font-inter overflow-hidden relative">
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#1C2B33]/50 z-40 md:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full" onClick={() => setIsMobileMenuOpen(false)}>
          <VolunteerSidebar />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto relative min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-[#e0eef2] px-5 py-4 flex items-center justify-between sticky top-0 z-30">
          <span className="font-bold text-[#0F4C5C] font-grotesk text-xl">BridgAid Vol</span>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-[#1C2B33] focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>

        {/* Outlet for Volunteer Pages */}
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}