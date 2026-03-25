import { Outlet } from 'react-router-dom';
import '../styles/AuthLayout.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-brand">
        </div>
        <Outlet />
      </div>
    </div>
  );
}
