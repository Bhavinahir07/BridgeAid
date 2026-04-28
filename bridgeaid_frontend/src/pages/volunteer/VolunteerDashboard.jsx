import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCampaigns, getMyCampaigns, getProfile, getRecommendedCampaigns } from '../../api/api';

const getMatchLabel = (score) => {
  if (score >= 7) return '🔥 Excellent Match';
  if (score >= 4) return '👍 Good Match';
  return '🙂 Basic Match';
};

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recommended');
  const [profile, setProfile] = useState(null);
  const [recommendedCampaigns, setRecommendedCampaigns] = useState([]);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [profileData, recommendedData, myData, allData] = await Promise.all([
          getProfile(),
          getRecommendedCampaigns(),
          getMyCampaigns(),
          getCampaigns(),
        ]);
        setProfile(profileData);
        setRecommendedCampaigns(recommendedData || []);
        setMyCampaigns(myData || []);
        setAllCampaigns(allData || []);

        const incomplete = !profileData?.skills?.trim() || !profileData?.location?.trim();
        if (incomplete) {
          navigate('/volunteer-profile', { replace: true });
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const sortedRecommended = [...recommendedCampaigns].sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

  // Calculate stats
  const recommendedCount = recommendedCampaigns?.length || 0;
  const acceptedCount = myCampaigns?.filter(c => c.status === 'accepted').length || 0;
  const completedCount = myCampaigns?.filter(c => c.status === 'completed').length || 0;

  return (
    <div className="w-full min-h-screen bg-white font-inter text-[#1C2B33]">
      <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-grotesk text-[#1C2B33]">
            Good morning, {profile?.name || 'Volunteer'}
          </h1>
          <p className="text-[#1C2B33]/60 text-sm mt-1">Skills: {profile?.skills || 'Not set'} &nbsp;•&nbsp; Location: {profile?.location || 'Not set'}</p>
        </div>
        {error ? <p className="text-sm text-[#991B1B] mb-4">{error}</p> : null}

        {/* Top Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-[#F7F9FA] border border-[#e0eef2] rounded-xl p-4 sm:p-5">
            <p className="text-[11px] sm:text-xs text-[#1C2B33]/60 font-medium mb-1">Recommended</p>
            <p className="text-2xl font-bold font-grotesk text-[#0a5c3e]">{recommendedCount}</p>
          </div>
          <div className="bg-[#F7F9FA] border border-[#e0eef2] rounded-xl p-4 sm:p-5">
            <p className="text-[11px] sm:text-xs text-[#1C2B33]/60 font-medium mb-1">Accepted tasks</p>
            <p className="text-2xl font-bold font-grotesk text-[#0F4C5C]">{acceptedCount}</p>
          </div>
          <div className="bg-[#F7F9FA] border border-[#e0eef2] rounded-xl p-4 sm:p-5 col-span-2 md:col-span-1">
            <p className="text-[11px] sm:text-xs text-[#1C2B33]/60 font-medium mb-1">Completed</p>
            <p className="text-2xl font-bold font-grotesk text-[#1C2B33]">{completedCount}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#e0eef2] mb-6 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('recommended')}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'recommended' ? 'border-[#0F4C5C] text-[#0F4C5C]' : 'border-transparent text-[#1C2B33]/50 hover:text-[#1C2B33]'}`}
          >
            Recommended
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'all' ? 'border-[#0F4C5C] text-[#0F4C5C]' : 'border-transparent text-[#1C2B33]/50 hover:text-[#1C2B33]'}`}
          >
            All problems
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'tasks' ? 'border-[#0F4C5C] text-[#0F4C5C]' : 'border-transparent text-[#1C2B33]/50 hover:text-[#1C2B33]'}`}
          >
            My tasks
          </button>
        </div>

        {/* ==========================================
        TAB 1: RECOMMENDED CAMPAIGNS
        ========================================== */}
        {activeTab === 'recommended' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-[#1C2B33]/50 uppercase tracking-wider">Recommended for you</h3>
              <Link
                to="/recommended-campaigns"
                className="text-sm font-semibold text-[#0F4C5C] hover:text-[#0a3642] transition-colors"
              >
                View all
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F4C5C]"></div>
              </div>
            ) : recommendedCampaigns && recommendedCampaigns.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {sortedRecommended.slice(0, 3).map((campaign) => (
                  <div key={campaign.campaign_id} className="bg-white border border-[#e0eef2] border-l-4 border-l-[#1AC99B] rounded-xl p-4 sm:p-5 hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-[#1C2B33] text-base group-hover:text-[#0F4C5C] transition-colors">{campaign.title}</h4>
                      <span className="bg-[#FFF0D6] text-[#8a4f00] text-[10px] font-bold px-2 py-1 rounded-md shrink-0">
                        {getMatchLabel(campaign.match_score)}
                      </span>
                    </div>
                    <div className="text-xs text-[#1C2B33]/60 mb-4">
                      📍 {campaign.location} • {campaign.date}
                    </div>
                    <p className="text-sm text-[#1C2B33]/70 mb-4 line-clamp-3">{campaign.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#e0eef2]">
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-[#D6F7EE] text-[#0a5c3e] text-[10px] font-bold px-2 py-1 rounded-md">
                          Skill match: {campaign.required_skills || 'General'}
                        </span>
                      </div>
                      <Link
                        to={`/task/${campaign.campaign_id}`}
                        className="bg-[#0F4C5C] text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-[#0a3642] transition-colors text-center"
                      >
                        View & join
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-8 text-center">
                <p className="text-sm text-[#475569]">No new campaigns available</p>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
        TAB 2: ALL PROBLEMS
        ========================================== */}
        {activeTab === 'all' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-[#1C2B33]/50 uppercase tracking-wider">All open problems</h3>
              <Link
                to="/campaigns"
                className="text-sm font-semibold text-[#0F4C5C] hover:text-[#0a3642] transition-colors"
              >
                Browse all campaigns
              </Link>
            </div>
            <p className="text-[11px] text-[#1C2B33]/50 italic mb-4">Every active problem regardless of skill match. You can still view and join any campaign.</p>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F4C5C]"></div>
              </div>
            ) : allCampaigns && allCampaigns.length > 0 ? (
              <div className="space-y-4">
                {allCampaigns.slice(0, 5).map((campaign) => (
                  <div key={campaign.id} className="bg-white border border-[#e0eef2] rounded-xl p-4 sm:p-5 hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-[#1C2B33] text-base group-hover:text-[#0F4C5C] transition-colors">{campaign.title}</h4>
                      <span className="bg-[#FFF0D6] text-[#8a4f00] text-[10px] font-bold px-2 py-1 rounded-md shrink-0">Open</span>
                    </div>
                    <div className="text-xs text-[#1C2B33]/60 mb-4">📍 {campaign.location} • {campaign.date}</div>
                    <p className="text-sm text-[#1C2B33]/70 mb-4 line-clamp-3">{campaign.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#e0eef2]">
                      <span className="text-[10px] text-[#1C2B33]/40 font-semibold italic">
                        Skills: {campaign.required_skills || 'Not specified'}
                      </span>
                      <Link
                        to={`/task/${campaign.id}`}
                        className="bg-[#0F4C5C] text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-[#0a3642] transition-colors"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-8 text-center">
                <p className="text-sm text-[#475569]">No campaigns are available right now.</p>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
        TAB 3: MY TASKS
        ========================================== */}
        {activeTab === 'tasks' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Active Tasks Section */}
            <div>
              <div className="mb-3">
                <h3 className="text-xs font-bold text-[#1C2B33]/50 uppercase tracking-wider">Your joined campaigns</h3>
                <p className="text-[11px] text-[#1C2B33]/50 italic mt-0.5">Campaigns you have joined and their current status.</p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F4C5C]"></div>
                </div>
              ) : myCampaigns && myCampaigns.length > 0 ? (
                <div className="bg-white border border-[#e0eef2] rounded-xl p-2 sm:p-4 shadow-sm divide-y divide-[#e0eef2]">
                  {myCampaigns.map((campaign) => (
                    <div key={campaign.campaign_id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 hover:bg-[#F7F9FA]/50 rounded-lg transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          campaign.status === 'accepted' ? 'bg-[#1AC99B]/15 text-[#0a5c3e]' :
                          campaign.status === 'completed' ? 'bg-[#D1FAE5] text-[#0f766e]' :
                          campaign.status === 'pending' || campaign.status === 'waiting' ? 'bg-[#FFF0D6] text-[#8a4f00]' :
                          'bg-gray-200 text-gray-500'
                        }`}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1C2B33]">{campaign.title}</p>
                          <p className="text-xs text-[#1C2B33]/60 mt-0.5">📍 {campaign.location} • {campaign.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:ml-auto pl-13 sm:pl-0">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                          campaign.status === 'accepted' ? 'bg-[#D6F7EE] text-[#0a5c3e] border-[#1AC99B]/20' :
                          campaign.status === 'completed' ? 'bg-[#D1FAE5] text-[#0f766e] border-[#34d399]/20' :
                          campaign.status === 'pending' || campaign.status === 'waiting' ? 'bg-[#FFF0D6] text-[#8a4f00] border-[#E8A020]/20' :
                          'bg-gray-200 text-gray-700 border-gray-300'
                        }`}>
                          {campaign.status}
                        </span>
                        <Link
                          to={`/task/${campaign.campaign_id}`}
                          className="text-[11px] font-semibold text-[#1C2B33]/70 border border-[#e0eef2] bg-white hover:bg-[#F7F9FA] px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[#e0eef2] rounded-xl p-8 text-center">
                  <p className="text-sm text-[#1C2B33]/60">You haven't joined any campaigns yet.</p>
                  <Link
                    to="/campaigns"
                    className="inline-block mt-3 text-sm font-semibold text-[#0F4C5C] hover:text-[#0a3642] transition-colors"
                  >
                    Browse campaigns →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}