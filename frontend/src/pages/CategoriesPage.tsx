import React, { useState } from 'react';
import { LayoutGrid, Package, Plus, Trash2, Tag, Percent, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CategoriesPage: React.FC = () => {
  const { categories, products, openModal, deleteCategory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = products.length;
  const totalCategoryRevenue = categories.reduce((sum, c) => sum + (c.revenue || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-[#0942a6] font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Catalogue & Rayons
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Catégories de Produits</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Arborescence des rayons, répartition des ventes et classification du stock.
          </p>
        </div>

        <button
          onClick={() => openModal('add_category')}
          className="flex items-center justify-center gap-2 bg-[#0942a6] hover:bg-blue-800 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Nouvelle catégorie</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Catégories Actives</p>
            <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1">{categories.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0942a6] flex items-center justify-center font-bold">
            <LayoutGrid className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Références</p>
            <p className="text-xl sm:text-2xl font-black text-purple-600 mt-1">{totalProducts} produits</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chiffre d'Affaires Rayons</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
              {new Intl.NumberFormat('fr-FR').format(totalCategoryRevenue)} <span className="text-xs font-bold">FCFA</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => {
          const categoryProducts = products.filter((p) => p.category === cat.name);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-2xs shrink-0"
                      style={{ backgroundColor: cat.color }}
                    >
                      <LayoutGrid className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-lg">{cat.name}</h3>
                      <span className="text-xs text-gray-500 font-semibold flex items-center gap-1 mt-0.5">
                        <Percent className="w-3 h-3 text-gray-400" /> Part des ventes : {cat.percentage}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Confirmer la suppression de la catégorie ${cat.name} ?`)) {
                        deleteCategory(cat.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                    title="Supprimer la catégorie"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 my-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Nombre de références :</span>
                    <span className="font-bold text-gray-900 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-gray-400" />
                      {categoryProducts.length > 0 ? categoryProducts.length : cat.productCount} produits
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Chiffre d'affaires :</span>
                    <span className="font-bold text-[#0942a6]">
                      {new Intl.NumberFormat('fr-FR').format(cat.revenue)} FCFA
                    </span>
                  </div>
                </div>
              </div>

              {/* Sample Product list */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Exemples en rayon ({categoryProducts.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {categoryProducts.map((p) => (
                    <span
                      key={p.id}
                      className="text-xs bg-gray-100 text-gray-700 font-semibold px-2.5 py-1 rounded-xl border border-gray-200/60"
                    >
                      {p.name}
                    </span>
                  ))}
                  {categoryProducts.length === 0 && (
                    <span className="text-xs text-gray-400 italic font-medium">Aucun produit attribué</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
