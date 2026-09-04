import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Calendar,
  ChevronDown,
  ShoppingCart,
  ShoppingBag,
  Package,
  Users,
  CreditCard,
  UserPlus,
  Truck,
  Barcode,
  Warehouse,
  AlertTriangle,
  Award,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  FileText,
  BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

export const DashboardPage: React.FC = () => {
  const {
    sales,
    purchases,
    products,
    clients,
    dateRange,
    setDateRange,
    openModal,
    currentUser,
  } = useApp();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [lineChartPeriod, setLineChartPeriod] = useState('Cette semaine');
  const [pieChartPeriod, setPieChartPeriod] = useState('Ce mois');

  const role = currentUser?.role || 'Administrateur';

  // Dashboard is hidden for Vendeur role -> Redirect directly to Ventes Clients
  if (role === 'Vendeur') {
    return <Navigate to="/ventes" replace />;
  }

  const isMagasinier = role === 'Magasinier';
  const isVendeur = role === 'Vendeur';
  const isDirecteur = role === 'Directeur';
  const isAdmin = role === 'Administrateur';

  // Filter Out-of-Stock and Low Stock Products
  const outOfStockProducts = products.filter((p) => p.stock === 0);
  const lowStockAlerts = products.filter((p) => p.stock > 0 && p.stock <= p.minStock);
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);

  // Top 10 Clients sorted by totalSpent
  const top10Clients = [...clients]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);

  // Real sales totals
  const totalSalesRevenue = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalSalesCount = sales.length;
  const averageBasketValue = totalSalesCount > 0 ? Math.round(totalSalesRevenue / totalSalesCount) : 0;
  const totalPurchasesAmount = purchases.reduce((sum, p) => sum + p.amount, 0);

  // Top 10 Products with calculated sales volume and revenue from actual sales items
  const productSalesMap = new Map<string, { qty: number; revenue: number }>();
  sales.forEach((s) => {
    (s.items || []).forEach((item) => {
      const current = productSalesMap.get(item.productId) || { qty: 0, revenue: 0 };
      productSalesMap.set(item.productId, {
        qty: current.qty + item.quantity,
        revenue: current.revenue + item.subtotal,
      });
    });
  });

  const top10Products = [...products]
    .map((p) => {
      const stats = productSalesMap.get(p.id) || { qty: 0, revenue: 0 };
      return {
        ...p,
        unitsSold: stats.qty,
        totalRevenue: stats.revenue,
      };
    })
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 10);

  // Dynamic Sales Evolution Data calculated from actual sales records
  const dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const dayStatsMap: { [key: string]: { sales: number; qty: number } } = {
    Lun: { sales: 0, qty: 0 },
    Mar: { sales: 0, qty: 0 },
    Mer: { sales: 0, qty: 0 },
    Jeu: { sales: 0, qty: 0 },
    Ven: { sales: 0, qty: 0 },
    Sam: { sales: 0, qty: 0 },
    Dim: { sales: 0, qty: 0 },
  };

  sales.forEach((s) => {
    const parts = s.date.split('/');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      const dayName = dayLabels[d.getDay()];
      if (dayStatsMap[dayName]) {
        dayStatsMap[dayName].sales += s.amount;
        dayStatsMap[dayName].qty += s.itemsCount || 0;
      }
    }
  });

  const salesEvolutionData = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => ({
    day: d,
    sales: dayStatsMap[d].sales,
    qty: dayStatsMap[d].qty,
  }));

  // Dynamic Category Sales Data calculated from actual sales and products
  const categoryRevenueMap: { [cat: string]: number } = {};
  sales.forEach((s) => {
    (s.items || []).forEach((item) => {
      const prod = products.find((p) => p.id === item.productId || p.name === item.productName);
      const catName = prod?.category || 'Autres';
      categoryRevenueMap[catName] = (categoryRevenueMap[catName] || 0) + item.subtotal;
    });
  });

  const catColors: { [key: string]: string } = {
    Boissons: '#0942a6',
    Alimentation: '#d91f26',
    Hygiène: '#1e3a8a',
    Entretien: '#3b82f6',
    Autres: '#94a3b8',
  };

  const dynamicCategoryList = Object.entries(categoryRevenueMap).map(([name, rev]) => {
    const percentage = totalSalesRevenue > 0 ? Math.round((rev / totalSalesRevenue) * 100) : 0;
    return {
      name,
      value: percentage,
      revenue: rev,
      color: catColors[name] || '#64748b',
    };
  });

  const categoryData =
    dynamicCategoryList.length > 0
      ? dynamicCategoryList
      : [{ name: 'Général', value: 100, revenue: totalSalesRevenue, color: '#0942a6' }];

  const getProductImage = (name: string) => {
    if (name.includes('Huile')) return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=80&auto=format&fit=crop&q=80';
    if (name.includes('Sucre')) return 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=80&auto=format&fit=crop&q=80';
    if (name.includes('Lait')) return 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&auto=format&fit=crop&q=80';
    if (name.includes('Riz')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=80&auto=format&fit=crop&q=80';
    if (name.includes('Jus')) return 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=80&auto=format&fit=crop&q=80';
    if (name.includes('Eau')) return 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=80&auto=format&fit=crop&q=80';
    if (name.includes('Café')) return 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1607006482172-3ba49a8d438d?w=80&auto=format&fit=crop&q=80';
  };

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-12">
      {/* 1. Header Banner tailored to Role */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white p-6 sm:p-7 rounded-3xl border border-gray-100/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="bg-blue-100 text-[#0942a6] font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Espace {role}
            </span>
            <span className="text-xs text-gray-400 font-medium">• Carrefour Marcory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {isMagasinier
              ? 'Tableau de bord Logistique & Stocks'
              : isVendeur
              ? 'Tableau de bord Ventes & Caisse'
              : isDirecteur
              ? 'Tableau de bord Direction & Supervision'
              : 'Tableau de bord Général'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            {isMagasinier
              ? 'Aperçu du stock, des alertes de rupture et contrôle des commandes d’achats.'
              : isVendeur
              ? 'Aperçu des ventes du jour, enregistrement des clients et suivi des encaissements.'
              : isDirecteur
              ? 'Analyse stratégique en temps réel, contrôle des marges, bilans d’activité et audits financiers.'
              : 'Aperçu analytique en temps réel des ventes, stocks et performances de l’hyper marché.'}
          </p>
        </div>

        {/* Date Selector Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-3 bg-gray-50 border border-gray-200/90 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-gray-700 hover:border-gray-300 hover:bg-white transition-all shadow-2xs cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#0942a6]" />
            <span>{dateRange}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showDatePicker && (
            <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              {['Aujourd\'hui', 'Hier', 'Mercredi 29 Mai 2024', 'Cette semaine', 'Ce mois-ci', 'Année 2024'].map(
                (d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDateRange(d);
                      setShowDatePicker(false);
                    }}
                    className={`w-full text-left px-5 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                      dateRange === d ? 'bg-blue-50 text-[#0942a6]' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {d}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Key Role-Based KPI Cards */}
      {isMagasinier ? (
        /* MAGASINIER KPIS: Stock & Logistics Focus (No financial CA data exposed) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Références"
            value={`${products.length} articles`}
            trend="100% à jour"
            icon={Package}
            iconBgColor="blue"
          />
          <StatCard
            title="Total Unités en Stock"
            value={`${totalStockUnits.toLocaleString('fr-FR')} unités`}
            trend="En rayon / réserve"
            icon={Warehouse}
            iconBgColor="blue"
          />
          <StatCard
            title="Produits en rupture"
            value={`${outOfStockProducts.length} articles`}
            trend="Priorité réappro"
            icon={ShieldAlert}
            iconBgColor="red"
          />
          <StatCard
            title="Stock Faible"
            value={`${lowStockAlerts.length} en alerte`}
            trend="Seuil critique"
            icon={AlertTriangle}
            iconBgColor="yellow"
          />
        </div>
      ) : isVendeur ? (
        /* VENDEUR KPIS: Sales & Cashier Focus */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="CA Caisse"
            value={formatFCFA(totalSalesRevenue)}
            trend={`${totalSalesCount} ventes`}
            icon={ShoppingCart}
            iconBgColor="blue"
          />
          <StatCard
            title="Transactions réalisées"
            value={`${sales.length} factures`}
            trend="100% enregistrées"
            icon={ShoppingBag}
            iconBgColor="blue"
          />
          <StatCard
            title="Clients Répertoriés"
            value={`${clients.length} clients`}
            trend="Fichier fidélité"
            icon={Users}
            iconBgColor="blue"
          />
          <StatCard
            title="Panier Moyen"
            value={formatFCFA(averageBasketValue)}
            trend="Par ticket"
            icon={TrendingUp}
            iconBgColor="blue"
          />
        </div>
      ) : (
        /* ADMIN / DIRECTEUR KPIS: Full Financial & Executive Overview */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          <StatCard
            title="Chiffre d'Affaires Ventes"
            value={formatFCFA(totalSalesRevenue)}
            trend={`${sales.length} factures`}
            icon={ShoppingCart}
            iconBgColor="blue"
          />
          <StatCard
            title="Total Achats Fournisseurs"
            value={formatFCFA(totalPurchasesAmount)}
            trend={`${purchases.length} commandes`}
            icon={TrendingUp}
            iconBgColor="blue"
          />
          <StatCard
            title="Ventes réalisées"
            value={`${sales.length} factures`}
            trend="Enregistrées"
            icon={ShoppingBag}
            iconBgColor="blue"
          />
          <StatCard
            title="Produits en rupture"
            value={`${outOfStockProducts.length} articles`}
            trend={`${lowStockAlerts.length} en alerte`}
            icon={ShieldAlert}
            iconBgColor="red"
          />
          <StatCard
            title="Clients enregistrés"
            value={`${clients.length} clients`}
            trend="Base active"
            icon={Users}
            iconBgColor="blue"
          />
        </div>
      )}

      {/* 3. Section Charts: Render financial charts for Admin/Directeur/Vendeur */}
      {!isMagasinier && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Chart 1: Évolution des ventes (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-gray-100/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Évolution des ventes</h2>
                  <p className="text-xs text-gray-400">Tendances quotidiennes de recettes en FCFA</p>
                </div>
                <select
                  value={lineChartPeriod}
                  onChange={(e) => setLineChartPeriod(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl px-3 py-2 text-gray-700 focus:outline-hidden cursor-pointer"
                >
                  <option>Cette semaine</option>
                  <option>La semaine dernière</option>
                  <option>Ce mois</option>
                </select>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-6 mb-4 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 bg-[#0942a6] rounded-md"></span>
                  <span className="text-gray-700 font-bold">Chiffre d'affaires (FCFA)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 bg-[#d91f26] rounded-md"></span>
                  <span className="text-gray-700 font-bold">Volume d'articles vendus</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesEvolutionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                    tickFormatter={(v) => (v >= 1000000 ? `${v / 1000000}M` : `${v / 1000}K`)}
                  />
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      name === 'sales' ? formatFCFA(val) : `${val} unités`,
                      name === 'sales' ? 'Chiffre d\'affaires' : 'Articles vendus',
                    ]}
                    contentStyle={{ borderRadius: '16px', borderColor: '#e2e8f0', fontSize: '13px', padding: '12px 16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#0942a6"
                    strokeWidth={3.5}
                    dot={{ fill: '#0942a6', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="qty"
                    stroke="#d91f26"
                    strokeWidth={2.5}
                    dot={{ fill: '#d91f26', r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Ventes par catégorie (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-gray-100/90 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Ventes par catégorie</h2>
                <p className="text-xs text-gray-400">Répartition des revenus par rayon</p>
              </div>
              <select
                value={pieChartPeriod}
                onChange={(e) => setPieChartPeriod(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl px-3 py-2 text-gray-700 focus:outline-hidden cursor-pointer"
              >
                <option>Ce mois</option>
                <option>Mois dernier</option>
                <option>Année 2024</option>
              </select>
            </div>

            <div className="flex flex-col gap-4 justify-center flex-1">
              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: any, item: any) => [
                        `${value}% (${formatFCFA(item.payload.revenue)})`,
                        item.payload.name,
                      ]}
                      contentStyle={{ borderRadius: '16px', fontSize: '13px', padding: '10px 14px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between p-2 rounded-xl bg-gray-50/70">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="font-bold text-gray-800 truncate">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="font-black text-gray-900">{cat.value}%</span>
                      <span className="text-gray-500 font-semibold">({formatFCFA(cat.revenue)})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Section: Produits en Rupture & Alertes Stock (Always visible, especially critical for Magasinier) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-red-100 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-[#d91f26] flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900">
                Produits en rupture & Alertes de stock
              </h2>
              <p className="text-xs text-gray-500">
                {outOfStockProducts.length} article(s) en rupture totale • {lowStockAlerts.length} article(s) proches du seuil critique
              </p>
            </div>
          </div>

          <Link
            to="/stocks"
            className="self-start sm:self-auto bg-red-50 hover:bg-red-100 text-[#d91f26] border border-red-200 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Gestion du Stock</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {outOfStockProducts.length === 0 && lowStockAlerts.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs font-medium">
            <Package className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
            <span>Tous les produits disposent d'un niveau de stock suffisant.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {outOfStockProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-2xl bg-red-50/60 border border-red-200 flex items-center justify-between gap-3 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-[#d91f26] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
                  RUPTURE
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={getProductImage(product.name)}
                    alt={product.name}
                    className="w-11 h-11 object-cover rounded-xl border border-red-200 bg-white shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs text-gray-900 truncate">{product.name}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">{product.code} • {product.category}</p>
                    <p className="text-[11px] font-black text-[#d91f26] mt-1">Stock: 0 {product.unit}</p>
                  </div>
                </div>
                <button
                  onClick={() => openModal('adjust_stock')}
                  className="bg-white hover:bg-red-50 text-[#d91f26] border border-red-200 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                  title="Réapprovisionner"
                >
                  + Stock
                </button>
              </div>
            ))}

            {lowStockAlerts.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between gap-3 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
                  STOCK FAIBLE
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={getProductImage(product.name)}
                    alt={product.name}
                    className="w-11 h-11 object-cover rounded-xl border border-amber-200 bg-white shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs text-gray-900 truncate">{product.name}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">{product.code} • {product.category}</p>
                    <p className="text-[11px] font-black text-amber-700 mt-1">Stock: {product.stock} {product.unit} (Seuil: {product.minStock})</p>
                  </div>
                </div>
                <button
                  onClick={() => openModal('adjust_stock')}
                  className="bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                  title="Réapprovisionner"
                >
                  + Stock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Magasinier Section: Recent Purchase Orders for Stock Control */}
      {isMagasinier && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900">Bons de commande d'achats attendus</h2>
              <p className="text-xs text-gray-400">Pour contrôle de la marchandise lors de la réception aux quais</p>
            </div>
            <Link to="/achats" className="text-xs font-bold text-[#0942a6] hover:underline">
              Consulter tous les achats →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 pr-2">Réf. Bon</th>
                  <th className="pb-3 px-2">Fournisseur</th>
                  <th className="pb-3 px-2">Date Commande</th>
                  <th className="pb-3 px-2 text-center">Nombre d'articles</th>
                  <th className="pb-3 pl-2 text-right">Statut Livraison</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium">
                {purchases.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 pr-2 font-bold text-gray-900">{p.facture}</td>
                    <td className="py-3.5 px-2 font-bold text-[#0942a6]">{p.supplierName}</td>
                    <td className="py-3.5 px-2 text-gray-500">{p.date}</td>
                    <td className="py-3.5 px-2 text-center font-bold text-gray-800">{p.itemsCount} articles</td>
                    <td className="py-3.5 pl-2 text-right">
                      <Badge variant="payee">Reçue & Contrôlée</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Section Top 10 Produits & Top 10 Clients for non-Magasinier */}
      {!isMagasinier && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Top 10 Produits (6 Cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-gray-100/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0942a6] flex items-center justify-center font-bold">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-gray-900">Top 10 Produits</h2>
                    <p className="text-xs text-gray-400">Palmarès des meilleures ventes en volume</p>
                  </div>
                </div>
                <Link to="/produits" className="text-xs font-bold text-[#0942a6] hover:underline">
                  Voir tous →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="pb-3 pr-2 w-8">#</th>
                      <th className="pb-3 px-2">Produit</th>
                      <th className="pb-3 px-2 text-center">Vendus</th>
                      <th className="pb-3 pl-2 text-right">Chiffre d'affaires</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-medium">
                    {top10Products.map((p, index) => (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 pr-2">
                          <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                            index === 0 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            index === 1 ? 'bg-gray-200 text-gray-800' :
                            index === 2 ? 'bg-amber-50 text-amber-900' : 'text-gray-400 font-bold'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={getProductImage(p.name)}
                              alt={p.name}
                              className="w-8 h-8 object-cover rounded-lg border border-gray-100 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 truncate">{p.name}</p>
                              <p className="text-[10px] text-gray-400">{p.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center font-extrabold text-[#0942a6]">
                          {p.unitsSold}
                        </td>
                        <td className="py-3 pl-2 text-right font-black text-gray-900">
                          {formatFCFA(p.totalRevenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top 10 Clients (6 Cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-gray-100/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-gray-900">Top 10 Clients</h2>
                    <p className="text-xs text-gray-400">Classement des plus grands acheteurs</p>
                  </div>
                </div>
                <Link to="/clients" className="text-xs font-bold text-[#0942a6] hover:underline">
                  Voir tous →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="pb-3 pr-2 w-8">#</th>
                      <th className="pb-3 px-2">Client</th>
                      <th className="pb-3 px-2">Ville</th>
                      <th className="pb-3 pl-2 text-right">Total Achats</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-medium">
                    {top10Clients.map((client, index) => (
                      <tr key={client.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 pr-2">
                          <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                            index === 0 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            index === 1 ? 'bg-gray-200 text-gray-800' :
                            index === 2 ? 'bg-amber-50 text-amber-900' : 'text-gray-400 font-bold'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-bold text-gray-900">{client.name}</p>
                            <p className="text-[10px] text-gray-400">{client.code}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-gray-600 font-semibold">{client.city}</td>
                        <td className="py-3 pl-2 text-right font-black text-[#d91f26]">
                          {formatFCFA(client.totalSpent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Section Actions Rapides & Dernières Ventes (Adapted to Role) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Actions Rapides selon Rôle */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-gray-100/90 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-5">Actions Rapides</h2>
            <div className="grid grid-cols-2 gap-3.5">
              {/* Magasinier quick actions */}
              {isMagasinier ? (
                <>
                  <button
                    onClick={() => openModal('adjust_stock')}
                    className="p-4 bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <Warehouse className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-amber-900">Ajuster le stock</span>
                  </button>

                  <Link
                    to="/produits"
                    className="p-4 bg-blue-50/60 hover:bg-blue-100/80 border border-blue-100 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0942a6] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <Package className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-[#0942a6]">Fiches produits</span>
                  </Link>

                  <Link
                    to="/achats"
                    className="p-4 bg-purple-50/60 hover:bg-purple-100/80 border border-purple-100 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center transition-all group cursor-pointer col-span-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <Truck className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-purple-900">Contrôle réceptions achats</span>
                  </Link>
                </>
              ) : isVendeur ? (
                /* Vendeur quick actions */
                <>
                  <button
                    onClick={() => openModal('add_sale')}
                    className="p-4 bg-red-50/60 hover:bg-red-100/80 border border-red-100 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#d91f26] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <ShoppingCart className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-[#d91f26]">Nouvelle vente</span>
                  </button>

                  <button
                    onClick={() => openModal('add_client')}
                    className="p-4 bg-blue-50/60 hover:bg-blue-100/80 border border-blue-100 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0942a6] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <UserPlus className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-[#0942a6]">Nouveau client</span>
                  </button>

                  <Link
                    to="/produits"
                    className="p-4 bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-100 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center transition-all group cursor-pointer col-span-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <Barcode className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-emerald-900">Vérifier prix & code-barres</span>
                  </Link>
                </>
              ) : isDirecteur ? (
                /* Directeur quick actions */
                <>
                  <button
                    onClick={() => openModal('generate_report')}
                    className="p-4 bg-blue-50/60 hover:bg-blue-100/80 border border-blue-100 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0942a6] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-[#0942a6]">Générer rapport</span>
                  </button>

                  <Link
                    to="/statistiques"
                    className="p-4 bg-red-50/60 hover:bg-red-100/80 border border-red-100 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#d91f26] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <BarChart2 className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-[#d91f26]">Statistiques & Marges</span>
                  </Link>

                  <Link
                    to="/rapports"
                    className="p-4 bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-100 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center transition-all group cursor-pointer col-span-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <Award className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-emerald-900">Audit financier & Bilans de caisses</span>
                  </Link>
                </>
              ) : (
                /* Admin quick actions */
                <>
                  <button
                    onClick={() => openModal('add_sale')}
                    className="p-4 bg-red-50/60 hover:bg-red-100/80 border border-red-100 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#d91f26] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <ShoppingCart className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-[#d91f26]">Nouvelle vente</span>
                  </button>

                  <button
                    onClick={() => openModal('add_client')}
                    className="p-4 bg-blue-50/60 hover:bg-blue-100/80 border border-blue-100 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0942a6] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <UserPlus className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-[#0942a6]">Nouveau client</span>
                  </button>

                  <button
                    onClick={() => openModal('add_purchase')}
                    className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <Truck className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">Nouvel achat</span>
                  </button>

                  <button
                    onClick={() => openModal('adjust_stock')}
                    className="p-4 bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <Warehouse className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-amber-900">Ajuster stock</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dernières ventes (8 Cols, for non-Magasinier) */}
        {!isMagasinier ? (
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-gray-100/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Dernières transactions</h2>
                  <p className="text-xs text-gray-400">Flux récent des ventes en caisse</p>
                </div>
                <Link to="/ventes" className="text-xs font-bold text-[#0942a6] hover:underline">
                  Voir toutes les ventes →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="pb-3.5 pr-2">N° Facture</th>
                      <th className="pb-3.5 px-2">Client</th>
                      <th className="pb-3.5 px-2">Paiement</th>
                      <th className="pb-3.5 px-2">Montant</th>
                      <th className="pb-3.5 pl-2 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-medium">
                    {sales.slice(0, 5).map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 pr-2 font-bold text-gray-900">{sale.facture}</td>
                        <td className="py-3.5 px-2 text-gray-700 font-semibold">{sale.clientName}</td>
                        <td className="py-3.5 px-2 text-gray-500">{sale.paymentMethod}</td>
                        <td className="py-3.5 px-2 font-black text-[#d91f26]">
                          {formatFCFA(sale.amount)}
                        </td>
                        <td className="py-3.5 pl-2 text-right">
                          <Badge variant="payee">Payée</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Magasinier Stock Activity Log (8 Cols) */
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-gray-100/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Derniers mouvements de stock</h2>
                  <p className="text-xs text-gray-400">Journal d'entrée et sortie en magasin</p>
                </div>
                <Link to="/stocks" className="text-xs font-bold text-[#0942a6] hover:underline">
                  Voir tout le registre →
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { ref: 'MVT-00912', item: 'Lait Bonnet Rouge 1kg', type: 'Entrée (Achat)', qty: '+150 boîtes', date: 'Aujourd’hui 08:30', author: 'N’Dri Eric' },
                  { ref: 'MVT-00911', item: 'Huile Dinor 5L', type: 'Sortie (Vente Rayon)', qty: '-24 bidons', date: 'Hier 17:15', author: 'Gboho Charles' },
                  { ref: 'MVT-00910', item: 'Riz Oncle Sam 5kg', type: 'Entrée (Achat)', qty: '+200 sacs', date: 'Hier 14:00', author: 'N’Dri Eric' },
                  { ref: 'MVT-00909', item: 'Sucre Saint Louis 1kg', type: 'Ajustement Inventaire', qty: '-5 paquets', date: '28 Mai 11:20', author: 'Gboho Charles' },
                ].map((mvt) => (
                  <div key={mvt.ref} className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{mvt.item}</span>
                        <span className="text-[10px] font-semibold text-gray-400">({mvt.ref})</span>
                      </div>
                      <p className="text-gray-500 text-[11px] mt-0.5">{mvt.type} • Par {mvt.author} • {mvt.date}</p>
                    </div>
                    <span className={`font-black text-xs px-2.5 py-1 rounded-xl ${
                      mvt.qty.startsWith('+') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {mvt.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer copyright */}
      <footer className="pt-8 border-t border-gray-200/60 text-center text-xs text-gray-400 font-medium">
        © 2024 Carrefour Supermarché Côte d'Ivoire. Tous droits réservés.
      </footer>
    </div>
  );
};

