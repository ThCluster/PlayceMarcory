import React, { useState } from 'react';
import { FileText, Download, Calendar, ArrowRight, Filter, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RapportsPage: React.FC = () => {
  const { openModal, sales, products, purchases } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const reportTemplates = [
    { title: 'Rapport Journalier des Caisses', desc: 'Synthèse des recettes, espèces, Orange Money, Wave et encaissements.', date: 'Mis à jour quotidiennement', category: 'Caisses' },
    { title: 'Bilan Mensuel des Ventes & Marges', desc: 'Ventilation par catégorie de produit, marges bénéficiaires et taux de rotation.', date: 'Septembre 2026', category: 'Finances' },
    { title: 'État des Stocks & Valorisation Global', desc: 'Inventaire complet, valeur financière globale du stock et seuils critiques.', date: '05 Septembre 2026', category: 'Stocks' },
    { title: 'Rapport d’Achats & Fournisseurs', desc: 'Détail des réapprovisionnements, factures fournisseurs et volumes reçus.', date: 'Septembre 2026', category: 'Achats' },
    { title: 'Audit de Solvabilité & Encaissements', desc: 'Ventilation des modes de paiement et rapprochements comptables.', date: 'Hebdomadaire', category: 'Finances' },
    { title: 'Bilan de Fréquentation & Clients Fidèles', desc: 'Statistiques sur les transactions enregistrées et paniers moyens.', date: 'Mensuel', category: 'Ventes' },
  ];

  const exportReport = (title: string, category: string) => {
    let csvContent = '';
    const cleanFilename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (category === 'Caisses' || category === 'Ventes') {
      csvContent = 'Facture;Client;Vendeuse;Date;Heure;Mode Paiement;Articles;Montant Total FCFA;Statut\n';
      sales.forEach((s) => {
        const itemDetails = (s.items || [])
          .map((i) => `${i.productName} (x${i.quantity})`)
          .join(' | ');
        csvContent += `"${s.facture}";"${s.clientName}";"${s.vendeuseName || 'Marie Kassi'}";"${s.date}";"${s.time || ''}";"${s.paymentMethod}";"${itemDetails}";${s.amount};"${s.status}"\n`;
      });
    } else if (category === 'Stocks') {
      csvContent = 'Code;Produit;Rayon;Stock Actuel;Unite;Seuil Min;Prix Vente;Cout Achat;Valeur Totale Stock FCFA\n';
      products.forEach((p) => {
        csvContent += `"${p.code}";"${p.name}";"${p.category}";${p.stock};"${p.unit}";${p.minStock};${p.price};${p.cost};${p.stock * p.price}\n`;
      });
    } else if (category === 'Achats') {
      csvContent = 'Facture Achat;Fournisseur;Date Commande;Nombre Articles;Montant Total FCFA;Statut\n';
      purchases.forEach((p) => {
        csvContent += `"${p.facture}";"${p.supplierName}";"${p.date}";${p.itemsCount};${p.amount};"${p.status}"\n`;
      });
    } else {
      const totalCA = sales.reduce((sum, s) => sum + s.amount, 0);
      const totalAchats = purchases.reduce((sum, p) => sum + p.amount, 0);
      csvContent = 'Indicateur;Valeur\n';
      csvContent += `"Chiffre d'Affaires Global";"${totalCA} FCFA"\n`;
      csvContent += `"Total Depenses Achats";"${totalAchats} FCFA"\n`;
      csvContent += `"Marge Brute";"${totalCA - totalAchats} FCFA"\n`;
      csvContent += `"Nombre de Ventes Caisses";"${sales.length}"\n`;
      csvContent += `"Nombre d'Articles en Rayon";"${products.length}"\n`;
    }

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', cleanFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Fichier ${cleanFilename} exporté avec succès.`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const filteredReports = reportTemplates.filter(
    (r) => selectedCategory === 'Tous' || r.category === selectedCategory
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-[#0942a6] font-bold text-xs px-3 py-1 rounded-full">
              Espace Direction & Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            Rapports Comptables & Audit
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Génération et exportation des bilans financiers réels en format tabulaire CSV.
          </p>
        </div>

        <button
          onClick={() => openModal('generate_report')}
          className="flex items-center gap-2 bg-[#0942a6] hover:bg-blue-800 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer self-start md:self-auto"
        >
          <FileText className="w-4.5 h-4.5" />
          <span>Formulaire de rapport sur-mesure</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Interactive Form Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
          <Filter className="w-4 h-4 text-[#0942a6]" />
          <span>Filtrer les modèles par domaine :</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          {['Tous', 'Caisses', 'Finances', 'Stocks', 'Achats', 'Ventes'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0942a6] text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((rep, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0942a6] flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-[#0942a6] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  {rep.category}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">{rep.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{rep.desc}</p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-4 pt-3 border-t border-gray-100">
                <Calendar className="w-3.5 h-3.5" />
                <span>Période : {rep.date}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  Format CSV / Excel
                </span>
                <button
                  onClick={() => exportReport(rep.title, rep.category)}
                  className="flex items-center gap-2 text-xs font-bold bg-[#0942a6] hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exporter</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
