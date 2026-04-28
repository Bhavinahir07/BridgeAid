import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCampaignParticipants, getNgoCampaigns, updateParticipation } from '../../api/ngoApi';

const statusStyles = {
  waiting: 'bg-[#FEF3C7] text-[#92400E]',
  pending: 'bg-[#FEF3C7] text-[#92400E]',
  accepted: 'bg-[#DCFCE7] text-[#166534]',
  completed: 'bg-[#D1FAE5] text-[#0f766e]',
  rejected: 'bg-[#FEE2E2] text-[#991B1B]',
};

export default function ParticipantsPage() {
  const [campaignParticipants, setCampaignParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const campaigns = await getNgoCampaigns();
      const entries = await Promise.all(
        campaigns.map(async (campaign) => {
          const participants = await getCampaignParticipants(campaign.id);
          return {
            campaign_id: campaign.id,
            title: campaign.title,
            participants: participants.map((participant) => ({
              ...participant,
              name: participant.volunteer_name,
            })),
          };
        })
      );
      setCampaignParticipants(entries);
    } catch (err) {
      setError(err.message || 'Failed loading participants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
            <p className="text-red-600">Error loading participants: {error}</p>
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
            to="/ngo-dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C2B33]/60 hover:text-[#0F4C5C] transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-grotesk text-[#1C2B33]">Campaign Participants</h1>
          <p className="text-[#1C2B33]/60 text-sm mt-1">Review volunteers and update participation status.</p>
        </div>

        {campaignParticipants && campaignParticipants.length > 0 ? (
          <div className="space-y-6">
            {campaignParticipants.map((campaign) => (
              <div key={campaign.campaign_id} className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1C2B33]">{campaign.title}</h2>
                    <p className="text-sm text-[#1C2B33]/60">Campaign ID: {campaign.campaign_id}</p>
                  </div>
                  <p className="text-sm text-[#1C2B33]/70">{campaign.participants.length || 0} volunteer(s)</p>
                </div>

                <div className="space-y-4">
                  {campaign.participants && campaign.participants.length > 0 ? (
                    campaign.participants.map((participant) => (
                      <div key={participant.participation_id} className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-[#1C2B33]">{participant.name}</p>
                            <p className="text-sm text-[#1C2B33]/70">{participant.email}</p>
                            <p className="text-sm text-[#1C2B33]/70">Skills: {participant.skills || 'N/A'}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[participant.status || 'pending']}`}>
                              {participant.status || 'pending'}
                            </span>
                            {['waiting', 'pending'].includes(participant.status) && (
                              <>
                                <button
                                  type="button"
                                  onClick={async () => { await updateParticipation({ participation_id: participant.participation_id, status: 'accepted' }); await loadData(); }}
                                  className="rounded-full bg-[#0F4C5C] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0a3642] transition-colors"
                                >
                                  ✔ Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => { await updateParticipation({ participation_id: participant.participation_id, status: 'rejected' }); await loadData(); }}
                                  className="rounded-full bg-[#FEE2E2] px-3 py-1.5 text-xs font-semibold text-[#991B1B] hover:bg-[#FECACA] transition-colors"
                                >
                                  ❌ Reject
                                </button>
                              </>
                            )}
                            {participant.status === 'accepted' && (
                              <button
                                type="button"
                                onClick={async () => { await updateParticipation({ participation_id: participant.participation_id, action: 'complete' }); await loadData(); }}
                                className="rounded-full bg-[#10B981] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#059669] transition-colors"
                              >
                                ✅ Mark Completed
                              </button>
                            )}
                            {participant.status === 'completed' && (
                              <span className="rounded-full bg-[#D1FAE5] px-3 py-1.5 text-xs font-semibold text-[#0f766e]">
                                Completed ✅
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-6 text-center text-sm text-[#475569]">
                      No participants have joined this campaign yet.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-8 text-center">
            <p className="text-sm text-[#475569]">No campaign participants are available right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}