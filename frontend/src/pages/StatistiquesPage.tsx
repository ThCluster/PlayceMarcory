import React from 'react';
import { BarChart2, TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';
import { useApp } from '../context/AppContext';

export const StatistiquesPage: React.FC = () => {
  const { sales, purchases, products, clients } = useApp();

  const totalSalesCA = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalAchats = purchases.reduce((sum, p) => sum + p.amount, 0);
  const grossMargin = totalSalesCA - totalAchats;
  const marginRate = totalSalesCA > 0 ? ((grossMargin / totalSalesCA) * 100).toFixed(1) : '0';
  const totalTransactions = sales.length;
  const averageBasket = totalTransactions > 0 ? Math.round(totalSalesCA / totalTransactions) : 0;

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';
  };

  // Aggregate real product sales
  const productQtyMap = new Map<string, number>();
  sales.forEach((s) => {
    (s.items || []).forEach((item) => {
      const current = productQtyMap.get(item.productName) || 0;
      productQtyMap.set(item.productName, current + item.quantity);
    });
  });

  const dynamicTopProducts = Array.from(productQtyMap.entries())
    .map(([name, salesCount]) => ({ name, sales: salesCount }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const topProductsData =
    dynamicTopProducts.length > 0
      ? dynamicTopProducts
      : products.slice(0, 5).map((p) => ({ name: p.name, sales: 0 }));

  // Aggregate comparative data from actual transactions
  const comparativeData = [
    {
      period: 'Période en cours',
      ca: totalSalesCA,
      achats: totalAchats,
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">Statistiques & Analyses</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Performances commerciales réelles et tendances des ventes issues de la caisse.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400">Chiffre d'Affaires</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{formatFCFA(totalSalesCA)}</h3>
            <span className="text-xs font-semibold text-blue-600 mt-1 block">{totalTransactions} ventes enregistrées</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0942a6] flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400">Achats & Réappro</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{formatFCFA(totalAchats)}</h3>
            <span className="text-xs font-semibold text-gray-600 mt-1 block">{purchases.length} commandes fournisseurs</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#d91f26] flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400">Panier Moyen</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{formatFCFA(averageBasket)}</h3>
            <span className="text-xs font-semibold text-emerald-600 mt-1 block">Par transaction</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0942a6] flex items-center justify-center font-bold">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400">Clients Enregistrés</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{clients.length} clients</h3>
            <span className="text-xs font-semibold text-emerald-600 mt-1 block">Fichier fidélité</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#d91f26] flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
          <h2 className="text-base font-bold text-gray-900 mb-1">Comparatif financier (CA vs Achats)</h2>
          <p className="text-xs text-gray-400 mb-4">Montants consolidés des transactions réelles</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparativeData}>
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val: any) => formatFCFA(Number(val))} />
                <Bar dataKey="ca" fill="#0942a6" radius={[6, 6, 0, 0]} name="Chiffre d'affaires" />
                <Bar dataKey="achats" fill="#d91f26" radius={[6, 6, 0, 0]} name="Achats fournisseurs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
          <h2 className="text-base font-bold text-gray-900 mb-1">Top 5 des produits les plus vendus</h2>
          <p className="text-xs text-gray-400 mb-4">Quantités réelles débitées en caisse</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [`${val} unités`, 'Ventes']} />
                <Bar dataKey="sales" fill="#0942a6" radius={[0, 8, 8, 0]} name="Quantité vendue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
