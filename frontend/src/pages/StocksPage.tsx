import React, { useState } from 'react';
import { Layers, Warehouse, ArrowUpRight, ArrowDownRight, RefreshCw, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';

export const StocksPage: React.FC = () => {
  const { products, stockMovements, openModal } = useApp();
  const [activeTab, setActiveTab] = useState<'etat' | 'mouvements'>('etat');

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">Gestion des Stocks</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Suivi des niveaux de stock, alertes de réapprovisionnement et inventaire.
          </p>
        </div>
        <button
          onClick={() => openModal('adjust_stock')}
          className="flex items-center gap-2 bg-[#d91f26] hover:bg-red-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 self-start sm:self-auto"
        >
          <Warehouse className="w-4 h-4" />
          <span>Ajuster un stock</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('etat')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'etat'
              ? 'text-[#0942a6] border-b-2 border-[#0942a6]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          État du stock actuel
        </button>
        <button
          onClick={() => setActiveTab('mouvements')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'mouvements'
              ? 'text-[#0942a6] border-b-2 border-[#0942a6]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Historique des mouvements ({stockMovements.length})
        </button>
      </div>

      {activeTab === 'etat' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Catégorie</th>
                  <th className="py-3.5 px-4">Seuil Alerte</th>
                  <th className="py-3.5 px-4">Stock Réel</th>
                  <th className="py-3.5 px-4 text-right">Statut Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {products.map((p) => {
                  const isLow = p.stock <= p.minStock;

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-gray-900">{p.code}</td>
                      <td className="py-4 px-4 font-bold text-gray-900">{p.name}</td>
                      <td className="py-4 px-4 text-gray-600">{p.category}</td>
                      <td className="py-4 px-4 text-gray-500 font-medium">{p.minStock} {p.unit}s</td>
                      <td className="py-4 px-4 font-bold text-gray-900">{p.stock} {p.unit}s</td>
                      <td className="py-4 px-4 text-right">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1.5 bg-red-50 text-[#d91f26] font-bold px-3 py-1 rounded-full text-xs">
                            <AlertTriangle className="w-3.5 h-3.5" /> Réapprovisionner
                          </span>
                        ) : (
                          <Badge variant="payee">Optimal</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'mouvements' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Date & Heure</th>
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Quantité</th>
                  <th className="py-3.5 px-4">Auteur</th>
                  <th className="py-3.5 px-4 text-right">Motif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {stockMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 text-gray-500 font-medium">{m.date}</td>
                    <td className="py-4 px-4 font-bold text-gray-900">{m.productName}</td>
                    <td className="py-4 px-4">
                      {m.type === 'Entrée' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-full text-xs">
                          <ArrowUpRight className="w-3.5 h-3.5" /> Entrée
                        </span>
                      )}
                      {m.type === 'Sortie' && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-[#d91f26] font-bold px-2.5 py-1 rounded-full text-xs">
                          <ArrowDownRight className="w-3.5 h-3.5" /> Sortie
                        </span>
                      )}
                      {m.type === 'Ajustement' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 font-bold px-2.5 py-1 rounded-full text-xs">
                          <RefreshCw className="w-3.5 h-3.5" /> Ajustement
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-900">{m.quantity}</td>
                    <td className="py-4 px-4 text-gray-600">{m.author}</td>
                    <td className="py-4 px-4 text-right text-gray-500 text-xs italic">{m.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
