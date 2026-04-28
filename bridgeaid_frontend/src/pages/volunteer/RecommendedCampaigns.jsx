import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendedCampaigns, joinCampaign } from '../../api/api';

const getMatchLabel = (score) => {
  if (score >= 7) return '🔥 Excellent Match';
  if (score >= 4) return '👍 Good Match';
  return '🙂 Basic Match';
};

export default function RecommendedCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCampaigns = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getRecommendedCampaigns();
      setCampaigns(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch recommended campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleJoin = async (campaignId) => {
    try {
      await joinCampaign({ campaign_id: campaignId });
      alert('Joined successfully!');
      await loadCampaigns();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error joining campaign');
    }
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

  if (isLoading) {
    return (
      <div className="w-full min-h-full bg-white font-inter text-[#1C2B33]">
        <div className="p-6 sm:p-8 lg:p-10 max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F4C5C]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-full bg-white font-inter text-[#1C2B33]">
        <div className="p-6 sm:p-8 lg:p-10 max-w-7xl">
          <div className="text-center py-12">
            <p className="text-red-600">Error fetching recommended campaigns: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-white font-inter text-[#1C2B33]">
      <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to="/volunteer-dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C2B33]/60 hover:text-[#0F4C5C] transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-grotesk text-[#1C2B33]">Recommended Campaigns</h1>
          <p className="text-[#1C2B33]/60 text-sm mt-1">Campaigns matched to your skills and location.</p>
        </div>

        {sortedCampaigns && sortedCampaigns.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {sortedCampaigns.map((campaign) => {
              const alreadyJoined = campaign.status === 'pending' || campaign.status === 'accepted' || campaign.status === 'completed';
              return (
                <div key={campaign.campaign_id} className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-[#1C2B33]">{campaign.title}</h2>
                      <p className="text-sm text-[#1C2B33]/70">{campaign.location}</p>
                    </div>
                    <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#166534]">
                      {getMatchLabel(campaign.match_score)}
                    </span>
                  </div>
                  <p className="mb-4 text-sm text-[#1C2B33]/70 line-clamp-3">{campaign.description}</p>
                  <div className="flex flex-col gap-2 text-sm text-[#1C2B33]/60 mb-5">
                    <span>📅 {campaign.date}</span>
                    <span>🧰 {campaign.required_skills || 'N/A'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleJoin(campaign.campaign_id)}
                    disabled={alreadyJoined}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${alreadyJoined ? 'bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed' : 'bg-[#0F4C5C] text-white hover:bg-[#0a3642]'}`}
                  >
                    {alreadyJoined ? 'Already Joined' : 'View & Join'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-8 text-center">
            <p className="text-sm text-[#475569]">No new campaigns available</p>
          </div>
        )}
      </div>
    </div>
  );
}
