import { Outlet } from 'react-router-dom';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#e4e4e4] flex justify-center">
      <div className="relative flex min-h-screen w-full max-w-[390px] flex-col overflow-x-hidden bg-white shadow-[0_0_30px_rgba(0,0,0,0.08)]">
        <Outlet />
      </div>
    </div>
  );
}
