import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Dumbbell, 
  TrendingUp, 
  Heart, 
  Zap, 
  LogOut 
} from 'lucide-react';

const Navbar = ({ user }) => {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/habits', icon: CheckSquare, label: 'Habits' },
    { path: '/workout', icon: Dumbbell, label: 'Workout' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/couple', icon: Heart, label: 'Couple' },
    { path: '/ai', icon: Zap, label: 'AI Health' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      {/* Sidebar for Desktop */}
      <nav className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 glass rounded-none border-r border-white/5 p-6 z-50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
            <Heart size={24} className="text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">CoupleSync</span>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                  isActive 
                  ? 'gradient-bg text-white shadow-lg shadow-purple-500/20' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon size={22} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-auto">
          <div className="p-4 glass mb-6 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user?.gender === 'male' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'}`}>
              <span className="font-bold">{user?.name ? user.name[0] : '?'}</span>
            </div>
            <div>
              <p className="text-sm font-bold">{user?.name || 'User'}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">{user?.gender || 'Profile'}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut size={22} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Bottom Navbar for Mobile */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-20 glass flex items-center justify-around px-4 z-50 border border-white/20 shadow-2xl">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
                isActive 
                ? 'text-purple-400' 
                : 'text-white/30'
              }`
            }
          >
            <item.icon size={24} />
            <span className="text-[10px] mt-1 font-bold">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
