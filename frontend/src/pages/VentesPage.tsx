import React, { useState } from 'react';
import { ShoppingBag, ShoppingCart, Search, Eye, Filter, User, CreditCard, DollarSign, Tag, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Sale } from '../types';
import { SaleDetailModal } from '../components/modals/SaleDetailModal';

export const VentesPage: React.FC = () => {
  const { sales, openModal, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [vendeuseFilter, setVendeuseFilter] = useState<string>('Toutes');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const isVendeuseRole = currentUser?.role === 'Vendeur';

  // Available vendeuses list for filter
  const vendeusesList = Array.from(new Set(sales.map((s) => s.vendeuseName || 'Marie Kassi')));

  const filteredSales = sales.filter((s) => {
    const matchesSearch =
      s.facture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.vendeuseName && s.vendeuseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.items && s.items.some((i) => i.productName.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesVendeuse =
      vendeuseFilter === 'Toutes' ||
      (s.vendeuseName || 'Marie Kassi') === vendeuseFilter;

    return matchesSearch && matchesVendeuse;
  });

  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.amount, 0);
  const totalSalesCount = filteredSales.length;
  const averageBasket = totalSalesCount > 0 ? Math.round(totalRevenue / totalSalesCount) : 0;

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header & New Sale Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
              Espace Ventes & Caisse
            </h1>
            {isVendeuseRole && (
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                Mode Vendeuse
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Gestion des encaissements, facturation et consultation des produits vendus.
          </p>
        </div>

        <button
          onClick={() => openModal('add_sale')}
          className="flex items-center gap-2.5 bg-[#d91f26] hover:bg-red-800 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Nouvelle Vente / Créer Facture</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91f26] flex items-center justify-center font-bold shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Chiffre d'Affaires Ventes</span>
            <span className="text-xl font-black text-gray-900">
              {new Intl.NumberFormat('fr-FR').format(totalRevenue)} FCFA
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0942a6] flex items-center justify-center font-bold shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Factures Émises</span>
            <span className="text-xl font-black text-gray-900">{totalSalesCount} Ventes</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Panier Moyen</span>
            <span className="text-xl font-black text-gray-900">
              {new Intl.NumberFormat('fr-FR').format(averageBasket)} FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par facture, client, produit vendus..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#d91f26] focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Vendeuse Filter Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Vendeuse :</span>
          </span>
          <select
            value={vendeuseFilter}
            onChange={(e) => setVendeuseFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-hidden focus:border-[#0942a6]"
          >
            <option value="Toutes">Toutes les vendeuses</option>
            {vendeusesList.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          {isVendeuseRole && (
            <button
              onClick={() => setVendeuseFilter(currentUser?.name || 'Marie Kassi')}
              className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0942a6] font-bold text-xs whitespace-nowrap transition-colors cursor-pointer border border-blue-100"
            >
              Mes ventes uniquement
            </button>
          )}
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">N° Facture</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Vendeuse</th>
                <th className="py-3.5 px-4">Date & Heure</th>
                <th className="py-3.5 px-4">Produits vendus (Aperçu)</th>
                <th className="py-3.5 px-4">Paiement</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Détail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-medium">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    <p className="font-bold text-sm">Aucune vente trouvée</p>
                    <p className="text-xs mt-1">Essayez de modifier vos critères de recherche.</p>
                  </td>
                </tr>
              ) : (
                filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Invoice number */}
                    <td className="py-4 px-4 font-black text-gray-900">
                      <span className="font-mono text-xs">{s.facture}</span>
                    </td>

                    {/* Client */}
                    <td className="py-4 px-4 font-extrabold text-gray-900">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#0942a6]" />
                        <span>{s.clientName}</span>
                      </div>
                    </td>

                    {/* Vendeuse */}
                    <td className="py-4 px-4 text-gray-700">
                      <div className="flex items-center gap-1 text-xs font-semibold text-gray-800">
                        <Tag className="w-3 h-3 text-[#d91f26]" />
                        <span>{s.vendeuseName || 'Marie Kassi'}</span>
                      </div>
                    </td>

                    {/* Date / Time */}
                    <td className="py-4 px-4 text-gray-500 text-xs">
                      {s.date} <span className="text-gray-400 font-normal">à {s.time}</span>
                    </td>

                    {/* Products Preview list */}
                    <td className="py-4 px-4">
                      {s.items && s.items.length > 0 ? (
                        <div className="space-y-0.5 max-w-xs">
                          {s.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="text-xs text-gray-800 flex items-center justify-between gap-2">
                              <span className="font-semibold truncate">• {item.productName}</span>
                              <span className="text-[11px] font-bold text-[#0942a6] shrink-0">
                                × {item.quantity} ({new Intl.NumberFormat('fr-FR').format(item.subtotal)} FCFA)
                              </span>
                            </div>
                          ))}
                          {s.items.length > 2 && (
                            <span className="text-[10px] font-bold text-gray-400 italic block">
                              + {s.items.length - 2} autre(s) produit(s)...
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">{s.itemsCount} article(s)</span>
                      )}
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-4">
                      <span className="bg-gray-100 text-gray-800 font-bold px-2.5 py-1 rounded-lg text-xs">
                        {s.paymentMethod}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="py-4 px-4 font-black text-[#d91f26]">
                      {new Intl.NumberFormat('fr-FR').format(s.amount)} FCFA
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <Badge variant="payee">Payée</Badge>
                    </td>

                    {/* Detail Button */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedSale(s)}
                        className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-[#0942a6] font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Voir détail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Invoice Ticket Modal */}
      <SaleDetailModal
        sale={selectedSale}
        onClose={() => setSelectedSale(null)}
      />
    </div>
  );
};
