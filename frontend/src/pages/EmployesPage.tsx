import React, { useState } from 'react';
import {
  UserCheck,
  UserPlus,
  Search,
  Phone,
  Mail,
  Shield,
  Building2,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Lock,
  Sparkles,
  Users,
  Filter,
  Check,
  X,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Employee } from '../types';

export const EmployesPage: React.FC = () => {
  const { employees, openModal, updateEmployee, deleteEmployee, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'list' | 'permissions'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('Tous');
  const [selectedRole, setSelectedRole] = useState<string>('Tous');
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  // Departments list for filtering
  const departments = [
    'Tous',
    'Direction',
    'Ventes / Caisse',
    'Logistique / Stock',
    'Informatique / IT',
    'Comptabilité / Finance',
    'Ressources Humaines',
    'Marketing & Communication',
  ];

  const roles = ['Tous', 'Administrateur', 'Directeur', 'Vendeur', 'Magasinier'];

  const filteredEmployees = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.code && e.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm);

    const matchesDept = selectedDept === 'Tous' || e.department.includes(selectedDept.split(' ')[0]);
    const matchesRole = selectedRole === 'Tous' || e.role === selectedRole;

    return matchesSearch && matchesDept && matchesRole;
  });

  // Calculate stats
  const activeCount = employees.filter((e) => e.status === 'Actif').length;
  const leaveCount = employees.filter((e) => e.status === 'En congé').length;
  const uniqueDepts = new Set(employees.map((e) => e.department)).size;

  // Role permissions definitions
  const permissionsData = [
    {
      module: 'Tableau de Bord',
      desc: 'Vue d’ensemble des activités du magasin',
      roles: { Administrateur: true, Directeur: true, Vendeur: true, Magasinier: true },
    },
    {
      module: 'Ventes & Caisses',
      desc: 'Enregistrement des transactions et facturation clients',
      roles: { Administrateur: true, Directeur: false, Vendeur: true, Magasinier: false },
    },
    {
      module: 'Gestion du Stock & Produits',
      desc: 'Catalogue, mouvements de stocks et seuils de réapprovisionnement',
      roles: { Administrateur: true, Directeur: false, Vendeur: true, Magasinier: true },
    },
    {
      module: 'Achats & Fournisseurs',
      desc: 'Passation des commandes et réception des marchandises',
      roles: { Administrateur: true, Directeur: false, Vendeur: false, Magasinier: true },
    },
    {
      module: 'Rapports & Statistiques',
      desc: 'Analyses financières, bilans de ventes et prévisions',
      roles: { Administrateur: true, Directeur: true, Vendeur: false, Magasinier: false },
    },
    {
      module: 'Gestion des Employés & Equipes',
      desc: 'Ajout de personnel, affectation par département et rôles',
      roles: { Administrateur: true, Directeur: false, Vendeur: false, Magasinier: false },
    },
    {
      module: 'Paramètres Système',
      desc: 'Configuration globale, intégrations et sécurité',
      roles: { Administrateur: true, Directeur: false, Vendeur: false, Magasinier: false },
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* 1. Header with Title & "Nouvel employé" Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-[#0942a6] font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Ressources Humaines & Organisation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Équipe & Habilitations
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Gestion centralisée des collaborateurs, affectations par département et matrice de permissions.
          </p>
        </div>

        <button
          onClick={() => openModal('add_employee')}
          className="flex items-center justify-center gap-2 bg-[#0942a6] hover:bg-blue-800 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer self-start md:self-auto"
        >
          <UserPlus className="w-4.5 h-4.5" />
          <span>Nouvel employé</span>
        </button>
      </div>

      {/* 2. Quick Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Employés</p>
            <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1">{employees.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0942a6] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Actifs</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">En Congé</p>
            <p className="text-xl sm:text-2xl font-black text-amber-600 mt-1">{leaveCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Départements</p>
            <p className="text-xl sm:text-2xl font-black text-purple-600 mt-1">{uniqueDepts}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs: Liste vs Matrice Permissions */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('list')}
          className={`pb-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'list'
              ? 'border-[#0942a6] text-[#0942a6]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Liste des collaborateurs ({filteredEmployees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`pb-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'permissions'
              ? 'border-[#0942a6] text-[#0942a6]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Shield className="w-4 h-4 text-purple-600" />
          <span>Matrice des Rôles & Permissions</span>
        </button>
      </div>

      {/* TAB 1: EMPLOYEE LIST */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher nom, email, tél..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#0942a6]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Role Dropdown Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-gray-500 shrink-0">Rôle :</span>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-2xl px-3 py-2 text-gray-700 focus:outline-hidden cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Department Chips Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none border-t border-gray-100">
              <span className="text-xs font-bold text-gray-400 shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Départements:
              </span>
              {departments.map((dept) => {
                const isSelected = selectedDept === dept;
                return (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0942a6] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Employees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                <div>
                  {/* Top row: Initial Avatar & Status */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0942a6] to-blue-700 text-white font-black text-lg flex items-center justify-center shadow-xs shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-gray-900 text-base truncate">{emp.name}</h3>
                          <span className="font-mono text-[11px] font-extrabold bg-blue-50 text-[#0942a6] px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
                            {emp.code || `EMP-${String(emp.id).padStart(3, '0')}`}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0942a6] mt-0.5">
                          <Shield className="w-3.5 h-3.5 text-[#0942a6]" />
                          {emp.role}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant={
                        emp.status === 'Actif'
                          ? 'payee'
                          : emp.status === 'En congé'
                          ? 'warning'
                          : 'annulee'
                      }
                    >
                      {emp.status}
                    </Badge>
                  </div>

                  {/* Body: Department & Contact details */}
                  <div className="space-y-2 text-xs text-gray-600 my-4 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-bold text-gray-800">Département:</span>
                      <span className="truncate text-gray-700 font-semibold">{emp.department}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate font-medium">{emp.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-medium">{emp.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        updateEmployee(emp.id, {
                          status: emp.status === 'Actif' ? 'En congé' : 'Actif',
                        })
                      }
                      className="text-[11px] font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Basculer: {emp.status === 'Actif' ? 'Mettre en congé' : 'Activer'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingEmp(emp)}
                      className="p-1.5 rounded-lg text-[#0942a6] hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Confirmer la suppression de ${emp.name} ?`)) {
                          deleteEmployee(emp.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PERMISSIONS MATRIX */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          {/* Roles Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                role: 'Administrateur',
                color: 'border-blue-200 bg-blue-50/50',
                badge: 'Accès Total',
                badgeColor: 'bg-[#0942a6] text-white',
                desc: 'Accès sans restriction à tous les modules, paramètres système et gestion des utilisateurs.',
              },
              {
                role: 'Directeur',
                color: 'border-purple-200 bg-purple-50/50',
                badge: 'Statistiques & Rapports',
                badgeColor: 'bg-purple-700 text-white',
                desc: 'Vision analytique globale, consultation des chiffres d’affaires et rapports de synthèse.',
              },
              {
                role: 'Vendeur',
                color: 'border-emerald-200 bg-emerald-50/50',
                badge: 'Ventes & Caisses',
                badgeColor: 'bg-emerald-700 text-white',
                desc: 'Gestion quotidienne des transactions, saisie des factures et enregistrement des clients.',
              },
              {
                role: 'Magasinier',
                color: 'border-amber-200 bg-amber-50/50',
                badge: 'Stocks & Achats',
                badgeColor: 'bg-amber-700 text-white',
                desc: 'Gestion des réceptions de marchandises, mouvements de stocks et alertes de rupture.',
              },
            ].map((r) => (
              <div key={r.role} className={`p-5 rounded-3xl border ${r.color} shadow-2xs space-y-2`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-gray-900 text-base">{r.role}</h3>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${r.badgeColor}`}>
                    {r.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs overflow-x-auto">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              Tableau des Droits d’Accès par Rôle
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Matrice de contrôle d'accès basée sur les rôles de l'organisation Carrefour.
            </p>

            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-4 pr-4">Module Fonctionnel</th>
                  <th className="pb-4 px-3 text-center">Administrateur</th>
                  <th className="pb-4 px-3 text-center">Directeur</th>
                  <th className="pb-4 px-3 text-center">Vendeur</th>
                  <th className="pb-4 pl-3 text-center">Magasinier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium">
                {permissionsData.map((perm) => (
                  <tr key={perm.module} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 pr-4">
                      <p className="font-bold text-gray-900 text-sm">{perm.module}</p>
                      <p className="text-[11px] text-gray-400 font-normal">{perm.desc}</p>
                    </td>

                    <td className="py-4 px-3 text-center">
                      {perm.roles.Administrateur ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-400">
                          <X className="w-4 h-4" />
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-3 text-center">
                      {perm.roles.Directeur ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-400">
                          <X className="w-4 h-4" />
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-3 text-center">
                      {perm.roles.Vendeur ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-400">
                          <X className="w-4 h-4" />
                        </span>
                      )}
                    </td>

                    <td className="py-4 pl-3 text-center">
                      {perm.roles.Magasinier ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-400">
                          <X className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inline Edit Employee Modal */}
      {editingEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in">
            <div className="p-5 bg-[#0942a6] text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Modifier {editingEmp.name}</h3>
              <button onClick={() => setEditingEmp(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateEmployee(editingEmp.id, editingEmp);
                setEditingEmp(null);
              }}
              className="p-5 space-y-3.5"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  value={editingEmp.name}
                  onChange={(e) => setEditingEmp({ ...editingEmp, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Département</label>
                <input
                  type="text"
                  value={editingEmp.department}
                  onChange={(e) => setEditingEmp({ ...editingEmp, department: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rôle</label>
                <select
                  value={editingEmp.role}
                  onChange={(e) => setEditingEmp({ ...editingEmp, role: e.target.value as any })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#0942a6]"
                >
                  <option value="Administrateur">Administrateur</option>
                  <option value="Directeur">Directeur</option>
                  <option value="Vendeur">Vendeur</option>
                  <option value="Magasinier">Magasinier</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingEmp.email}
                  onChange={(e) => setEditingEmp({ ...editingEmp, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={editingEmp.phone}
                  onChange={(e) => setEditingEmp({ ...editingEmp, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingEmp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0942a6] text-white hover:bg-blue-800"
                >
                  Enregistrer modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
