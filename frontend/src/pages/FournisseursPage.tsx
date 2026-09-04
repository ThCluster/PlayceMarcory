import React, { useState } from 'react';
import { Truck, Plus, Search, Phone, Mail, MapPin, User, Trash2, Building2, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FournisseursPage: React.FC = () => {
  const { suppliers, openModal, deleteSupplier, purchases } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.code && s.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVolume = suppliers.reduce((sum, s) => sum + (s.totalPurchases || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-[#0942a6] font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Approvisionnement & Partenaires
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Fournisseurs & Grossistes</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Gestion centralisée des partenaires d'approvisionnement et suivi des volumes d'achats.
          </p>
        </div>

        <button
          onClick={() => openModal('add_supplier')}
          className="flex items-center justify-center gap-2 bg-[#0942a6] hover:bg-blue-800 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Nouveau fournisseur</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre de Grossistes</p>
            <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1">{suppliers.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0942a6] flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Volume Total d'Achats</p>
            <p className="text-xl sm:text-2xl font-black text-[#0942a6] mt-1">
              {new Intl.NumberFormat('fr-FR').format(totalVolume)} <span className="text-xs font-bold">FCFA</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Commandes d'Achats</p>
            <p className="text-xl sm:text-2xl font-black text-purple-600 mt-1">{purchases.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar & Count */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher raison sociale, contact, ville..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#0942a6]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <div className="text-xs text-gray-500 font-bold">
          {filteredSuppliers.length} fournisseur{filteredSuppliers.length > 1 ? 's' : ''} répertorié{filteredSuppliers.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0942a6] font-bold flex items-center justify-center border border-blue-100 shrink-0 shadow-2xs">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-base truncate">{supplier.name}</h3>
                      <span className="font-mono text-[11px] font-extrabold bg-blue-50 text-[#0942a6] px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
                        {supplier.code || `FRS-${String(supplier.id).padStart(3, '0')}`}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 font-medium">
                      <User className="w-3.5 h-3.5 text-gray-400" /> Contact: {supplier.contact}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Confirmer la suppression du fournisseur ${supplier.name} ?`)) {
                      deleteSupplier(supplier.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                  title="Supprimer le fournisseur"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100/80 mb-4 font-medium">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="font-bold text-gray-800">{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{supplier.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>{supplier.address}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Volume d'achats:</span>
              <span className="text-sm font-black text-[#0942a6]">
                {new Intl.NumberFormat('fr-FR').format(supplier.totalPurchases)} FCFA
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
