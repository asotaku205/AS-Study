import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken } from '../../services/api';
import { getRole } from '../../services/authService';

export function AdminRoute() {
   return getAccessToken() ? <Outlet /> : <Navigate to="/login" replace />;

}

type Role = "admin" | "user";
export function RequireRole({ allow }: { allow: Role[] }) {
  const role = getRole() as Role | null;
  return role && allow.includes(role) ? <Outlet /> : <Navigate to="/" replace />;
}