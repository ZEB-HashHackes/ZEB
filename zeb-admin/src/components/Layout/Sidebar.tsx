import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CircleDollarSign, 
  ArrowLeftRight, 
  Gavel, 
  Flag 
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Art Registration', path: '/revenue/registration', icon: CircleDollarSign },
  { name: 'Ownership Transfer', path: '/revenue/transfer', icon: ArrowLeftRight },
  { name: 'Bidding Revenue', path: '/revenue/bidding', icon: Gavel },
  { name: 'Artwork Flags', path: '/moderation/flags', icon: Flag },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-black text-primary uppercase tracking-tighter">
          ZEB Admin Flow
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
            
          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-secondary" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-secondary"
              )}
            >
              <item.icon className={clsx("w-5 h-5", isActive ? "text-primary fill-primary/20" : "text-gray-400")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">System</div>
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>All Systems Operational</span>
        </div>
      </div>
    </div>
  );
}
