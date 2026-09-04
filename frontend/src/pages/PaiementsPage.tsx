import React, { useState } from 'react';
import { Plus, ArrowUpRight, ArrowDownRight, Search, Eye, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Sale } from '../types';
import { SaleDetailModal } from '../components/modals/SaleDetailModal';

export const PaiementsPage: React.FC = () => {
  const { payments, sales, openModal } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredPayments = payments.filter(
    (p) =>
      p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to find associated sale for a payment
  const findLinkedSale = (notes: string, partyName: string): Sale | undefined => {
    // Check if notes contain invoice string like VTE-000125
    const match = notes.match(/VTE-\d+/i);
    if (match) {
      const invNum = match[0].toUpperCase();
      const found = sales.find((s) => s.facture.toUpperCase() === invNum);
      if (found) return found;
    }
    // Fallback match by client name
    return sales.find((s) => s.clientName.toLowerCase() === partyName.toLowerCase());
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">Paiements & Trésorerie</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Journal des encaissements liés aux ventes clients et décaissements fournisseurs.
          </p>
        </div>
        <button
          onClick={() => openModal('add_payment')}
          className="flex items-center gap-2 bg-[#0942a6] hover:bg-blue-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-xs transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Enregistrer un paiement</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par référence, tiers, note..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#0942a6]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Référence</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Tiers / Client / Fournisseur</th>
                <th className="py-3.5 px-4">Moyen</th>
                <th className="py-3.5 px-4">Montant</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Note / Origine</th>
                <th className="py-3.5 px-4 text-right">Détail Vente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-medium">
              {filteredPayments.map((p) => {
                const linkedSale = p.type === 'Recette' ? findLinkedSale(p.notes, p.partyName) : undefined;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-black text-gray-900">{p.reference}</td>
                    <td className="py-4 px-4">
                      {p.type === 'Recette' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-xs">
                          <ArrowUpRight className="w-3.5 h-3.5" /> Recette
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-[#d91f26] font-bold px-2.5 py-1 rounded-full text-xs">
                          <ArrowDownRight className="w-3.5 h-3.5" /> Dépense
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-gray-900">{p.partyName}</td>
                    <td className="py-4 px-4 text-gray-700 font-medium">
                      <span className="bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-bold text-gray-800">
                        {p.method}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-4 font-black ${
                        p.type === 'Recette' ? 'text-emerald-600' : 'text-[#d91f26]'
                      }`}
                    >
                      {p.type === 'Recette' ? '+' : '-'} {new Intl.NumberFormat('fr-FR').format(p.amount)} FCFA
                    </td>
                    <td className="py-4 px-4 text-gray-500">{p.date}</td>
                    <td className="py-4 px-4 text-gray-600 text-xs italic">{p.notes}</td>

                    {/* Action button to view linked sale & products */}
                    <td className="py-4 px-4 text-right">
                      {linkedSale ? (
                        <button
                          onClick={() => setSelectedSale(linkedSale)}
                          className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-[#0942a6] font-bold text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
                          title="Voir les produits vendus"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Voir produits ({linkedSale.facture})</span>
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs italic">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Detail Modal */}
      <SaleDetailModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
    </div>
  );
};
