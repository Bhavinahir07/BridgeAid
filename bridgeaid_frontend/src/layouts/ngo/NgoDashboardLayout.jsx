import React, { useState } from 'react';
import Sidebar from '../../components/ngo/Sidebar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  // This state tracks whether the sidebar is open on mobile phones
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F7F9FA] font-inter overflow-hidden relative">
      
      {/* 1. MOBILE OVERLAY:
        A darkened background that appears when the sidebar is open on phones.
        Clicking it closes the sidebar. Hidden entirely on medium screens and up.
      */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#1C2B33]/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. THE SIDEBAR:
        - Mobile: Fixed position, sliding in/out from the left based on state.
        - Desktop (md:): Relative position, always visible, static layout.
      */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* We pass a prop so the Sidebar can close itself when a link is clicked */}
        <div className="h-full" onClick={() => setIsMobileMenuOpen(false)}>
          <Sidebar />
        </div>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      {/* min-w-0 prevents flexbox children from causing horizontal overflow */}
      <main className="flex-1 flex flex-col overflow-y-auto relative min-w-0">
        
        {/* MOBILE HEADER:
          Only shows on phones. Contains the Brand Name and the Hamburger toggle.
        */}
        <div className="md:hidden bg-white border-b border-[#e0eef2] px-5 py-4 flex items-center justify-between sticky top-0 z-30">
          <span className="font-bold text-[#0F4C5C] font-grotesk text-xl tracking-tight">BridgAid</span>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-[#1C2B33] p-1.5 -mr-1.5 hover:bg-[#F7F9FA] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20"
          >
            {/* Hamburger Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* This is where your NGODashboard renders */}
        <div className="w-full">
          <Outlet />
        </div>
        
      </main>
      
    </div>
  );
}