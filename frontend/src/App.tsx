import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ActionModals } from './components/modals/ActionModals';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { EmployesPage } from './pages/EmployesPage';
import { FournisseursPage } from './pages/FournisseursPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProduitsPage } from './pages/ProduitsPage';
import { AchatsPage } from './pages/AchatsPage';
import { VentesPage } from './pages/VentesPage';
import { PaiementsPage } from './pages/PaiementsPage';
import { StocksPage } from './pages/StocksPage';
import { StatistiquesPage } from './pages/StatistiquesPage';
import { RapportsPage } from './pages/RapportsPage';
import { ParametresPage } from './pages/ParametresPage';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex font-sans text-gray-900 antialiased selection:bg-blue-100 selection:text-[#0942a6]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px] transition-all duration-300">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-[1650px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Modals Provider */}
      <ActionModals />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/*"
        element={
          <ProtectedLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/employes" element={<EmployesPage />} />
              <Route path="/fournisseurs" element={<FournisseursPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/produits" element={<ProduitsPage />} />
              <Route path="/achats" element={<AchatsPage />} />
              <Route path="/ventes" element={<VentesPage />} />
              <Route path="/paiements" element={<PaiementsPage />} />
              <Route path="/stocks" element={<StocksPage />} />
              <Route path="/statistiques" element={<StatistiquesPage />} />
              <Route path="/rapports" element={<RapportsPage />} />
              <Route path="/parametres" element={<ParametresPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ProtectedLayout>
        }
      />
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
