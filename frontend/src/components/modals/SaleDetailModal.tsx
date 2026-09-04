import React from 'react';
import { X, Printer, ShoppingBag, CheckCircle2, User, Calendar, CreditCard, Tag, Sparkles } from 'lucide-react';
import { Sale } from '../../types';
import { CarrefourLogo } from '../common/CarrefourLogo';

interface SaleDetailModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export const SaleDetailModal: React.FC<SaleDetailModalProps> = ({ sale, onClose }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-gray-100 my-auto">
        {/* Ticket Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#d91f26] to-red-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white p-1.5 rounded-xl shadow-2xs inline-block">
              <CarrefourLogo variant="icon" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-100 block">Facture de Vente</span>
              <h2 className="text-2xl font-black tracking-tight text-white">{sale.facture}</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="bg-white/20 backdrop-blur-md text-white font-bold text-xs px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              Statut : {sale.status}
            </span>
            <span className="bg-black/20 backdrop-blur-md text-white/90 font-medium text-xs px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-300" />
              Paiement : {sale.paymentMethod}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Client</span>
              <div className="flex items-center gap-1.5 font-extrabold text-gray-900">
                <User className="w-3.5 h-3.5 text-[#0942a6]" />
                <span>{sale.clientName}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Vendeuse / Caisse</span>
              <div className="flex items-center gap-1.5 font-extrabold text-gray-900">
                <Tag className="w-3.5 h-3.5 text-[#d91f26]" />
                <span>{sale.vendeuseName || 'Marie Kassi'}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Date & Heure</span>
              <div className="flex items-center gap-1.5 font-bold text-gray-700">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{sale.date} à {sale.time}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Articles vendus</span>
              <div className="font-bold text-gray-800">
                <span>{sale.items?.length || sale.itemsCount} ligne(s)</span>
              </div>
            </div>
          </div>

          {/* Table of Sold Products */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#d91f26]" />
              <span>Détail des produits vendus</span>
            </h3>

            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Produit</th>
                    <th className="py-2.5 px-3 text-center">Qté</th>
                    <th className="py-2.5 px-3 text-right">P.U.</th>
                    <th className="py-2.5 px-3 text-right">Sous-total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {sale.items && sale.items.length > 0 ? (
                    sale.items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-gray-900">
                          {item.productName}
                          {item.unit && <span className="text-gray-400 font-normal text-[10px] ml-1">({item.unit})</span>}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#0942a6] bg-blue-50/30">
                          × {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right text-gray-600">
                          {new Intl.NumberFormat('fr-FR').format(item.unitPrice)} FCFA
                        </td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-gray-900">
                          {new Intl.NumberFormat('fr-FR').format(item.subtotal)} FCFA
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-400 italic">
                        Détail des articles indisponible pour cette ancienne vente.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grand Total Recap */}
          <div className="bg-gradient-to-r from-red-50 to-amber-50 p-4 rounded-2xl border border-red-100/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block">Montant Total Réglé</span>
              <span className="text-[10px] text-gray-500 font-medium">Payé par {sale.paymentMethod}</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#d91f26]">
                {new Intl.NumberFormat('fr-FR').format(sale.amount)} FCFA
              </span>
            </div>
          </div>

          {/* Linked Payment Note */}
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-[#0942a6] font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-[#0942a6]" />
            <span>Paiement synchronisé en trésorerie sous la référence lié au client {sale.clientName}.</span>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-gray-100">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le ticket</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#d91f26] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
