import React, { useState } from 'react';
import { Users, UserPlus, Search, Phone, Mail, MapPin, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';

export const ClientsPage: React.FC = () => {
  const { clients, openModal, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const isVendeur = currentUser?.role === 'Vendeur';

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">Clients</h1>
            {isVendeur && (
              <span className="bg-blue-100 text-[#0942a6] font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-blue-200">
                Fidélisation & Recherche (Vendeur)
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {isVendeur
              ? "Recherche de clients et création de fiches fidélité en caisse."
              : "Gérez votre base de données de clients fidélisés."}
          </p>
        </div>
        <button
          onClick={() => openModal('add_client')}
          className="flex items-center gap-2 bg-[#0942a6] hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nouveau client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, téléphone, ville..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#0942a6]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Total : <span className="font-bold text-gray-900">{filteredClients.length} clients</span>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Coordonnées</th>
                <th className="py-3.5 px-4">Ville</th>
                <th className="py-3.5 px-4">Total Achats</th>
                <th className="py-3.5 px-4">Dernier Achat</th>
                <th className="py-3.5 px-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-xs font-black bg-blue-50 text-[#0942a6] px-2.5 py-1 rounded-md border border-blue-100">
                      {client.code}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0942a6] font-bold flex items-center justify-center text-xs">
                        {client.name.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-900">{client.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    <div className="flex flex-col text-xs gap-0.5">
                      <span className="flex items-center gap-1.5 font-medium text-gray-800">
                        <Phone className="w-3 h-3 text-gray-400" /> {client.phone}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <Mail className="w-3 h-3" /> {client.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3 h-3 text-gray-400" /> {client.city}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-[#0942a6]">
                    {new Intl.NumberFormat('fr-FR').format(client.totalSpent)} FCFA
                  </td>
                  <td className="py-4 px-4 text-gray-500">{client.lastPurchaseDate}</td>
                  <td className="py-4 px-4 text-right">
                    <Badge variant={client.status === 'Actif' ? 'payee' : 'neutral'}>
                      {client.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
