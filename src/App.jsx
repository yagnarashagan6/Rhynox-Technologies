import React, { useState } from 'react';
import RedesignedApp from './RedesignedApp';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function App() {
  if (window.location.pathname.replace(/\/$/, '') === '/admin-dashboard') {
    return <AdminDashboardRoute />;
  }

  return <RedesignedApp />;
}

const AdminDashboardRoute = () => {
  const [user, setUser] = useState(null);

  return user
    ? <AdminDashboard user={user} />
    : <AdminLogin onSuccess={setUser} />;
};
