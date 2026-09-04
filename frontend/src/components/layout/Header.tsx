import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Search, Bell, User, ChevronDown, CheckCircle2, AlertTriangle, Info, X, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { globalSearch, setGlobalSearch, notifications, markNotificationRead, logout, login, currentUser } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/login');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-[70px] bg-white border-b border-gray-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left Area: Toggle Sidebar + Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Rechercher un produit, client, facture..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-hidden focus:border-[#0942a6] focus:bg-white transition-all shadow-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right Area: Notifications + Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-full text-gray-600 hover:text-[#0942a6] hover:bg-blue-50 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-[#d91f26] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-[#d91f26] text-xs font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount} nouvelles
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markNotificationRead(item.id)}
                    className={`p-3.5 flex gap-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !item.read ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="mt-0.5">
                      {item.type === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      {item.type === 'success' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      {item.type === 'info' && (
                        <Info className="w-4 h-4 text-blue-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs font-semibold ${!item.read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {item.title}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
                <button
                  onClick={() => {
                    notifications.forEach((n) => markNotificationRead(n.id));
                    setShowNotifications(false);
                  }}
                  className="text-xs font-medium text-[#0942a6] hover:underline"
                >
                  Tout marquer comme lu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition-colors focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-full bg-[#0942a6] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-gray-900 truncate">{currentUser?.name || 'Alain Banny'}</span>
                <span className="font-mono text-[10px] font-black bg-blue-50 text-[#0942a6] px-1.5 py-0.2 rounded border border-blue-100">
                  {currentUser?.code || 'EMP-001'}
                </span>
              </div>
              <span className="text-xs text-gray-500 truncate">{currentUser?.role || 'Administrateur'}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-gray-900 truncate">{currentUser?.name || 'Alain Banny'}</p>
                  <span className="font-mono text-[10px] font-extrabold bg-blue-50 text-[#0942a6] px-2 py-0.5 rounded border border-blue-100">
                    {currentUser?.code || 'EMP-001'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <p className="text-xs font-semibold text-[#0942a6] truncate">{currentUser?.role || 'Administrateur'}</p>
                </div>
              </div>



              <Link
                to="/parametres"
                onClick={() => setShowProfileMenu(false)}
                className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0942a6] transition-colors"
              >
                Mon Profil & Paramètres
              </Link>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
