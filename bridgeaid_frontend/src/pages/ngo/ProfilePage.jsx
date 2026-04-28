import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNgoProfile, updateNgoProfile } from '../../api/ngoApi';

export default function ProfilePage() {
    // Main view state: 'profile' or 'settings'
    const [activeTab, setActiveTab] = useState('profile');
    // Sub-view state for settings
    const [settingsTab, setSettingsTab] = useState('notifications');

    // Fetch profile data
    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: getNgoProfile,
    });

    const queryClient = useQueryClient();

    // Mutation for updating profile
    const updateProfileMutation = useMutation({
        mutationFn: updateNgoProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            alert('Profile updated successfully!');
        },
        onError: (error) => {
            alert('Failed to update profile: ' + error.message);
        }
    });

    // State for NGO form
    const [ngoForm, setNgoForm] = useState({
        organization_name: '',
        address: '',
        registration_number: ''
    });

    // Update form when profile loads
    React.useEffect(() => {
        if (profile) {
            setNgoForm({
                organization_name: profile.organization_name || '',
                address: profile.address || '',
                registration_number: profile.registration_number || ''
            });
        }
    }, [profile]);

    const handleNgoFormChange = (e) => {
        setNgoForm({ ...ngoForm, [e.target.name]: e.target.value });
    };

    const handleNgoSubmit = (e) => {
        e.preventDefault();
        updateProfileMutation.mutate(ngoForm);
    };

    // Mock states for notification toggles
    const [toggles, setToggles] = useState({
        accept: true,
        noMatch: true,
        completed: false,
        digest: false,
    });

    const handleToggle = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="w-full min-h-screen bg-white font-inter text-[#1C2B33]">
            <div className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold font-grotesk text-[#1C2B33]">Profile & Settings</h1>
                    <p className="text-[#1C2B33]/60 text-sm mt-1">Manage your organisation details, security, and preferences.</p>
                </div>

                {/* Main Tabs */}
                <div className="flex gap-6 border-b border-[#e0eef2] mb-8 overflow-x-auto hide-scrollbar">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'profile' ? 'border-[#0F4C5C] text-[#0F4C5C]' : 'border-transparent text-[#1C2B33]/50 hover:text-[#1C2B33]'
                            }`}
                    >
                        NGO Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'settings' ? 'border-[#0F4C5C] text-[#0F4C5C]' : 'border-transparent text-[#1C2B33]/50 hover:text-[#1C2B33]'
                            }`}
                    >
                        Account Settings
                    </button>
                </div>

                {/* ==========================================
            VIEW 1: PROFILE
            ========================================== */}
                {activeTab === 'profile' && (
                    <div className="space-y-6">

                        {/* Hero Stats Card */}
                        <div className="bg-white border border-[#e0eef2] rounded-xl p-5 sm:p-6 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-[#0F4C5C]/10 flex items-center justify-center text-xl font-bold text-[#0F4C5C] shrink-0">
                                    {profile?.organization_name?.charAt(0) || profile?.name?.charAt(0) || 'N'}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#1C2B33]">{profile?.organization_name || profile?.name || 'NGO'}</h2>
                                    <p className="text-xs text-[#1C2B33]/60 mt-0.5">NGO account</p>
                                </div>
                            </div>
                        </div>

                        {/* Organisation Info Form */}
                        <form onSubmit={handleNgoSubmit} className="bg-white border border-[#e0eef2] rounded-xl p-5 sm:p-6 shadow-sm">
                            <h3 className="text-xs font-bold text-[#1C2B33]/50 uppercase tracking-wider mb-5">Organisation info</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#1C2B33] mb-1.5">Organisation name</label>
                                        <input 
                                            type="text" 
                                            name="organization_name"
                                            value={ngoForm.organization_name} 
                                            onChange={handleNgoFormChange}
                                            className="w-full px-3 py-2 rounded-lg border-[0.5px] border-[#e0eef2] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:border-[#0F4C5C] focus:ring-1 focus:ring-[#0F4C5C]/20" 
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#1C2B33] mb-1.5">Email</label>
                                        <input 
                                            type="email" 
                                            value={profile?.email || ''} 
                                            className="w-full px-3 py-2 rounded-lg border-[0.5px] border-[#e0eef2] bg-[#F7F9FA] text-[#1C2B33] text-sm" 
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#1C2B33] mb-1.5">Address</label>
                                    <input 
                                        type="text" 
                                        name="address"
                                        value={ngoForm.address} 
                                        onChange={handleNgoFormChange}
                                        className="w-full px-3 py-2 rounded-lg border-[0.5px] border-[#e0eef2] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:border-[#0F4C5C] focus:ring-1 focus:ring-[#0F4C5C]/20" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#1C2B33] mb-1.5">Registration / NGO ID</label>
                                    <input 
                                        type="text" 
                                        name="registration_number"
                                        value={ngoForm.registration_number} 
                                        onChange={handleNgoFormChange}
                                        className="w-full px-3 py-2 rounded-lg border-[0.5px] border-[#e0eef2] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:border-[#0F4C5C] focus:ring-1 focus:ring-[#0F4C5C]/20" 
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button 
                                        type="button"
                                        className="px-4 py-2 rounded-lg border border-[#e0eef2] text-[#1C2B33]/70 text-xs font-semibold hover:bg-[#F7F9FA] transition-colors"
                                        onClick={() => setNgoForm({
                                            organization_name: profile?.organization_name || '',
                                            address: profile?.address || '',
                                            registration_number: profile?.registration_number || ''
                                        })}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold hover:bg-[#0a3642] transition-colors"
                                        disabled={updateProfileMutation.isPending}
                                    >
                                        {updateProfileMutation.isPending ? 'Saving...' : 'Save changes'}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Account Info Form - Read only for now */}
                        <div className="bg-white border border-[#e0eef2] rounded-xl p-5 sm:p-6 shadow-sm">
                            <h3 className="text-xs font-bold text-[#1C2B33]/50 uppercase tracking-wider mb-5">Account info</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#1C2B33] mb-1.5">Email address</label>
                                        <input type="email" value={profile?.email || ''} className="w-full px-3 py-2 rounded-lg border-[0.5px] border-[#e0eef2] bg-[#F7F9FA] text-[#1C2B33] text-sm" readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#1C2B33] mb-1.5">Name</label>
                                        <input type="text" value={profile?.name || ''} className="w-full px-3 py-2 rounded-lg border-[0.5px] border-[#e0eef2] bg-[#F7F9FA] text-[#1C2B33] text-sm" readOnly />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#1C2B33] mb-1.5">Role (read only)</label>
                                    <div className="w-full px-3 py-2 rounded-lg border border-dashed border-[#e0eef2] bg-[#F7F9FA]/50 text-[#1C2B33]/50 text-sm cursor-not-allowed">NGO</div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* ==========================================
            VIEW 2: SETTINGS
            ========================================== */}
                {activeTab === 'settings' && (
                    <div>
                        {/* Settings Sub-Tabs */}
                        <div className="flex gap-2 sm:gap-4 mb-6 border-b border-[#e0eef2] overflow-x-auto hide-scrollbar">
                            <button onClick={() => setSettingsTab('notifications')} className={`pb-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${settingsTab === 'notifications' ? 'border-[#0F4C5C] text-[#0F4C5C]' : 'border-transparent text-[#1C2B33]/50 hover:text-[#1C2B33]'}`}>
                                Notifications
                            </button>
                            <button onClick={() => setSettingsTab('security')} className={`pb-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${settingsTab === 'security' ? 'border-[#0F4C5C] text-[#0F4C5C]' : 'border-transparent text-[#1C2B33]/50 hover:text-[#1C2B33]'}`}>
                                Security
                            </button>
                            <button onClick={() => setSettingsTab('danger')} className={`pb-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${settingsTab === 'danger' ? 'border-[#e11d48] text-[#e11d48]' : 'border-transparent text-[#1C2B33]/50 hover:text-[#e11d48]'}`}>
                                Danger zone
                            </button>
                        </div>

                        {/* Notifications Tab */}
                        {settingsTab === 'notifications' && (
                            <div className="bg-white border border-[#e0eef2] rounded-xl p-5 sm:p-6 shadow-sm">
                                <h3 className="text-xs font-bold text-[#1C2B33]/50 uppercase tracking-wider mb-5">Email notifications</h3>
                                <div className="divide-y divide-[#e0eef2]">

                                    {/* Toggle 1 */}
                                    <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                                        <div className="pr-4">
                                            <p className="text-sm font-semibold text-[#1C2B33]">Volunteer accepted a task</p>
                                            <p className="text-xs text-[#1C2B33]/60 mt-0.5">Get notified when a volunteer confirms one of your problems</p>
                                        </div>
                                        <button onClick={() => handleToggle('accept')} className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none shrink-0 ${toggles.accept ? 'bg-[#0F4C5C]' : 'bg-gray-200'}`}>
                                            <span className={`block w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${toggles.accept ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>

                                    {/* Toggle 2 */}
                                    <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                                        <div className="pr-4">
                                            <p className="text-sm font-semibold text-[#1C2B33]">No volunteers matched</p>
                                            <p className="text-xs text-[#1C2B33]/60 mt-0.5">Alert when a problem stays Pending with no matches</p>
                                        </div>
                                        <button onClick={() => handleToggle('noMatch')} className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none shrink-0 ${toggles.noMatch ? 'bg-[#0F4C5C]' : 'bg-gray-200'}`}>
                                            <span className={`block w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${toggles.noMatch ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>

                                    {/* Toggle 3 */}
                                    <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                                        <div className="pr-4">
                                            <p className="text-sm font-semibold text-[#1C2B33]">Task marked completed</p>
                                            <p className="text-xs text-[#1C2B33]/60 mt-0.5">Email when a volunteer marks work as done</p>
                                        </div>
                                        <button onClick={() => handleToggle('completed')} className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none shrink-0 ${toggles.completed ? 'bg-[#0F4C5C]' : 'bg-gray-200'}`}>
                                            <span className={`block w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${toggles.completed ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {settingsTab === 'security' && (
                            <div className="space-y-6">
                                <div className="bg-white border border-[#e0eef2] rounded-xl p-5 sm:p-6 shadow-sm">
                                    <h3 className="text-xs font-bold text-[#1C2B33]/50 uppercase tracking-wider mb-5">Change password</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#1C2B33] mb-1.5">Current password</label>
                                            <input type="password" placeholder="••••••••••" className="w-full px-3 py-2 rounded-lg border-[0.5px] border-[#e0eef2] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:border-[#0F4C5C]" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-[#1C2B33] mb-1.5">New password</label>
                                                <input type="password" placeholder="••••••••••" className="w-full px-3 py-2 rounded-lg border-[0.5px] border-[#e0eef2] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:border-[#0F4C5C]" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-[#1C2B33] mb-1.5">Confirm new password</label>
                                                <input type="password" placeholder="••••••••••" className="w-full px-3 py-2 rounded-lg border-[0.5px] border-[#e0eef2] bg-[#F7F9FA] text-[#1C2B33] text-sm focus:outline-none focus:border-[#0F4C5C]" />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-[#1C2B33]/50 italic">Min 8 characters. Use a mix of letters, numbers and symbols.</p>
                                        <div className="flex justify-end pt-2">
                                            <button className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold hover:bg-[#0a3642] transition-colors">Update password</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-[#e0eef2] rounded-xl p-5 sm:p-6 shadow-sm">
                                    <h3 className="text-xs font-bold text-[#1C2B33]/50 uppercase tracking-wider mb-5">Active sessions</h3>
                                    <div className="divide-y divide-[#e0eef2]">
                                        <div className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                                            <div>
                                                <p className="text-sm font-semibold text-[#1C2B33]">Chrome &nbsp;·&nbsp; Rajkot, IN</p>
                                                <p className="text-xs text-[#1C2B33]/60 mt-0.5">Current session &nbsp;·&nbsp; Last active now</p>
                                            </div>
                                            <span className="text-xs font-bold text-[#1AC99B]">Current</span>
                                        </div>
                                        <div className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                                            <div>
                                                <p className="text-sm font-semibold text-[#1C2B33]">Mobile &nbsp;·&nbsp; Android</p>
                                                <p className="text-xs text-[#1C2B33]/60 mt-0.5">Last active 2 days ago</p>
                                            </div>
                                            <button className="px-3 py-1.5 rounded-lg bg-[#ffe4e6] text-[#be123c] text-xs font-semibold hover:bg-[#fda4af] transition-colors">Revoke</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Danger Zone Tab */}
                        {settingsTab === 'danger' && (
                            <div className="space-y-4">
                                <div className="bg-[#fff1f2] border border-[#fda4af] rounded-xl p-5 sm:p-6 shadow-sm">
                                    <h3 className="text-xs font-bold text-[#be123c] uppercase tracking-wider mb-2">Delete all problems</h3>
                                    <p className="text-sm text-[#be123c]/80 mb-4 leading-relaxed">Permanently removes all your posted problems and their volunteer assignments. This cannot be undone.</p>
                                    <button className="px-4 py-2 rounded-lg bg-[#e11d48] text-white text-xs font-semibold hover:bg-[#be123c] transition-colors shadow-sm">Delete all problems</button>
                                </div>

                                <div className="bg-[#fff1f2] border border-[#fda4af] rounded-xl p-5 sm:p-6 shadow-sm">
                                    <h3 className="text-xs font-bold text-[#be123c] uppercase tracking-wider mb-2">Delete account</h3>
                                    <p className="text-sm text-[#be123c]/80 mb-4 leading-relaxed">Permanently deletes your NGO account, all problems, and all volunteer assignments. Volunteers will be notified. This cannot be undone.</p>
                                    <button className="px-4 py-2 rounded-lg bg-[#e11d48] text-white text-xs font-semibold hover:bg-[#be123c] transition-colors shadow-sm">Delete NGO account</button>
                                </div>
                            </div>
                        )}

                    </div>
                )}

            </div>
        </div>
    );
}