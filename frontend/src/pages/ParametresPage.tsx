import React, { useState } from 'react';
import { Settings, Save, Store, Bell, Lock, Percent, CheckCircle2 } from 'lucide-react';

export const ParametresPage: React.FC = () => {
  const [storeName, setStoreName] = useState(() => localStorage.getItem('carrefour_store_name') || 'Carrefour Supermarché');
  const [address, setAddress] = useState(() => localStorage.getItem('carrefour_store_address') || 'Boulevard Lagunaire, Cocody, Abidjan');
  const [phone, setPhone] = useState(() => localStorage.getItem('carrefour_store_phone') || '+225 27 22 00 00');
  const [taxRate, setTaxRate] = useState(() => localStorage.getItem('carrefour_store_tax') || '18');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    localStorage.setItem('carrefour_store_name', storeName);
    localStorage.setItem('carrefour_store_address', address);
    localStorage.setItem('carrefour_store_phone', phone);
    localStorage.setItem('carrefour_store_tax', taxRate);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">Paramètres du système</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Configuration générale du supermarché, caisses et taxes.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Paramètres de configuration enregistrés avec succès.</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-6 max-w-3xl">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <Store className="w-5 h-5 text-[#0942a6]" />
          <h2 className="font-bold text-gray-900 text-lg">Informations sur le point de vente</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nom de l'enseigne</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-hidden focus:border-[#0942a6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Adresse physique</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-hidden focus:border-[#0942a6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Téléphone officiel</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-hidden focus:border-[#0942a6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Taux de TVA (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-hidden focus:border-[#0942a6]"
                />
                <Percent className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#0942a6] hover:bg-blue-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </div>
    </div>
  );
};
