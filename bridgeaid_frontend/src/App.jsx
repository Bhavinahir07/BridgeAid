import { Routes, Route } from 'react-router-dom';

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NGODashboard from './pages/ngo/NGODashboard';
import AddProblemPage from './pages/ngo/AddProblemPage';
import ProblemDetailPage from './pages/ngo/ProblemDetailPage';
import ProfilePage from './pages/ngo/ProfilePage';
import ParticipantsPage from './pages/ngo/ParticipantsPage';

import VolunteerSettings from './pages/volunteer/VolunteerSettings';
import VolunteerProfile from './pages/volunteer/VolunteerProfile';
import TaskDetailPage from './pages/volunteer/TaskDetailPage';
import RecommendedCampaigns from './pages/volunteer/RecommendedCampaigns';

import CampaignListPage from './pages/ngo/CampaignListPage';

// 1. Import your new Layout!
import DashboardLayout from './layouts/ngo/NgoDashboardLayout';

// Volunteer Imports
import VolunteerLayout from './layouts/volunteer/VolunteerLayout';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<DashboardLayout />}>
        <Route path="/ngo-dashboard" element={<NGODashboard />} />
        <Route path="/add-problem" element={<AddProblemPage />} />
        <Route path="/problem/:id" element={<ProblemDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/participants" element={<ParticipantsPage />} />
      </Route>

      <Route path="/campaigns" element={<CampaignListPage />} />

      <Route element={<VolunteerLayout />}>
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/volunteer-profile" element={<VolunteerProfile />} />
        <Route path="/volunteer-settings" element={<VolunteerSettings />} />
        <Route path="/task/:id" element={<TaskDetailPage />} />
        <Route path="/recommended-campaigns" element={<RecommendedCampaigns />} />
      </Route>
    </Routes>
  );
}

export default App;