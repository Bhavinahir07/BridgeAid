import React, { useState } from 'react';

export default function VolunteerSettings() {
  // Manage toggle states dynamically
  const [toggles, setToggles] = useState({
    newMatch: true,
    assigned: true,
    summary: false
  });

  const handleToggle = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="w-full min-h-screen bg-white font-inter text-[#1C2B33]">
      <div className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-grotesk text-[#1C2B33]">Settings</h1>
          <p className="text-[#1C2B33]/60 text-sm mt-1">Manage your notifications and account.</p>
        </div>

        {/* Notifications Card */}
        <div className="bg-white border border-[#e0eef2] rounded-xl p-5 sm:p-6 shadow-sm mb-6">
          <h3 className="text-xs font-bold text-[#1C2B33]/50 uppercase tracking-wider mb-5">Notifications</h3>
          
          <div className="divide-y divide-[#e0eef2]">
            {/* Toggle 1 */}
            <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="pr-4">
                <p className="text-sm font-semibold text-[#1C2B33]">New recommended problem</p>
                <p className="text-xs text-[#1C2B33]/60 mt-0.5">When a new problem matches your skills</p>
              </div>
              <button onClick={() => handleToggle('newMatch')} className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none shrink-0 ${toggles.newMatch ? 'bg-[#0F4C5C]' : 'bg-gray-200'}`}>
                <span className={`block w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${toggles.newMatch ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            
            {/* Toggle 2 */}
            <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="pr-4">
                <p className="text-sm font-semibold text-[#1C2B33]">Task assigned to you</p>
                <p className="text-xs text-[#1C2B33]/60 mt-0.5">When an NGO problem auto-matches you</p>
              </div>
              <button onClick={() => handleToggle('assigned')} className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none shrink-0 ${toggles.assigned ? 'bg-[#0F4C5C]' : 'bg-gray-200'}`}>
                <span className={`block w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${toggles.assigned ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="pr-4">
                <p className="text-sm font-semibold text-[#1C2B33]">Weekly activity summary</p>
                <p className="text-xs text-[#1C2B33]/60 mt-0.5">Overview of your contributions</p>
              </div>
              <button onClick={() => handleToggle('summary')} className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none shrink-0 ${toggles.summary ? 'bg-[#0F4C5C]' : 'bg-gray-200'}`}>
                <span className={`block w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${toggles.summary ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-[#fff1f2] border border-[#fda4af] rounded-xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-xs font-bold text-[#be123c] uppercase tracking-wider mb-2">Danger zone</h3>
          <p className="text-sm text-[#be123c]/80 mb-4 leading-relaxed">Permanently delete your volunteer account and all task history.</p>
          <button className="px-4 py-2 rounded-lg border border-[#e11d48] text-[#be123c] bg-white hover:bg-[#ffe4e6] text-xs font-semibold transition-colors shadow-sm">
            Delete account
          </button>
        </div>

      </div>
    </div>
  );
}