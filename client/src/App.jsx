import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/ToastProvider';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import HelpCenter from './pages/public/HelpCenter';

import NGODashboard from './pages/dashboards/NGODashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

import Forbidden from './pages/system/Forbidden';
import NotFound from './pages/system/NotFound';
import DonorOverview from './pages/dashboards/donor/Overview';
import Donate from './pages/dashboards/donor/Donate';
import Rewards from './pages/dashboards/donor/Rewards';
import Profile from './pages/dashboards/common/Profile';
import NgoMap from './pages/dashboards/ngo/Map';
import NgoHistory from './pages/dashboards/ngo/History';
import AdminUsers from './pages/dashboards/admin/Users';
import AdminDonations from './pages/dashboards/admin/Donations';
import AdminSettings from './pages/dashboards/admin/Settings';

function App() {
  return (
    <Router>
      <ToastProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/403" element={<Forbidden />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route element={<ProtectedRoute allowRoles={['Donor']} />}>
                  <Route path="/dashboard/donor" element={<DonorOverview />} />
                  <Route path="/dashboard/donor/donate" element={<Donate />} />
                  <Route path="/dashboard/donor/rewards" element={<Rewards />} />
                  <Route path="/dashboard/donor/profile" element={<Profile />} />
                </Route>

                <Route element={<ProtectedRoute allowRoles={['NGO']} />}>
                  <Route path="/dashboard/ngo" element={<NGODashboard />} />
                  <Route path="/dashboard/ngo/map" element={<NgoMap />} />
                  <Route path="/dashboard/ngo/history" element={<NgoHistory />} />
                  <Route path="/dashboard/ngo/profile" element={<Profile />} />
                </Route>

                <Route element={<ProtectedRoute allowRoles={['Admin']} />}>
                  <Route path="/dashboard/admin" element={<AdminDashboard />} />
                  <Route path="/dashboard/admin/users" element={<AdminUsers />} />
                  <Route path="/dashboard/admin/donations" element={<AdminDonations />} />
                  <Route path="/dashboard/admin/settings" element={<AdminSettings />} />
                </Route>

                <Route path="/dashboard/:role/*" element={<Navigate to="/403" replace />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
      </ToastProvider>
    </Router>
  );
}

export default App;
