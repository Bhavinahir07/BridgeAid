import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNgoCampaigns, getCampaignParticipants, getNgoProfile, updateParticipation } from '../../api/ngoApi';

export default function NGODashboard() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState([]);
  const [participantsByCampaign, setParticipantsByCampaign] = useState({});
  const [profile, setProfile] = useState(null);
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  const refreshCampaignData = async () => {
    const campaignsData = await getNgoCampaigns();
    setCampaigns(campaignsData || []);
    const participantEntries = await Promise.all(
      (campaignsData || []).map(async (campaign) => [campaign.id, await getCampaignParticipants(campaign.id)])
    );
    setParticipantsByCampaign(Object.fromEntries(participantEntries));
  };

  useEffect(() => {
    const loadData = async () => {
      setCampaignsLoading(true);
      try {
        const profileData = await getNgoProfile();
        setProfile(profileData);
        await refreshCampaignData();
      } finally {
        setCampaignsLoading(false);
      }
    };
    loadData();
  }, []);

  // Check if NGO profile is complete
  const isProfileComplete = profile?.is_complete;

  if (!isProfileComplete) {
    return (
      <div className="w-full min-h-screen bg-white font-inter text-[#1C2B33] flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Complete Your NGO Profile</h1>
          <p className="text-[#1C2B33]/60 mb-6">Please fill in your organization details to access the dashboard.</p>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 bg-[#0F4C5C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0a3642] transition-colors"
          >
            Go to Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    // 1. Seamless white background, taking up full height and width
    <div className="w-full min-h-screen bg-white font-inter text-[#1C2B33]">

      {/* 2. Main content container: Left-aligned with standard dashboard padding */}
      <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">

        {/* NEW: Page Header to make it look like a real SaaS application */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-grotesk text-[#1C2B33]">
            Hello, {profile?.name || 'NGO Team'}
          </h1>
          <p className="text-[#1C2B33]/60 text-sm mt-1">Manage your campaigns and track progress.</p>
        </div>

        {/* Section A: Summary Stats */}
        <div className="mb-10">
          <h3 className="text-[10px] font-bold text-[#1C2B33]/50 uppercase tracking-wider mb-3">Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-[#F7F9FA] border border-[#e0eef2] rounded-xl p-4">
              <p className="text-xs text-[#1C2B33]/60 font-medium mb-1">Total campaigns</p>
              <p className="text-2xl font-bold font-grotesk text-[#1C2B33]">
                {campaigns?.length || 0}
              </p>
            </div>
            <div className="bg-[#FFF0D6]/30 border border-[#E8A020]/20 rounded-xl p-4">
              <p className="text-xs text-[#1C2B33]/60 font-medium mb-1">Pending requests</p>
              <p className="text-2xl font-bold font-grotesk text-[#8a4f00]">
                {campaigns?.reduce((sum, c) => sum + (c.pending_count || 0), 0) || 0}
              </p>
            </div>
            <div className="bg-[#E0EFF2]/50 border border-[#0F4C5C]/20 rounded-xl p-4">
              <p className="text-xs text-[#1C2B33]/60 font-medium mb-1">Accepted volunteers</p>
              <p className="text-2xl font-bold font-grotesk text-[#0F4C5C]">
                {campaigns?.reduce((sum, c) => sum + (c.accepted_count || 0), 0) || 0}
              </p>
            </div>
            <div className="bg-[#D1FAE5]/30 border border-[#34d399]/20 rounded-xl p-4">
              <p className="text-xs text-[#1C2B33]/60 font-medium mb-1">Completed volunteers</p>
              <p className="text-2xl font-bold font-grotesk text-[#0f766e]">
                {campaigns?.reduce((sum, c) => sum + (c.completed_count || 0), 0) || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Section B: Tabs */}
        <div className="flex gap-6 border-b border-[#e0eef2] mb-6 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'campaigns' ? 'border-[#0F4C5C] text-[#0F4C5C]' : 'border-transparent text-[#1C2B33]/50 hover:text-[#1C2B33]'
              }`}
          >
            My campaigns
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'browse' ? 'border-[#0F4C5C] text-[#0F4C5C]' : 'border-transparent text-[#1C2B33]/50 hover:text-[#1C2B33]'
              }`}
          >
            Browse campaigns
          </button>
        </div>

        {/* ==========================================
            TAB 1: MY CAMPAIGNS
            ========================================== */}
        {activeTab === 'campaigns' && (
          <>
            {/* Section C: Campaign List (Header & Button) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <h3 className="text-lg font-bold font-grotesk text-[#1C2B33]">My Campaigns</h3>
              <Link
                to="/add-problem"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F4C5C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0a3642] transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Create Campaign
              </Link>
            </div>

            {/* Campaign Cards Container */}
            <div className="space-y-4">
              {campaignsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F4C5C]"></div>
                </div>
              ) : campaigns && campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-white border border-[#e0eef2] rounded-xl p-4 sm:p-5 hover:border-[#0F4C5C]/30 hover:shadow-md transition-all shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-2">
                      <div>
                        <h4 className="font-semibold text-[#1C2B33] text-base sm:text-lg">{campaign.title}</h4>
                        <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-[#1C2B33]/60 mt-1">
                          <span>{campaign.total_participants || 0} participants</span>
                          <span>•</span>
                          <span>{campaign.pending_count || 0} pending</span>
                          <span>•</span>
                          <span>{campaign.accepted_count || 0} accepted</span>
                          <span>•</span>
                          <span>{campaign.completed_count || 0} completed</span>
                          <span>•</span>
                          <span className={`inline-flex items-center gap-1.5 font-medium capitalize ${
                            campaign.urgency === 'high' ? 'text-[#e11d48]' :
                            campaign.urgency === 'medium' ? 'text-[#E8A020]' :
                            'text-[#1AC99B]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              campaign.urgency === 'high' ? 'bg-[#e11d48]' :
                              campaign.urgency === 'medium' ? 'bg-[#E8A020]' :
                              'bg-[#1AC99B]'
                            }`}></span>
                            {campaign.urgency}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-[#1C2B33]/70 mb-3">{campaign.description}</p>
                    <p className="text-xs text-[#1C2B33]/50 mb-3">🧰 {campaign.required_skills || 'N/A'} • 📅 {campaign.date}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="border border-[#e0eef2] rounded-lg p-3 bg-[#FFFDF8]">
                        <p className="text-xs font-semibold text-[#8a4f00] mb-2">Pending Volunteers</p>
                        {(participantsByCampaign[campaign.id] || []).filter((p) => ['waiting', 'pending'].includes(p.status)).length > 0 ? (
                          (participantsByCampaign[campaign.id] || []).filter((p) => ['waiting', 'pending'].includes(p.status)).map((participant) => (
                            <div key={participant.participation_id} className="flex items-center justify-between gap-2 mb-2">
                              <div>
                                <p className="text-xs font-semibold text-[#1C2B33]">{participant.volunteer_name}</p>
                                <p className="text-[10px] text-[#1C2B33]/60">{participant.skills || 'N/A'}</p>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={async () => { await updateParticipation({ participation_id: participant.participation_id, status: 'accepted' }); await refreshCampaignData(); }}
                                  className="px-2 py-1 text-[10px] rounded bg-[#0F4C5C] text-white"
                                >
                                  ✔ Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => { await updateParticipation({ participation_id: participant.participation_id, status: 'rejected' }); await refreshCampaignData(); }}
                                  className="px-2 py-1 text-[10px] rounded bg-[#FEE2E2] text-[#991B1B]"
                                >
                                  ❌ Reject
                                </button>
                              </div>
                            </div>
                          ))
                        ) : <p className="text-[10px] text-[#1C2B33]/60">No pending volunteers</p>}
                      </div>
                      <div className="border border-[#e0eef2] rounded-lg p-3 bg-[#F8FFFB]">
                        <p className="text-xs font-semibold text-[#0a5c3e] mb-2">Accepted Volunteers</p>
                        {(participantsByCampaign[campaign.id] || []).filter((p) => p.status === 'accepted').length > 0 ? (
                          (participantsByCampaign[campaign.id] || []).filter((p) => p.status === 'accepted').map((participant) => (
                            <div key={participant.participation_id} className="mb-2 flex items-center justify-between gap-2">
                              <div>
                                <p className="text-xs font-semibold text-[#1C2B33]">{participant.volunteer_name}</p>
                                <p className="text-[10px] text-[#1C2B33]/60">{participant.skills || 'N/A'}</p>
                              </div>
                              <button
                                type="button"
                                onClick={async () => { await updateParticipation({ participation_id: participant.participation_id, action: 'complete' }); await refreshCampaignData(); }}
                                className="px-2 py-1 text-[10px] rounded bg-[#10B981] text-white hover:bg-[#059669] transition-colors"
                              >
                                Mark Completed
                              </button>
                            </div>
                          ))
                        ) : <p className="text-[10px] text-[#1C2B33]/60">No accepted volunteers</p>}

                        {(participantsByCampaign[campaign.id] || []).filter((p) => p.status === 'completed').length > 0 && (
                          <div className="mt-3 pt-3 border-t border-[#e0eef2]">
                            <p className="text-xs font-semibold text-[#0f766e] mb-2">Completed Volunteers</p>
                            {(participantsByCampaign[campaign.id] || []).filter((p) => p.status === 'completed').map((participant) => (
                              <div key={participant.participation_id} className="mb-2">
                                <p className="text-xs font-semibold text-[#1C2B33]">{participant.volunteer_name}</p>
                                <p className="text-[10px] text-[#0a5c3e]">Completed ✅</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#1C2B33]/50">📍 {campaign.location}</span>
                      <div className="flex gap-2">
                        <Link
                          to={`/problem/${campaign.id}`}
                          className="px-3 py-1.5 bg-[#F7F9FA] text-[#1C2B33] text-xs font-semibold rounded-lg hover:bg-[#e0eef2] transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-[#1C2B33]/60 mb-4">No campaigns created yet.</p>
                  <Link
                    to="/add-problem"
                    className="inline-flex items-center gap-2 bg-[#0F4C5C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0a3642] transition-colors"
                  >
                    Create Your First Campaign
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {/* ==========================================
            TAB 2: BROWSE CAMPAIGNS
            ========================================== */}
        {activeTab === 'browse' && (
          <div className="text-center py-12">
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-2 bg-[#0F4C5C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0a3642] transition-colors"
            >
              Browse All Campaigns
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}