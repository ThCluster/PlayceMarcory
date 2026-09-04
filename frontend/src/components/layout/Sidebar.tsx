import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Truck,
  LayoutGrid,
  Package,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Layers,
  BarChart2,
  FileText,
  Settings,
  LogOut,
  User,
  X,
} from 'lucide-react';
import { CarrefourLogo } from '../common/CarrefourLogo';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useApp();

  const allMenuItems = [
    { name: 'Tableau de bord', path: '/', icon: LayoutDashboard, roles: ['Administrateur', 'Directeur', 'Magasinier'] },
    { name: 'Clients', path: '/clients', icon: Users, roles: ['Administrateur', 'Vendeur'] },
    { name: 'Employés', path: '/employes', icon: UserCheck, roles: ['Administrateur'] },
    { name: 'Fournisseurs', path: '/fournisseurs', icon: Truck, roles: ['Administrateur'] },
    { name: 'Catégories', path: '/categories', icon: LayoutGrid, roles: ['Administrateur'] },
    { name: 'Produits', path: '/produits', icon: Package, roles: ['Administrateur', 'Magasinier', 'Vendeur'] },
    { name: 'Achats fournisseurs', path: '/achats', icon: ShoppingCart, roles: ['Administrateur', 'Magasinier'] },
    { name: 'Ventes clients', path: '/ventes', icon: ShoppingBag, roles: ['Administrateur', 'Vendeur'] },
    { name: 'Paiements', path: '/paiements', icon: CreditCard, roles: ['Administrateur', 'Vendeur'] },
    { name: 'Stocks', path: '/stocks', icon: Layers, roles: ['Administrateur', 'Magasinier'] },
    { name: 'Statistiques', path: '/statistiques', icon: BarChart2, roles: ['Administrateur', 'Directeur'] },
    { name: 'Rapports', path: '/rapports', icon: FileText, roles: ['Administrateur', 'Directeur'] },
    { name: 'Paramètres', path: '/parametres', icon: Settings, roles: ['Administrateur'] },
  ];

  const userRole = currentUser?.role || 'Administrateur';
  const menuItems = allMenuItems.filter((item) => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[260px] bg-[#0942a6] text-white z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-xl lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Logo Container (White background box as seen in screenshot) */}
        <div className="bg-white h-[70px] px-5 flex items-center justify-between border-b border-gray-100 shrink-0">
          <CarrefourLogo variant="full" />
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-800 p-1 rounded-md"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] transition-all duration-150 font-medium ${
                  isActive
                    ? 'bg-white text-[#0942a6] font-semibold shadow-sm scale-[1.01]'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0942a6]' : 'text-white'}`} />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Profile Box */}
        <div className="p-3.5 border-t border-white/10 shrink-0">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/15">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-white text-[#0942a6] flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                <User className="w-5 h-5 text-[#0942a6]" />
              </div>
              <div className="min-w-0 flex flex-col leading-tight">
                <span className="font-semibold text-sm truncate text-white">{currentUser?.name || 'Admin'}</span>
                <span className="text-[11px] text-blue-100/80 truncate">{currentUser?.role || 'Administrateur'}</span>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                onClose();
                navigate('/login');
              }}
              title="Déconnexion"
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
