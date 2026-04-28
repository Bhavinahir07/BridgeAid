import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCampaigns, joinCampaign } from '../../api/api';
import { tokenManager } from '../../services/api';

export default function CampaignListPage() {
  const role = tokenManager.getRole();
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [joinedIds, setJoinedIds] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getCampaigns();
        setCampaigns(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch campaigns');
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  const handleJoin = async (campaignId) => {
    if (role !== 'volunteer') {
      setErrorMessage('Only volunteers can join campaigns.');
      setMessage('');
      return;
    }

    setIsJoining(true);
    try {
      await joinCampaign({ campaign_id: campaignId });
      setJoinedIds((current) => [...current, campaignId]);
      setMessage('You have joined the campaign successfully.');
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message || 'Unable to join campaign');
      setMessage('');
    } finally {
      setIsJoining(false);
    }
  };

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
            <p className="text-red-600">Error loading campaigns: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const dashboardPath = role === 'ngo' ? '/ngo-dashboard' : '/volunteer-dashboard';

  return (
    <div className="w-full min-h-full bg-white font-inter text-[#1C2B33]">
      <div className="p-6 sm:p-8 lg:p-10 max-w-7xl">

        <div className="mb-8">
          <Link
            to={dashboardPath}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C2B33]/60 hover:text-[#0F4C5C] transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-grotesk text-[#1C2B33]">All Campaigns</h1>
          <p className="text-[#1C2B33]/60 text-sm mt-1">Browse campaigns and join causes that need your skills.</p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 text-sm font-medium text-[#064E3B]">
            {message}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] p-4 text-sm font-medium text-[#991B1B]">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns && campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white border border-[#e0eef2] rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="mb-4 flex flex-col gap-2">
                  <div className="text-sm text-[#1C2B33]/60">📍 {campaign.location}</div>
                  <div className="text-sm text-[#1C2B33]/60">📅 {campaign.date}</div>
                  <div className="text-sm text-[#1C2B33]/60">🧰 {campaign.required_skills || 'Not specified'}</div>
                </div>

                <h3 className="text-lg font-bold font-grotesk text-[#1C2B33] mb-2">{campaign.title}</h3>

                <p className="text-sm text-[#1C2B33]/70 mb-4 line-clamp-3">{campaign.description}</p>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-[#1C2B33]/50">by {campaign.created_by || 'NGO'}</span>
                  {role === 'volunteer' ? (
                    <button
                      type="button"
                      disabled={joinedIds.includes(campaign.id) || isJoining}
                      onClick={() => handleJoin(campaign.id)}
                      className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#0F4C5C] text-white hover:bg-[#0a3642] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {joinedIds.includes(campaign.id) ? 'Joined' : 'Join'}
                    </button>
                  ) : (
                    <Link
                      to={dashboardPath}
                      className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#F7F9FA] text-[#1C2B33] hover:bg-[#e0eef2] transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[#1C2B33]/60">No campaigns available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
