import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8f9fa] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,193,7,0.15)_0%,transparent_70%)]">
      <div className="w-full max-w-[420px] bg-white border border-[#e5e4e7] rounded-2xl p-12 shadow-sm">
        <div className="text-center mb-10">
        </div>
        <Outlet />
      </div>
    </div>
  );
}
