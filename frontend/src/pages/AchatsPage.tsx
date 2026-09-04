import React, { useState } from 'react';
import { Truck, Plus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';

export const AchatsPage: React.FC = () => {
  const { purchases, openModal, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const isMagasinier = currentUser?.role === 'Magasinier';

  const filteredPurchases = purchases.filter(
    (p) =>
      p.facture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fournisseur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">Achats fournisseurs</h1>
            {isMagasinier && (
              <span className="bg-amber-100 text-amber-800 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-amber-200">
                Lecture seule (Magasinier)
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {isMagasinier
              ? "Consultation des bons de commande attendus pour contrôle de la marchandise lors de la livraison."
              : "Historique des réapprovisionnements et bons de commande."}
          </p>
        </div>
        {!isMagasinier && (
          <button
            onClick={() => openModal('add_purchase')}
            className="flex items-center gap-2 bg-[#0942a6] hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvel achat</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher facture ou fournisseur..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#0942a6]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">N° Facture</th>
                <th className="py-3.5 px-4">Fournisseur</th>
                <th className="py-3.5 px-4">Articles Reçus</th>
                <th className="py-3.5 px-4">Montant Total</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {filteredPurchases.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900">{p.facture}</td>
                  <td className="py-4 px-4 font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#0942a6]" />
                      <span>{p.fournisseur}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{p.itemsCount} articles</td>
                  <td className="py-4 px-4 font-bold text-[#0942a6]">
                    {new Intl.NumberFormat('fr-FR').format(p.amount)} FCFA
                  </td>
                  <td className="py-4 px-4 text-gray-500">{p.date}</td>
                  <td className="py-4 px-4 text-right">
                    <Badge variant="recu">{p.status}</Badge>
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
