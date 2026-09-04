import React, { useState } from 'react';
import { Package, PackagePlus, Search, AlertTriangle, Filter, LayoutGrid, List, Eye, X, CheckCircle2, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Product } from '../types';

export const ProduitsPage: React.FC = () => {
  const { products, openModal, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const role = currentUser?.role;
  const isMagasinier = role === 'Magasinier';
  const isVendeur = role === 'Vendeur';
  const isReadOnly = isMagasinier || isVendeur;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Toutes' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">Produits & Catalogue</h1>
            {isReadOnly && (
              <span className="bg-amber-100 text-amber-800 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-amber-200">
                Lecture seule ({isVendeur ? 'Vendeur' : 'Magasinier'})
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {isReadOnly
              ? "Consultation des photos, vérification des prix et disponibilité des articles en rayon."
              : "Catalogue complet avec fiches photos, gestion des prix et suivi du stock."}
          </p>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => openModal('add_product')}
            className="flex items-center gap-2 bg-[#d91f26] hover:bg-red-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Nouveau produit</span>
          </button>
        )}
      </div>

      {/* Filter, Search & View Switcher Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.value ? e.value : e.target.value)}
              placeholder="Rechercher par nom, code..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-[#0942a6]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs sm:text-sm font-medium rounded-xl px-3 py-2 text-gray-700 w-full sm:w-auto focus:outline-hidden"
            >
              <option value="Toutes">Toutes les catégories</option>
              <option value="Boissons">Boissons</option>
              <option value="Alimentation">Alimentation</option>
              <option value="Hygiène">Hygiène</option>
              <option value="Entretien">Entretien</option>
            </select>
          </div>
        </div>

        {/* View mode buttons & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <div className="text-xs text-gray-500 font-medium whitespace-nowrap">
            Affichés : <span className="font-bold text-gray-900">{filteredProducts.length} articles</span>
          </div>

          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/60">
            <button
              onClick={() => setViewMode('grid')}
              title="Vue Cartes / Photos"
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-[#0942a6] shadow-2xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="Vue Tableau / Liste"
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-[#0942a6] shadow-2xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Content: Grid View or List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((p) => {
            const isLowStock = p.stock <= p.minStock;
            const isOutOfStock = p.stock === 0;

            return (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="bg-white rounded-3xl border border-gray-100 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Photo Banner */}
                  <div className="h-44 w-full bg-gray-100 relative overflow-hidden">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1 bg-gray-50">
                        <Package className="w-8 h-8 text-gray-300" />
                        <span className="text-[11px] font-medium">Pas de photo</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#0942a6] font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-2xs">
                      {p.code}
                    </span>
                    <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white font-semibold text-[10px] px-2.5 py-1 rounded-full">
                      {p.category}
                    </span>
                  </div>

                  {/* Card Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-extrabold text-gray-900 text-sm leading-snug line-clamp-1 group-hover:text-[#0942a6] transition-colors">
                      {p.name}
                    </h3>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-bold block">Prix Vente</span>
                        <span className="font-extrabold text-gray-900 text-sm">
                          {new Intl.NumberFormat('fr-FR').format(p.price)} FCFA
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 text-[10px] uppercase font-bold block">Unité</span>
                        <span className="font-bold text-gray-600 text-xs">{p.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Stock Badge & Consultation Link */}
                <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-gray-100/80">
                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-[#d91f26] font-extrabold px-2.5 py-1 rounded-full text-[11px]">
                      <AlertTriangle className="w-3 h-3" />
                      Rupture de stock
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
                      <AlertTriangle className="w-3 h-3" />
                      Alerte : {p.stock}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      Stock : {p.stock}
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(p);
                    }}
                    className="p-1.5 rounded-xl text-gray-400 hover:text-[#0942a6] hover:bg-blue-50 transition-colors"
                    title="Consulter la fiche produit"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Photo</th>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Désignation</th>
                  <th className="py-3.5 px-4">Catégorie</th>
                  <th className="py-3.5 px-4">Prix Vente</th>
                  <th className="py-3.5 px-4">Prix Achat</th>
                  <th className="py-3.5 px-4">Unité</th>
                  <th className="py-3.5 px-4 text-center">Stock</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {filteredProducts.map((p) => {
                  const isLowStock = p.stock <= p.minStock;

                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-4">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{p.code}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{p.name}</td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-50 text-[#0942a6] font-bold px-2.5 py-0.5 rounded-lg text-xs">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-gray-900">
                        {new Intl.NumberFormat('fr-FR').format(p.price)} FCFA
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {new Intl.NumberFormat('fr-FR').format(p.cost)} FCFA
                      </td>
                      <td className="py-3 px-4 text-gray-600">{p.unit}</td>
                      <td className="py-3 px-4 text-center">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-[#d91f26] font-bold px-2.5 py-0.5 rounded-full text-xs border border-red-100">
                            <AlertTriangle className="w-3 h-3" />
                            {p.stock}
                          </span>
                        ) : (
                          <Badge variant="payee">{p.stock}</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(p);
                          }}
                          className="p-1.5 rounded-lg text-[#0942a6] bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                          title="Fiche produit"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Fiche Produit (Consultation & Photos) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header with Image Banner */}
            <div className="relative h-56 bg-gray-900">
              {selectedProduct.imageUrl ? (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover opacity-90"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
                  <Package className="w-16 h-16 text-blue-300/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#0942a6] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    {selectedProduct.code}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                    {selectedProduct.category}
                  </span>
                </div>
                <h2 className="text-xl font-black text-white leading-tight">{selectedProduct.name}</h2>
              </div>
            </div>

            {/* Modal Content Details */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Prix Vente Client</span>
                  <span className="text-lg font-black text-[#0942a6]">
                    {new Intl.NumberFormat('fr-FR').format(selectedProduct.price)} FCFA
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Prix Achat Fournisseur</span>
                  <span className="text-lg font-black text-gray-700">
                    {new Intl.NumberFormat('fr-FR').format(selectedProduct.cost)} FCFA
                  </span>
                </div>
              </div>

              {/* Profit Margin Info */}
              <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Marge brute estimée :</span>
                </div>
                <span className="text-sm font-black text-emerald-700">
                  +{new Intl.NumberFormat('fr-FR').format(selectedProduct.price - selectedProduct.cost)} FCFA (
                  {Math.round(((selectedProduct.price - selectedProduct.cost) / selectedProduct.cost) * 100)}%)
                </span>
              </div>

              {/* Stock Status Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-600">Niveau de Stock actuel :</span>
                  <span className={selectedProduct.stock <= selectedProduct.minStock ? 'text-red-600' : 'text-emerald-700'}>
                    {selectedProduct.stock} {selectedProduct.unit}s (Seuil min : {selectedProduct.minStock})
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      selectedProduct.stock === 0
                        ? 'w-0'
                        : selectedProduct.stock <= selectedProduct.minStock
                        ? 'bg-[#d91f26] w-1/4'
                        : 'bg-emerald-500 w-3/4'
                    }`}
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                {!isReadOnly && (
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      openModal('adjust_stock');
                    }}
                    className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#0942a6] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Ajuster le stock
                  </button>
                )}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  Fermer la fiche
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

