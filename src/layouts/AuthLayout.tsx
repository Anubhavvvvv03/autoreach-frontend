import { Outlet } from 'react-router-dom';
import { ThunderboltOutlined } from '@ant-design/icons';
import '../styles/AuthLayout.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-brand">
          <ThunderboltOutlined className="brand-icon" />
          <h1>AutoReach</h1>
          <p>AI-powered outreach, built for you.</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
