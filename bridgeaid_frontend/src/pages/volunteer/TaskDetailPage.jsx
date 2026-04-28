import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCampaigns, getMyCampaigns, joinCampaign } from '../../api/api';

export default function TaskDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [myCampaigns, setMyCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [joinError, setJoinError] = useState('');
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [campaignsData, myData] = await Promise.all([getCampaigns(), getMyCampaigns()]);
                setCampaigns(campaignsData || []);
                setMyCampaigns(myData || []);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const campaign = campaigns.find((item) => String(item.id) === String(id));
    const participation = myCampaigns.find((item) => String(item.campaign_id) === String(id));
    const status = participation?.status;

    const statusBadgeClass = status === 'accepted'
      ? 'bg-[#D6F7EE] text-[#0a5c3e] border border-[#1AC99B]/20'
      : status === 'completed'
        ? 'bg-[#D1FAE5] text-[#0f766e] border border-[#34d399]/20'
        : status === 'pending' || status === 'waiting'
          ? 'bg-[#FFF0D6] text-[#8a4f00] border border-[#E8A020]/20'
          : 'bg-[#E0EFF2] text-[#0F4C5C] border border-[#0F4C5C]/20';

    const handleJoin = async () => {
        if (!campaign) return;
        setIsJoining(true);
        setJoinError('');
        try {
            await joinCampaign({ campaign_id: campaign.id });
            const updated = await getMyCampaigns();
            setMyCampaigns(updated || []);
        } catch (err) {
            setJoinError(err.message || 'Unable to join campaign');
        } finally {
            setIsJoining(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-[#F7F9FA] font-inter text-[#1C2B33] p-4 sm:p-8">
                <div className="max-w-3xl mx-auto bg-white border border-[#e0eef2] rounded-xl shadow-sm p-8 text-center">
                    <p className="text-sm text-[#1C2B33]/70">Loading campaign details...</p>
                </div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="w-full min-h-screen bg-[#F7F9FA] font-inter text-[#1C2B33] p-4 sm:p-8">
                <div className="max-w-3xl mx-auto bg-white border border-[#e0eef2] rounded-xl shadow-sm p-8 text-center">
                    <p className="text-sm text-[#1C2B33]/70">Campaign not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#F7F9FA] font-inter text-[#1C2B33] p-4 sm:p-8">
            <div className="max-w-3xl mx-auto bg-white border border-[#e0eef2] rounded-xl shadow-sm overflow-hidden">

                {/* Topbar */}
                <div className="bg-[#F7F9FA] border-b border-[#e0eef2] px-4 py-3 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-xs font-semibold text-[#1C2B33]/70 border border-[#e0eef2] bg-white px-3 py-1.5 rounded-lg hover:bg-[#e0eef2]/50 transition-colors flex items-center gap-1"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        Back
                    </button>
                    <span className="text-sm font-semibold text-[#1C2B33]">Problem detail</span>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8">

                    {/* Header & Badges (Typography scaled up to match NGO) */}
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold font-grotesk text-[#1C2B33] mb-4">{campaign.title}</h1>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-[#F7F9FA] border border-[#e0eef2] text-[#1C2B33]/70 text-xs font-bold px-2.5 py-1.5 rounded-md">Campaign</span>
                            {status ? (
                                <span className={`${statusBadgeClass} text-xs font-bold px-2.5 py-1.5 rounded-md capitalize`}>{status === 'completed' ? 'Completed ✅' : status}</span>
                            ) : (
                                <span className="bg-[#E0EFF2] text-[#0F4C5C] text-xs font-bold px-2.5 py-1.5 rounded-md">Not joined</span>
                            )}
                            <span className="bg-[#D6F7EE] text-[#0a5c3e] text-xs font-bold px-2.5 py-1.5 rounded-md border border-[#1AC99B]/20">Skills: {campaign.required_skills || 'General'}</span>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        <div className="bg-[#F7F9FA] rounded-xl p-3 sm:p-4 border border-[#e0eef2]/50">
                            <p className="text-[11px] font-medium text-[#1C2B33]/60 mb-1 uppercase tracking-wider">Location</p>
                            <p className="text-sm font-semibold text-[#1C2B33]">{campaign.location}</p>
                        </div>
                        <div className="bg-[#F7F9FA] rounded-xl p-3 sm:p-4 border border-[#e0eef2]/50">
                            <p className="text-[11px] font-medium text-[#1C2B33]/60 mb-1 uppercase tracking-wider">Date</p>
                            <p className="text-sm font-semibold text-[#1C2B33]">{campaign.date}</p>
                        </div>
                        <div className="bg-[#F7F9FA] rounded-xl p-3 sm:p-4 border border-[#e0eef2]/50 col-span-2 sm:col-span-1">
                            <p className="text-[11px] font-medium text-[#1C2B33]/60 mb-1 uppercase tracking-wider">Posted by</p>
                            <p className="text-sm font-semibold text-[#1C2B33]">{campaign.created_by || 'NGO'}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white border border-[#e0eef2] rounded-xl p-5 mb-8">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#1C2B33]/60 mb-2">Description</p>
                        <p className="text-sm text-[#1C2B33] leading-relaxed">
                            {campaign.description}
                        </p>
                    </div>

                    <hr className="border-[#e0eef2] mb-8" />

                    {/* Action Area */}
                    {!status && (
                        <div className="bg-[#E0EFF2]/30 border border-[#0F4C5C]/20 rounded-xl p-5">
                            <p className="text-sm font-bold text-[#0F4C5C] mb-3">Your action</p>
                            <button
                                onClick={handleJoin}
                                disabled={isJoining}
                                className="w-full bg-[#0F4C5C] text-white text-sm font-semibold py-3 rounded-lg hover:bg-[#0a3642] transition-colors shadow-sm disabled:opacity-70"
                            >
                                {isJoining ? 'Joining...' : 'Join this campaign →'}
                            </button>
                            <p className="text-[11px] text-[#0F4C5C]/70 mt-2 text-center">
                                Your request will be created with pending status for NGO approval.
                            </p>
                            {joinError && (
                                <p className="text-xs text-[#991B1B] mt-2 text-center">
                                    {joinError}
                                </p>
                            )}
                        </div>
                    )}

                    {status && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="bg-[#D6F7EE] border border-[#1AC99B]/40 rounded-xl p-5 flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-white border-2 border-[#1AC99B] flex items-center justify-center shrink-0">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a5c3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-[#0a5c3e] capitalize">Status: {status}</h3>
                                    <p className="text-xs text-[#0a5c3e]/80 mt-0.5">Track this campaign in your My tasks tab for updated NGO decision.</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex-1 py-2.5 rounded-lg border border-[#e0eef2] bg-white text-[#1C2B33]/70 text-sm font-semibold hover:bg-[#F7F9FA] transition-colors"
                                >
                                    ← Back to dashboard
                                </button>
                                <Link
                                    to="/volunteer-dashboard"
                                    state={{ activeTab: 'tasks' }}
                                    className="flex-1 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold hover:bg-[#0a3642] transition-colors text-center"
                                >
                                    Go to My tasks →
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}