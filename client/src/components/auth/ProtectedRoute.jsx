import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getStoredUser, isAuthed } from '../../utils/auth';

export default function ProtectedRoute({ allowRoles }) {
  const loc = useLocation();
  const authed = isAuthed();
  const user = getStoredUser();

  if (!authed) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if (allowRoles?.length && !allowRoles.includes(user?.role)) return <Navigate to="/403" replace />;

  return <Outlet />;
}

