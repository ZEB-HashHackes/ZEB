import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Navbar */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm sm:px-6 lg:px-8 border-b border-gray-200">
          <div className="flex flex-1 items-center justify-end">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Admin User</span>
              <img
                className="h-8 w-8 rounded-full border border-gray-200"
                src="https://avatars.githubusercontent.com/u/10101010?v=4"
                alt="Admin avatar"
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
