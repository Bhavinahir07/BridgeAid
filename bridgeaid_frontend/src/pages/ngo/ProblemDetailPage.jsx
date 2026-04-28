import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCampaignDetail, updateParticipation } from '../../api/ngoApi';

export default function ProblemDetailPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDetail = async () => {
    setIsLoading(true);
    try {
      const data = await getCampaignDetail(id);
      setProblem(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  if (isLoading || !problem) {
    return <div className="p-8 text-sm text-[#1C2B33]/60">Loading campaign details...</div>;
  }

  const waitingParticipants = [...(problem.participants?.waiting || []), ...(problem.participants?.pending || [])];
  const acceptedParticipants = problem.participants?.accepted || [];
  const completedParticipants = problem.participants?.completed || [];
  const rejectedParticipants = problem.participants?.rejected || [];
  const allParticipants = [...waitingParticipants, ...acceptedParticipants, ...completedParticipants, ...rejectedParticipants];

  const badgeStyles = (status) => {
    if (status === 'accepted') return 'bg-[#D6F7EE] text-[#0a5c3e] border-[#1AC99B]/20';
    if (status === 'completed') return 'bg-[#D1FAE5] text-[#0f766e] border-[#34d399]/20';
    if (status === 'rejected') return 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]/20';
    return 'bg-[#FFF0D6] text-[#8a4f00] border-[#E8A020]/20';
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F9FA] font-inter text-[#1C2B33] p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white border border-[#e0eef2] rounded-xl shadow-sm overflow-hidden">

        {/* Topbar (Matches Volunteer Layout exactly) */}
        <div className="bg-[#F7F9FA] border-b border-[#e0eef2] px-4 py-3 flex items-center gap-4">
          <Link
            to="/ngo-dashboard"
            className="text-xs font-semibold text-[#1C2B33]/70 border border-[#e0eef2] bg-white px-3 py-1.5 rounded-lg hover:bg-[#e0eef2]/50 transition-colors flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back
          </Link>
          <span className="text-sm font-semibold text-[#1C2B33]">Problem detail</span>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8">

          {/* Header & Badges */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold font-grotesk text-[#1C2B33] mb-4">{problem.title}</h1>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#ffe4e6] text-[#be123c] text-xs font-bold px-2.5 py-1.5 rounded-md border border-[#e11d48]/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]"></span> {problem.urgency} urgency
              </span>
              <span className="bg-[#F7F9FA] text-[#1C2B33]/70 text-xs font-bold px-2.5 py-1.5 rounded-md border border-[#e0eef2]">
                {problem.required_skills || 'General'}
              </span>
              <span className="bg-[#E0EFF2] text-[#0F4C5C] text-xs font-bold px-2.5 py-1.5 rounded-md border border-[#0F4C5C]/10">Active</span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-[#F7F9FA] rounded-xl p-3 sm:p-4 border border-[#e0eef2]/50">
              <p className="text-[11px] text-[#1C2B33]/60 font-medium mb-1 uppercase tracking-wider">Location</p>
              <p className="text-sm font-semibold text-[#1C2B33]">{problem.location}</p>
            </div>
            <div className="bg-[#F7F9FA] rounded-xl p-3 sm:p-4 border border-[#e0eef2]/50">
              <p className="text-[11px] text-[#1C2B33]/60 font-medium mb-1 uppercase tracking-wider">Date</p>
              <p className="text-sm font-semibold text-[#1C2B33]">{problem.date}</p>
            </div>
            <div className="bg-[#F7F9FA] rounded-xl p-3 sm:p-4 border border-[#e0eef2]/50 col-span-2 sm:col-span-1">
              <p className="text-[11px] text-[#1C2B33]/60 font-medium mb-1 uppercase tracking-wider">Participants</p>
              <p className="text-sm font-semibold text-[#1C2B33]">{waitingParticipants.length + acceptedParticipants.length + rejectedParticipants.length}</p>
            </div>
          </div>

          {/* Full Description */}
          <div className="bg-white border border-[#e0eef2] rounded-xl p-5 mb-8">
            <h3 className="text-[11px] text-[#1C2B33]/60 font-bold uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-[#1C2B33] leading-relaxed">
              {problem.description}
            </p>
          </div>

          <hr className="border-[#e0eef2] mb-8" />

          {/* Assigned Volunteers Section (NGO Specific Content) */}
          <div>
            <h3 className="text-[11px] font-bold text-[#1C2B33]/50 uppercase tracking-wider mb-3">Assigned volunteers</h3>
            
            <div className="bg-white border border-[#0F4C5C]/20 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-[#0F4C5C]/5 px-5 py-3 border-b border-[#0F4C5C]/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0F4C5C]">NGO view — read only, no manual controls</span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-[#3d2a9e] bg-[#EDE8FD] px-2 py-0.5 rounded-full border border-[#6C4BE8]/20">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  AI Auto-Assigned
                </span>
              </div>

              <div className="divide-y divide-[#e0eef2]">
                {allParticipants.map((vol) => (
                  <div key={vol.participation_id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#F7F9FA]/50 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        vol.status === 'accepted'
                          ? 'bg-[#1AC99B]/15 text-[#0a5c3e]' :
                        vol.status === 'completed'
                          ? 'bg-[#D1FAE5] text-[#0f766e]' :
                        vol.status === 'rejected'
                          ? 'bg-[#FEE2E2] text-[#991B1B]' :
                          'bg-[#E8A020]/15 text-[#8a4f00]'
                      }`}>
                        {vol.volunteer_name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1C2B33]">{vol.volunteer_name}</p>
                        <p className="text-xs text-[#1C2B33]/60 mt-0.5">Skill: {vol.skills || 'N/A'} &nbsp;·&nbsp; {vol.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md border shrink-0 capitalize ${badgeStyles(vol.status)}`}>
                        {vol.status === 'completed' ? 'completed' : vol.status}
                      </span>
                      {['waiting', 'pending'].includes(vol.status) ? (
                        <>
                          <button className="px-2 py-1 text-[10px] rounded bg-[#0F4C5C] text-white" onClick={async () => { await updateParticipation({ participation_id: vol.participation_id, status: 'accepted' }); await loadDetail(); }}>✔</button>
                          <button className="px-2 py-1 text-[10px] rounded bg-[#FEE2E2] text-[#991B1B]" onClick={async () => { await updateParticipation({ participation_id: vol.participation_id, status: 'rejected' }); await loadDetail(); }}>❌</button>
                        </>
                      ) : vol.status === 'accepted' ? (
                        <button className="px-2 py-1 text-[10px] rounded bg-[#10B981] text-white" onClick={async () => { await updateParticipation({ participation_id: vol.participation_id, action: 'complete' }); await loadDetail(); }}>✔ Completed</button>
                      ) : vol.status === 'completed' ? (
                        <span className="px-2 py-1 text-[10px] rounded bg-[#D1FAE5] text-[#0f766e]">Completed ✅</span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}