import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { profileAPI, campaignAPI, tokenManager } from '../services/api';

export default function VolunteerDashboard() {
  const navigate = useNavigate();

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileAPI.getProfile,
  });

  // Fetch all campaigns
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignAPI.getAllCampaigns,
  });

  const handleLogout = () => {
    tokenManager.removeToken();
    navigate('/login');
  };

  if (profileLoading || campaignsLoading) {
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

  return (
    <div className="w-full min-h-full bg-white font-inter text-[#1C2B33]">
      <div className="p-6 sm:p-8 lg:p-10 max-w-7xl">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-grotesk text-[#1C2B33]">
              Welcome, {profile?.name || 'Volunteer'}
            </h1>
            <p className="text-[#1C2B33]/60 text-sm mt-1">Find campaigns and make a difference in your community.</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats Section */}
        <div className="mb-10">
          <h3 className="text-[10px] font-bold text-[#1C2B33]/50 uppercase tracking-wider mb-3">Your Activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-[#F7F9FA] border border-[#e0eef2] rounded-xl p-4">
              <p className="text-xs text-[#1C2B33]/60 font-medium mb-1">Campaigns Joined</p>
              <p className="text-2xl font-bold font-grotesk text-[#1C2B33]">{profile?.campaigns_joined || 0}</p>
            </div>
            <div className="bg-[#E0EFF2]/50 border border-[#0F4C5C]/20 rounded-xl p-4">
              <p className="text-xs text-[#1C2B33]/60 font-medium mb-1">Tasks Completed</p>
              <p className="text-2xl font-bold font-grotesk text-[#0F4C5C]">{profile?.tasks_completed || 0}</p>
            </div>
            <div className="bg-[#D6F7EE]/30 border border-[#1AC99B]/20 rounded-xl p-4">
              <p className="text-xs text-[#1C2B33]/60 font-medium mb-1">Hours Volunteered</p>
              <p className="text-2xl font-bold font-grotesk text-[#0a5c3e]">{profile?.hours_volunteered || 0}</p>
            </div>
          </div>
        </div>

        {/* Available Campaigns */}
        <div>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold font-grotesk text-[#1C2B33]">Available Campaigns</h3>
            <Link
              to="/profile"
              className="text-sm font-semibold text-[#0F4C5C] hover:text-[#0a3642] transition-colors"
            >
              View Profile →
            </Link>
          </div>

          {campaigns && campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white border border-[#e0eef2] rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      campaign.category === 'food' ? 'bg-blue-100 text-blue-800' :
                      campaign.category === 'medical' ? 'bg-red-100 text-red-800' :
                      campaign.category === 'education' ? 'bg-green-100 text-green-800' :
                      campaign.category === 'disaster' ? 'bg-orange-100 text-orange-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {campaign.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      campaign.urgency === 'high' ? 'bg-red-100 text-red-800' :
                      campaign.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {campaign.urgency} priority
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-grotesk text-[#1C2B33] mb-2">
                    {campaign.title}
                  </h3>

                  <p className="text-sm text-[#1C2B33]/70 mb-4 line-clamp-3">
                    {campaign.description}
                  </p>

                  <div className="flex items-center text-sm text-[#1C2B33]/60 mb-4">
                    <span>📍 {campaign.location}</span>
                  </div>

                  <button className="w-full px-4 py-2 bg-[#0F4C5C] text-white text-sm font-semibold rounded-lg hover:bg-[#0a3642] transition-colors">
                    Join Campaign
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#1C2B33]/60">No campaigns available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}