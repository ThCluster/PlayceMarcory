// Serice de récupération des données métier depuis le backend Django,
// avec transformation des schémas backend vers les types frontend.
import { api } from './client';
import type {
  Client, Employee, Supplier, Category, Product,
  Sale, SaleItem, Purchase, PaymentRecord, StockMovement, PaymentMethod,
} from '../types';

// ---- Helpers ----
const fmtId = (n: number | string) => String(n);
const fmtNom = (nom: string, prenom?: string) => `${prenom ? prenom + ' ' : ''}${nom}`.trim();
const fmtDate = (d: string) => {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
const fmtHeure = (d: string) => {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return '';
  return dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const mapStatutVente = (statut: string): Sale['status'] => {
  const s = statut?.toLowerCase() ?? '';
  if (s === 'validee' || s === 'validée') return 'Payée';
  if (s === 'en_attente' || s === 'en cours') return 'En attente';
  if (s === 'annulee' || s === 'annulée') return 'Annulée';
  return 'En attente';
};

const mapMethod = (mode: string): PaymentMethod => {
  const m = mode?.toLowerCase() ?? '';
  if (m.includes('carte')) return 'Carte';
  if (m.includes('wave')) return 'Wave';
  if (m.includes('orange') || m.includes('momo')) return 'Orange Money';
  if (m.includes('moov')) return 'Moov Money';
  return 'Espèces';
};

const colors = ['#e63946', '#0942a6', '#f4a261', '#2a9d8f', '#e9c46a', '#8ab17d', '#b5838d', '#6d597a'];

// ---- Clients ----
export async function fetchClients(): Promise<Client[]> {
  const data: any = await api.get('/clients/');
  const list = Array.isArray(data) ? data : data?.results ?? [];
  return list.map((c: any) => ({
    id: fmtId(c.id_client),
    code: `CLT-${String(c.id_client).padStart(3, '0')}`,
    name: fmtNom(c.nom, c.prenom),
    phone: c.telephone ?? '',
    email: c.email ?? '',
    city: c.adresse ?? '',
    totalSpent: Number(c.montant_alloue ?? 0),
    lastPurchaseDate: '',
    status: c.actif ? 'Actif' : 'Inactif',
  }));
}

// ---- Employés ----
export async function fetchEmployees(): Promise<Employee[]> {
  const data: any = await api.get('/utilisateurs/');
  const list = Array.isArray(data) ? data : data?.results ?? [];
  return list.map((u: any) => ({
    id: fmtId(u.id_employe),
    code: `EMP-${String(u.id_employe).padStart(3, '0')}`,
    name: fmtNom(u.nom, u.prenom),
    role: u.poste,
    department: 'Magasin',
    email: u.email ?? '',
    phone: '',
    status: u.actif ? 'Actif' : 'Inactif',
  }));
}

// ---- Fournisseurs ----
export async function fetchSuppliers(): Promise<Supplier[]> {
  const data: any = await api.get('/fournisseurs/');
  const list = Array.isArray(data) ? data : data?.results ?? [];
  return list.map((f: any) => ({
    id: fmtId(f.id_fournisseur),
    code: `FRS-${String(f.id_fournisseur).padStart(3, '0')}`,
    name: f.nom_entreprise ?? '',
    contact: f.contact_nom ?? '',
    phone: f.telephone ?? '',
    email: f.email ?? '',
    address: f.adresse ?? '',
    totalPurchases: Number(f.total_achats ?? 0),
  }));
}

// ---- Produits (catalogue) ----
export async function fetchProducts(): Promise<Product[]> {
  const data: any = await api.get('/produits/');
  const list = Array.isArray(data) ? data : data?.results ?? [];
  return list.map((p: any) => ({
    id: fmtId(p.id_produit),
    code: p.code_barre ?? `P-${p.id_produit}`,
    name: p.nom ?? '',
    category: p.categorie ?? '',
    price: Number(p.prix_vente ?? 0),
    cost: Number(p.prix_achat ?? 0),
    stock: Number(p.quantite_actuelle ?? 0),
    minStock: Number(p.seuil_alerte ?? 0),
    unit: p.unite_mesure ?? '',
  }));
}

// ---- Vues stock (quantités) ----
export async function fetchStock(): Promise<Record<string, number>> {
  const data: any = await api.get('/stock/');
  const list = Array.isArray(data) ? data : data?.results ?? [];
  const map: Record<string, number> = {};
  for (const s of list) {
    map[fmtId(s.id_produit)] = Number(s.quantite_actuelle ?? 0);
  }
  return map;
}

// ---- Catégories (calculées depuis les produits) ----
export async function fetchCategories(products: Product[]): Promise<Category[]> {
  if (!products.length) return [];
  const revenueByCat: Record<string, number> = {};
  const countByCat: Record<string, number> = {};
  for (const p of products) {
    revenueByCat[p.category] = (revenueByCat[p.category] ?? 0) + p.price * p.stock;
    countByCat[p.category] = (countByCat[p.category] ?? 0) + 1;
  }
  const total = Object.values(revenueByCat).reduce((a, b) => a + b, 0) || 1;
  let i = 0;
  return Object.entries(revenueByCat).map(([name, revenue]) => ({
    id: String(i + 1),
    name,
    color: colors[i++ % colors.length],
    percentage: Math.round((revenue / total) * 100),
    revenue,
    productCount: countByCat[name] ?? 0,
  }));
}

// ---- Ventes ----
export async function fetchSales(): Promise<Sale[]> {
  const data: any = await api.get('/ventes/');
  const list = Array.isArray(data) ? data : data?.results ?? [];
  const sales: Sale[] = [];
  for (const v of list) {
    // La vue backend fournit déjà le nombre de produits ; on peut afficher la
    // liste sans appeler /lignes/ (on ne charge les articles que sur le détail).
    sales.push({
      id: fmtId(v.id_vente),
      facture: `VTE-${String(v.id_vente).padStart(6, '0')}`,
      clientName: v.client ?? 'Client',
      clientId: v.id_client ? fmtId(v.id_client) : undefined,
      vendeuseName: v.employe ?? '',
      amount: Number(v.montant_total ?? 0),
      date: fmtDate(v.date_vente),
      time: fmtHeure(v.date_vente),
      status: mapStatutVente(v.statut),
      itemsCount: Number(v.quantite_totale ?? 0),
      paymentMethod: 'Espèces',
      items: [],
    });
  }
  return sales;
}

// ---- Achats (réapprovisionnements fournisseurs) ----
export async function fetchPurchases(): Promise<Purchase[]> {
  const data: any = await api.get('/achats/');
  const list = Array.isArray(data) ? data : data?.results ?? [];
  return list.map((a: any) => ({
    id: fmtId(a.id_achat),
    facture: `ACH-${String(a.id_achat).padStart(6, '0')}`,
    fournisseur: a.fournisseur ?? `Fournisseur ${a.id_fournisseur}`,
    amount: Number(a.montant_total ?? 0),
    date: fmtDate(a.date_achat),
    status: (a.statut === 'validee' ? 'Reçu'
      : a.statut === 'en_attente' ? 'En commande'
      : a.statut === 'annulee' ? 'Annulé'
      : 'Reçu') as Purchase['status'],
    itemsCount: Number(a.articles ?? 0),
  }));
}

// ---- Paiements ----
export async function fetchPayments(): Promise<PaymentRecord[]> {
  const data: any = await api.get('/paiements/');
  const list = Array.isArray(data) ? data : data?.results ?? [];
  return list.map((p: any) => ({
    id: fmtId(p.id_paiement),
    reference: p.reference_externe ?? `PAY-${p.id_paiement}`,
    type: (p.type_paiement === 'fournisseur' || p.type_paiement === 'depense')
      ? 'Dépense' : 'Recette',
    partyName: p.tiers ?? '',
    amount: Number(p.montant ?? 0),
    date: fmtDate(p.date_paiement),
    method: mapMethod(p.mode_paiement),
    notes: p.observation ?? '',
  }));
}

// ---- Mouvements de stock (historique réel) ----
export async function fetchStockMovements(): Promise<StockMovement[]> {
  const data: any = await api.get('/mouvements-stock/');
  const list = Array.isArray(data) ? data : data?.results ?? [];
  const mapType = (t: string): StockMovement['type'] => {
    const x = t?.toLowerCase() ?? '';
    if (x.includes('entree') || x.includes('entrée')) return 'Entrée';
    if (x.includes('sortie')) return 'Sortie';
    return 'Ajustement';
  };
  return list.map((s: any) => ({
    id: fmtId(s.id_mouvement),
    date: fmtDate(s.date_mouvement),
    productName: s.produit ?? `Produit ${s.id_produit}`,
    type: mapType(s.type_mouvement),
    quantity: Number(s.quantite_mouvement ?? 0),
    author: s.source === 'auto' ? 'Système' : s.source ?? 'Système',
    reason: `${s.type_mouvement ?? ''} (${s.quantite_avant ?? 0} -> ${s.quantite_apres ?? 0})`,
  }));
}

// ---- Ventes agrégées par produit (Top produits + répartition catégorie) ----
export interface SalesByProduct {
  nom: string;
  categorie: string;
  quantite: number;
  montant: number;
}

export async function fetchSalesByProduct(): Promise<SalesByProduct[]> {
  const data: any = await api.get('/ventes/recap-produits/');
  const list = Array.isArray(data) ? data : data?.results ?? [];
  return list.map((r: any) => ({
    nom: r.nom ?? '',
    categorie: r.categorie ?? 'Autres',
    quantite: Number(r.quantite ?? 0),
    montant: Number(r.montant ?? 0),
  }));
}

// ---- Statistiques ----
export interface MonthlyStat {
  periode: string;
  chiffre_affaires: number;
  nombre_ventes: number;
  panier_moyen: number;
  marge_brute_estimee: number;
}

export async function fetchMonthlyStats(): Promise<MonthlyStat[]> {
  const data: any = await api.get('/statistiques/mensuelles/');
  const list = Array.isArray(data) ? data : data?.results ?? [];
  return list.map((s: any) => ({
    periode: s.periode ? String(s.periode) : '',
    chiffre_affaires: Number(s.chiffre_affaires ?? 0),
    nombre_ventes: Number(s.nombre_ventes ?? 0),
    panier_moyen: Number(s.panier_moyen ?? 0),
    marge_brute_estimee: Number(s.marge_brute_estimee ?? 0),
  }));
}

// ---- Chargement global ----
export async function loadAllData() {
  const [clients, employees, suppliers, products, stockMap, sales, payments] = await Promise.all([
    fetchClients(),
    fetchEmployees(),
    fetchSuppliers(),
    fetchProducts(),
    fetchStock().catch(() => ({})),
    fetchSales().catch(() => [] as Sale[]),
    fetchPayments().catch(() => [] as PaymentRecord[]),
  ]);

  // Injecter les quantités de stock dans les produits
  const productsWithStock = products.map((p) => ({
    ...p,
    stock: stockMap[p.id] ?? p.stock,
  }));

  const categories = await fetchCategories(productsWithStock);
  const stockMovements = await fetchStockMovements().catch(() => [] as StockMovement[]);
  const purchases = await fetchPurchases();
  const salesByProduct = await fetchSalesByProduct().catch(() => [] as SalesByProduct[]);

  return {
    clients,
    employees,
    suppliers,
    products: productsWithStock,
    categories,
    sales,
    purchases,
    payments,
    stockMovements,
    salesByProduct,
  };
}

// ---------------------------------------------------------------------
// ÉCRITURES (connexion au backend) — chaque action appelle le backend.
// ---------------------------------------------------------------------

export async function creerClient(input: {
  nom: string; prenom: string; telephone?: string; email?: string; adresse?: string;
}): Promise<any> {
  return api.post('/clients/', input);
}

export async function creerVente(idClient: number): Promise<{ id_vente: number }> {
  return api.post('/ventes/', { id_client: idClient });
}

export async function ajouterLigneVente(idVente: number, idProduit: number, quantite: number): Promise<any> {
  return api.post(`/ventes/${idVente}/ajouter_ligne/`, { id_produit: idProduit, quantite });
}

export async function validerVente(idVente: number): Promise<any> {
  return api.post(`/ventes/${idVente}/valider/`);
}

export async function creerProduit(input: {
  id_categorie: number; nom: string; prix_achat: number; prix_vente: number;
  seuil_alerte?: number; code_barre?: string; unite_mesure?: string;
}): Promise<any> {
  return api.post('/produits/', input);
}

export interface CategorieRef {
  id_categorie: number;
  nom: string;
}

export async function fetchCategoriesBackend(): Promise<CategorieRef[]> {
  const data: any = await api.get('/produits/categories/');
  const list = Array.isArray(data) ? data : data?.results ?? [];
  return list.map((c: any) => ({ id_categorie: Number(c.id_categorie), nom: c.nom }));
}

export async function creerFournisseur(input: {
  nom_entreprise: string; contact_nom?: string; telephone?: string; email?: string; adresse?: string;
}): Promise<any> {
  return api.post('/fournisseurs/', input);
}

export async function enregistrerPaiementClient(input: {
  id_vente: number; montant: number; mode_paiement: string; reference_externe?: string;
}): Promise<{ id_paiement: number }> {
  return api.post('/paiements/clients/', input);
}

export async function enregistrerPaiementFournisseur(input: {
  id_achat: number; montant: number; mode_paiement: string; reference_externe?: string;
}): Promise<{ id_paiement: number }> {
  return api.post('/paiements/fournisseurs/', input);
}