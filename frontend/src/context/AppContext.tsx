import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Sale,
  Purchase,
  Product,
  Client,
  Supplier,
  Employee,
  Category,
  PaymentRecord,
  StockMovement,
  NotificationItem,
} from '../types';
import { loginBackend, logoutBackend } from '../api/client';
import { loadAllData } from '../api/services';

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  currentUser: { name: string; email: string; role: string; code?: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  // Data
  sales: Sale[];
  purchases: Purchase[];
  products: Product[];
  lowStockProducts: Product[];
  clients: Client[];
  suppliers: Supplier[];
  employees: Employee[];
  categories: Category[];
  payments: PaymentRecord[];
  stockMovements: StockMovement[];
  notifications: NotificationItem[];
  
  // Active date filter
  dateRange: string;
  setDateRange: (range: string) => void;

  // Search query
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Modals state
  activeModal: string | null;
  openModal: (modalName: string) => void;
  closeModal: () => void;

  // Actions
  addClient: (client: Omit<Client, 'id' | 'code' | 'totalSpent' | 'lastPurchaseDate'>) => void;
  addSale: (sale: Omit<Sale, 'id' | 'facture' | 'date' | 'time'>) => void;
  addPurchase: (purchase: Omit<Purchase, 'id' | 'facture' | 'date'>) => void;
  addProduct: (product: Omit<Product, 'id' | 'code'>) => void;
  addEmployee: (employee: Omit<Employee, 'id' | 'code'>) => void;
  updateEmployee: (id: string, updated: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'code' | 'totalPurchases'>) => void;
  deleteSupplier: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'revenue' | 'productCount'>) => void;
  deleteCategory: (id: string) => void;
  addPayment: (payment: Omit<PaymentRecord, 'id' | 'reference' | 'date'>) => void;
  adjustStock: (productId: string, newStock: number, reason: string) => void;
  markNotificationRead: (id: string) => void;
}

const initialSales: Sale[] = [
  {
    id: '1',
    facture: 'VTE-000125',
    clientName: 'Kouadio Jean',
    vendeuseName: 'Marie Kassi',
    amount: 97000,
    date: '29/05/2024',
    time: '14:32',
    status: 'Payée',
    itemsCount: 9,
    paymentMethod: 'Espèces',
    items: [
      { id: 'i1', productId: '4', productName: 'Riz 25 kg', quantity: 2, unitPrice: 20000, unit: 'Sac', subtotal: 40000 },
      { id: 'i2', productId: '1', productName: 'Huile 5 L', quantity: 3, unitPrice: 15000, unit: 'Bouteille', subtotal: 45000 },
      { id: 'i3', productId: '2', productName: 'Sucre 1 kg', quantity: 4, unitPrice: 3000, unit: 'Paquet', subtotal: 12000 },
    ],
  },
  {
    id: '2',
    facture: 'VTE-000124',
    clientName: 'Diarra Aissatou',
    vendeuseName: 'Marie Kassi',
    amount: 85000,
    date: '29/05/2024',
    time: '12:15',
    status: 'Payée',
    itemsCount: 45,
    paymentMethod: 'Orange Money',
    items: [
      { id: 'i4', productId: '3', productName: 'Lait entier 1L', quantity: 10, unitPrice: 1200, unit: 'Brique', subtotal: 12000 },
      { id: 'i5', productId: '9', productName: 'Eau Minérale 1.5L (Pack x6)', quantity: 15, unitPrice: 2200, unit: 'Pack', subtotal: 33000 },
      { id: 'i6', productId: '10', productName: 'Café Moulu 250g', quantity: 20, unitPrice: 2000, unit: 'Boîte', subtotal: 40000 },
    ],
  },
  {
    id: '3',
    facture: 'VTE-000123',
    clientName: 'Bamba Moussa',
    vendeuseName: 'Fatou Ouattara',
    amount: 210000,
    date: '29/05/2024',
    time: '10:45',
    status: 'Payée',
    itemsCount: 95,
    paymentMethod: 'Wave',
    items: [
      { id: 'i7', productId: '4', productName: 'Riz Parfumè 5kg', quantity: 10, unitPrice: 4500, unit: 'Sac', subtotal: 45000 },
      { id: 'i8', productId: '9', productName: 'Eau Minérale 1.5L (Pack x6)', quantity: 30, unitPrice: 2200, unit: 'Pack', subtotal: 66000 },
      { id: 'i9', productId: '7', productName: 'Lessive Poudre 1kg', quantity: 55, unitPrice: 1800, unit: 'Sachet', subtotal: 99000 },
    ],
  },
  {
    id: '4',
    facture: 'VTE-000122',
    clientName: 'Yao Koffi',
    vendeuseName: 'Marie Kassi',
    amount: 63000,
    date: '28/05/2024',
    time: '18:20',
    status: 'Payée',
    itemsCount: 80,
    paymentMethod: 'Espèces',
    items: [
      { id: 'i10', productId: '6', productName: 'Jus d’Orange Pure 1L', quantity: 30, unitPrice: 1100, unit: 'Bouteille', subtotal: 33000 },
      { id: 'i11', productId: '8', productName: 'Pâtes Spaghettis 500g', quantity: 50, unitPrice: 600, unit: 'Paquet', subtotal: 30000 },
    ],
  },
  {
    id: '5',
    facture: 'VTE-000121',
    clientName: 'Konan Mireille',
    vendeuseName: 'Marie Kassi',
    amount: 175000,
    date: '28/05/2024',
    time: '16:05',
    status: 'Payée',
    itemsCount: 202,
    paymentMethod: 'Carte',
    items: [
      { id: 'i12', productId: '11', productName: 'Papier Hygiénique (Pack x12)', quantity: 30, unitPrice: 2500, unit: 'Pack', subtotal: 75000 },
      { id: 'i13', productId: '12', productName: 'Dentifrice Fluor 100ml', quantity: 40, unitPrice: 850, unit: 'Tube', subtotal: 34000 },
      { id: 'i14', productId: '13', productName: 'Sardines à l’huile 125g', quantity: 132, unitPrice: 500, unit: 'Boîte', subtotal: 66000 },
    ],
  },
];

const initialPurchases: Purchase[] = [
  { id: '1', facture: 'ACH-000089', fournisseur: 'Sodexci', amount: 450000, date: '29/05/2024', status: 'Reçu', itemsCount: 15 },
  { id: '2', facture: 'ACH-000088', fournisseur: 'Global Food', amount: 250000, date: '29/05/2024', status: 'Reçu', itemsCount: 10 },
  { id: '3', facture: 'ACH-000087', fournisseur: 'Afridis', amount: 150000, date: '28/05/2024', status: 'Reçu', itemsCount: 6 },
  { id: '4', facture: 'ACH-000086', fournisseur: 'CFAO Distribution', amount: 320000, date: '28/05/2024', status: 'Reçu', itemsCount: 12 },
  { id: '5', facture: 'ACH-000085', fournisseur: 'Ivoire Fournitures', amount: 180000, date: '27/05/2024', status: 'Reçu', itemsCount: 8 },
];

const initialProducts: Product[] = [
  { id: '1', code: 'PRD-001', name: 'Huile végétale 1L', category: 'Alimentation', price: 1500, cost: 1100, stock: 0, minStock: 15, unit: 'Bouteille' },
  { id: '2', code: 'PRD-002', name: 'Sucre Poudre 1kg', category: 'Alimentation', price: 900, cost: 650, stock: 8, minStock: 20, unit: 'Paquet' },
  { id: '3', code: 'PRD-003', name: 'Lait entier 1L', category: 'Boissons', price: 1200, cost: 850, stock: 0, minStock: 20, unit: 'Brique' },
  { id: '4', code: 'PRD-004', name: 'Riz Parfumè 5kg', category: 'Alimentation', price: 4500, cost: 3400, stock: 7, minStock: 15, unit: 'Sac' },
  { id: '5', code: 'PRD-005', name: 'Savon de Toilette 250g', category: 'Hygiène', price: 400, cost: 250, stock: 0, minStock: 25, unit: 'Unité' },
  { id: '6', code: 'PRD-006', name: 'Jus d’Orange Pure 1L', category: 'Boissons', price: 1100, cost: 750, stock: 48, minStock: 15, unit: 'Bouteille' },
  { id: '7', code: 'PRD-007', name: 'Lessive Poudre 1kg', category: 'Entretien', price: 1800, cost: 1300, stock: 32, minStock: 10, unit: 'Sachet' },
  { id: '8', code: 'PRD-008', name: 'Pâtes Spaghettis 500g', category: 'Alimentation', price: 600, cost: 400, stock: 95, minStock: 30, unit: 'Paquet' },
  { id: '9', code: 'PRD-009', name: 'Eau Minérale 1.5L (Pack x6)', category: 'Boissons', price: 2200, cost: 1500, stock: 120, minStock: 25, unit: 'Pack' },
  { id: '10', code: 'PRD-010', name: 'Café Moulu 250g', category: 'Alimentation', price: 1700, cost: 1200, stock: 3, minStock: 15, unit: 'Boîte' },
  { id: '11', code: 'PRD-011', name: 'Papier Hygiénique (Pack x12)', category: 'Hygiène', price: 2500, cost: 1800, stock: 0, minStock: 10, unit: 'Pack' },
  { id: '12', code: 'PRD-012', name: 'Dentifrice Fluor 100ml', category: 'Hygiène', price: 850, cost: 550, stock: 64, minStock: 15, unit: 'Tube' },
  { id: '13', code: 'PRD-013', name: 'Sardines à l’huile 125g', category: 'Alimentation', price: 500, cost: 350, stock: 110, minStock: 40, unit: 'Boîte' },
  { id: '14', code: 'PRD-014', name: 'Biscuits au Chocolat 200g', category: 'Alimentation', price: 750, cost: 500, stock: 52, minStock: 20, unit: 'Paquet' },
];

const initialClients: Client[] = [
  { id: '1', code: 'CLT-001', name: 'Kouadio Jean', phone: '+225 07 08 12 34 56', email: 'j.kouadio@email.ci', city: 'Abidjan', totalSpent: 3450000, lastPurchaseDate: '29/05/2024', status: 'Actif' },
  { id: '2', code: 'CLT-002', name: 'Bamba Moussa', phone: '+225 01 02 33 44 55', email: 'm.bamba@email.ci', city: 'Bouaké', totalSpent: 2850000, lastPurchaseDate: '29/05/2024', status: 'Actif' },
  { id: '3', code: 'CLT-003', name: 'Konan Mireille', phone: '+225 05 11 22 33 44', email: 'm.konan@email.ci', city: 'San-Pédro', totalSpent: 2200000, lastPurchaseDate: '28/05/2024', status: 'Actif' },
  { id: '4', code: 'CLT-004', name: 'Diarra Aissatou', phone: '+225 05 44 89 21 00', email: 'a.diarra@email.ci', city: 'Abidjan', totalSpent: 1950000, lastPurchaseDate: '29/05/2024', status: 'Actif' },
  { id: '5', code: 'CLT-005', name: 'Traoré Ibrahim', phone: '+225 07 45 88 12 00', email: 'i.traore@email.ci', city: 'Korhogo', totalSpent: 1680000, lastPurchaseDate: '27/05/2024', status: 'Actif' },
  { id: '6', code: 'CLT-006', name: 'Soro Guillaume', phone: '+225 05 66 77 88 99', email: 'g.soro@email.ci', city: 'Ferké', totalSpent: 1420000, lastPurchaseDate: '26/05/2024', status: 'Actif' },
  { id: '7', code: 'CLT-007', name: 'Yao Koffi', phone: '+225 07 77 66 55 44', email: 'k.yao@email.ci', city: 'Yamoussoukro', totalSpent: 1250000, lastPurchaseDate: '28/05/2024', status: 'Actif' },
  { id: '8', code: 'CLT-008', name: 'Bakayoko Aminata', phone: '+225 01 99 88 77 66', email: 'a.bakayoko@email.ci', city: 'Abidjan', totalSpent: 1100000, lastPurchaseDate: '25/05/2024', status: 'Actif' },
  { id: '9', code: 'CLT-009', name: 'Diallo Ousmane', phone: '+225 07 33 22 11 00', email: 'o.diallo@email.ci', city: 'Daloa', totalSpent: 980000, lastPurchaseDate: '24/05/2024', status: 'Actif' },
  { id: '10', code: 'CLT-010', name: 'N’Guessan Sylvie', phone: '+225 05 22 33 44 55', email: 's.nguessan@email.ci', city: 'Grand-Bassam', totalSpent: 850000, lastPurchaseDate: '23/05/2024', status: 'Actif' },
];

const initialSuppliers: Supplier[] = [
  { id: '1', code: 'FRS-001', name: 'Sodexci', contact: 'M. Soro', phone: '+225 27 21 00 11', email: 'contact@sodexci.ci', address: 'Zone Industrielle Yopougon, Abidjan', totalPurchases: 4500000 },
  { id: '2', code: 'FRS-002', name: 'Global Food', contact: 'Mme. Traoré', phone: '+225 27 22 33 44', email: 'commercial@globalfood.ci', address: 'Treichville, Abidjan', totalPurchases: 3200000 },
  { id: '3', code: 'FRS-003', name: 'Afridis', contact: 'M. Diallo', phone: '+225 27 23 55 66', email: 'ventes@afridis.ci', address: 'Koumassi, Abidjan', totalPurchases: 1800000 },
  { id: '4', code: 'FRS-004', name: 'CFAO Distribution', contact: 'M. Brou', phone: '+225 27 20 11 22', email: 'info@cfao-dist.ci', address: 'Marcory Zone 4, Abidjan', totalPurchases: 6400000 },
  { id: '5', code: 'FRS-005', name: 'Ivoire Fournitures', contact: 'Mme. Bakayoko', phone: '+225 27 24 88 99', email: 'contact@ivoire-fournitures.ci', address: 'Plateau, Abidjan', totalPurchases: 2100000 },
];

const initialEmployees: Employee[] = [
  { id: '1', code: 'EMP-001', name: 'Alain Banny', role: 'Administrateur', department: 'Direction', email: 'admin@carrefour.ci', phone: '+225 07 00 00 01', status: 'Actif' },
  { id: '2', code: 'EMP-002', name: 'Marc Kouassi', role: 'Directeur', department: 'Direction', email: 'directeur@carrefour.ci', phone: '+225 07 08 99 88', status: 'Actif' },
  { id: '3', code: 'EMP-003', name: 'Kassi Marie', role: 'Vendeur', department: 'Ventes / Caisse', email: 'm.kassi@carrefour.ci', phone: '+225 07 12 34 56', status: 'Actif' },
  { id: '4', code: 'EMP-004', name: 'N’Dri Eric', role: 'Magasinier', department: 'Logistique / Stock', email: 'e.ndri@carrefour.ci', phone: '+225 05 98 76 54', status: 'Actif' },
  { id: '5', code: 'EMP-005', name: 'Ouattara Fatou', role: 'Vendeur', department: 'Ventes / Caisse', email: 'f.ouattara@carrefour.ci', phone: '+225 01 45 67 89', status: 'Actif' },
  { id: '6', code: 'EMP-006', name: 'Gboho Charles', role: 'Magasinier', department: 'Logistique / Stock', email: 'c.gboho@carrefour.ci', phone: '+225 07 55 44 33', status: 'En congé' },
  { id: '7', code: 'EMP-007', name: 'Koffi Serge', role: 'Administrateur', department: 'Informatique / IT', email: 's.koffi@carrefour.ci', phone: '+225 05 11 22 33', status: 'Actif' },
  { id: '8', code: 'EMP-008', name: 'Ahoua Beatrice', role: 'Directeur', department: 'Comptabilité / Finance', email: 'b.ahoua@carrefour.ci', phone: '+225 07 66 55 44', status: 'Actif' },
];

const initialCategories: Category[] = [
  { id: '1', name: 'Boissons', color: '#0b44a7', percentage: 35, revenue: 875000, productCount: 142 },
  { id: '2', name: 'Alimentation', color: '#d91f26', percentage: 25, revenue: 625000, productCount: 310 },
  { id: '3', name: 'Hygiène', color: '#1e3a8a', percentage: 20, revenue: 500000, productCount: 185 },
  { id: '4', name: 'Entretien', color: '#3b82f6', percentage: 10, revenue: 250000, productCount: 94 },
  { id: '5', name: 'Autres', color: '#94a3b8', percentage: 10, revenue: 250000, productCount: 68 },
];

const initialPayments: PaymentRecord[] = [
  { id: '1', reference: 'PAY-00125', type: 'Recette', partyName: 'Kouadio Jean', amount: 125000, date: '29/05/2024', method: 'Espèces', notes: 'Règlement Facture VTE-000125' },
  { id: '2', reference: 'PAY-00124', type: 'Recette', partyName: 'Diarra Aissatou', amount: 85000, date: '29/05/2024', method: 'Orange Money', notes: 'Règlement Facture VTE-000124' },
  { id: '3', reference: 'PAY-00089', type: 'Dépense', partyName: 'Sodexci', amount: 450000, date: '29/05/2024', method: 'Carte', notes: 'Paiement Fournisseur ACH-000089' },
  { id: '4', reference: 'PAY-00123', type: 'Recette', partyName: 'Bamba Moussa', amount: 210000, date: '29/05/2024', method: 'Wave', notes: 'Règlement Facture VTE-000123' },
  { id: '5', reference: 'PAY-00088', type: 'Dépense', partyName: 'Global Food', amount: 250000, date: '29/05/2024', method: 'Moov Money', notes: 'Acompte ACH-000088' },
];

const initialStockMovements: StockMovement[] = [
  { id: '1', date: '29/05/2024 14:30', productName: 'Huile végétale 1L', type: 'Sortie', quantity: 12, author: 'Kassi Marie', reason: 'Vente VTE-000125' },
  { id: '2', date: '29/05/2024 11:15', productName: 'Sucre 1kg', type: 'Entrée', quantity: 50, author: 'N’Dri Eric', reason: 'Livraison ACH-000089' },
  { id: '3', date: '28/05/2024 16:45', productName: 'Savon 250g', type: 'Ajustement', quantity: -2, author: 'Admin', reason: 'Inventaire - produit endommagé' },
  { id: '4', date: '28/05/2024 10:20', productName: 'Riz 5kg', type: 'Entrée', quantity: 30, author: 'N’Dri Eric', reason: 'Livraison ACH-000086' },
];

const initialNotifications: NotificationItem[] = [
  { id: '1', title: 'Alerte Stock Faible', message: 'Le produit Huile végétale 1L a atteint 5 unités (seuil : 15).', time: 'Il y a 10 min', read: false, type: 'warning' },
  { id: '2', title: 'Nouvelle Vente', message: 'Vente VTE-000125 de 125 000 FCFA enregistrée par Kouadio Jean.', time: 'Il y a 25 min', read: false, type: 'success' },
  { id: '3', title: 'Livraison reçue', message: 'Commande ACH-000089 de Sodexci réceptionnée.', time: 'Il y a 1 heure', read: false, type: 'info' },
  { id: '4', title: 'Rappel fournisseur', message: 'Facture CFAO Distribution arrive à échéance demain.', time: 'Il y a 3 heures', read: false, type: 'warning' },
  { id: '5', title: 'Sauvegarde automatique', message: 'La base de données a été sauvegardée avec succès.', time: 'Ce matin 08:00', read: false, type: 'info' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('carrefour_auth') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string; code?: string } | null>(() => {
    const saved = localStorage.getItem('carrefour_user');
    return saved ? JSON.parse(saved) : { name: 'Alain Banny', email: 'admin@carrefour.ci', role: 'Administrateur', code: 'EMP-001' };
  });

  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const [dateRange, setDateRange] = useState<string>('Mercredi 29 Mai 2024');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Charge les données métier réelles du backend dans les états du contexte.
  const chargerDonnees = async () => {
    try {
      const d = await loadAllData();
      setClients(d.clients);
      setEmployees(d.employees);
      setSuppliers(d.suppliers);
      setProducts(d.products);
      setCategories(d.categories);
      setSales(d.sales);
      setPurchases(d.purchases);
      setPayments(d.payments);
      setStockMovements(d.stockMovements);
    } catch {
      // Si le backend ne répond pas, on conserve les données d'exemple.
    }
  };

  // Au premier montage : si une session est déjà ouverte (refresh F5),
  // on recharge les données depuis le backend.
  useEffect(() => {
    if (isAuthenticated) {
      chargerDonnees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mappe le poste PostgreSQL (vendeur, magasinier, directeur, administrateur)
  // vers le nom de rôle affiché dans l'interface.
  const mapRole = (poste: string): string => {
    const roles: Record<string, string> = {
      administrateur: 'Administrateur',
      directeur: 'Directeur',
      magasinier: 'Magasinier',
      vendeur: 'Vendeur',
    };
    return roles[poste?.toLowerCase()] || 'Vendeur';
  };

  const login = async (email: string, password: string): Promise<void> => {
    // Appel backend réel : POST /api/utilisateurs/login/
    const data = await loginBackend(email, password);
    const u = data.utilisateur;

    const userObj = {
      name: `${u.prenom} ${u.nom}`.trim(),
      email: u.email,
      role: mapRole(u.poste),
      code: `EMP-${String(u.id_employe).padStart(3, '0')}`,
    };

    setCurrentUser(userObj);
    setIsAuthenticated(true);
    localStorage.setItem('carrefour_auth', 'true');
    localStorage.setItem('carrefour_user', JSON.stringify(userObj));

    // Charger les données métier réelles du backend.
    await chargerDonnees();
  };

  const logout = () => {
    logoutBackend();
    setIsAuthenticated(false);
    localStorage.removeItem('carrefour_auth');
    localStorage.removeItem('carrefour_user');
  };

  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

  const openModal = (modalName: string) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  const addClient = (clientData: Omit<Client, 'id' | 'code' | 'totalSpent' | 'lastPurchaseDate'>) => {
    const newId = (clients.length + 1).toString();
    const newCode = `CLT-${String(clients.length + 1).padStart(3, '0')}`;
    const newClient: Client = {
      ...clientData,
      id: newId,
      code: newCode,
      totalSpent: 0,
      lastPurchaseDate: new Date().toLocaleDateString('fr-FR'),
    };
    setClients([newClient, ...clients]);
    closeModal();
  };

  const addSale = (saleData: Omit<Sale, 'id' | 'facture' | 'date' | 'time'>) => {
    const nextNum = sales.length + 126;
    const newFacture = `VTE-${String(nextNum).padStart(6, '0')}`;
    const now = new Date();
    const dateStr = '29/05/2024';
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const newSale: Sale = {
      ...saleData,
      id: String(sales.length + 1),
      facture: newFacture,
      date: dateStr,
      time: timeStr,
      vendeuseName: saleData.vendeuseName || currentUser?.name || 'Marie Kassi',
      items: saleData.items || [],
      itemsCount: saleData.items && saleData.items.length > 0
        ? saleData.items.reduce((sum, item) => sum + item.quantity, 0)
        : saleData.itemsCount || 1,
    };

    setSales((prev) => [newSale, ...prev]);

    // Create linked Payment in Trésorerie
    if (newSale.status === 'Payée' || newSale.status === 'Partiel') {
      const newPayRef = `PAY-${String(payments.length + 126).padStart(5, '0')}`;
      const newPayment: PaymentRecord = {
        id: String(payments.length + 1),
        reference: newPayRef,
        type: 'Recette',
        partyName: newSale.clientName,
        amount: newSale.amount,
        date: dateStr,
        method: newSale.paymentMethod,
        notes: `Règlement Facture ${newFacture}`,
      };
      setPayments((prev) => [newPayment, ...prev]);
    }

    // Adjust product inventory stock & create stock movements
    if (saleData.items && saleData.items.length > 0) {
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          const soldItem = saleData.items.find(
            (it) => it.productId === p.id || it.productName.toLowerCase() === p.name.toLowerCase()
          );
          if (soldItem) {
            const updatedStock = Math.max(0, p.stock - soldItem.quantity);
            return { ...p, stock: updatedStock };
          }
          return p;
        })
      );

      const newMovements: StockMovement[] = saleData.items.map((it, idx) => ({
        id: String(stockMovements.length + idx + 1),
        date: `${dateStr} ${timeStr}`,
        productName: it.productName,
        type: 'Sortie',
        quantity: it.quantity,
        author: saleData.vendeuseName || currentUser?.name || 'Marie Kassi',
        reason: `Vente ${newFacture} (${newSale.clientName})`,
      }));
      setStockMovements((prev) => [...newMovements, ...prev]);
    }

    closeModal();
  };

  const addPurchase = (purchaseData: Omit<Purchase, 'id' | 'facture' | 'date'>) => {
    const nextNum = purchases.length + 90;
    const newFacture = `ACH-${String(nextNum).padStart(6, '0')}`;
    const newPurchase: Purchase = {
      ...purchaseData,
      id: String(purchases.length + 1),
      facture: newFacture,
      date: '29/05/2024',
    };
    setPurchases([newPurchase, ...purchases]);
    closeModal();
  };

  const addProduct = (productData: Omit<Product, 'id' | 'code'>) => {
    const newCode = `PRD-${String(products.length + 1).padStart(3, '0')}`;
    const newProduct: Product = {
      ...productData,
      id: String(products.length + 1),
      code: newCode,
    };
    setProducts([newProduct, ...products]);
    closeModal();
  };

  const addEmployee = (empData: Omit<Employee, 'id' | 'code'>) => {
    const newCode = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
    const newEmp: Employee = {
      ...empData,
      id: String(employees.length + 1),
      code: newCode,
    };
    setEmployees([newEmp, ...employees]);
    closeModal();
  };

  const updateEmployee = (id: string, updated: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'code' | 'totalPurchases'>) => {
    const newCode = `FRS-${String(suppliers.length + 1).padStart(3, '0')}`;
    const newSupplier: Supplier = {
      ...supplierData,
      id: String(suppliers.length + 1),
      code: newCode,
      totalPurchases: 0,
    };
    setSuppliers([newSupplier, ...suppliers]);
    closeModal();
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  const addCategory = (categoryData: Omit<Category, 'id' | 'revenue' | 'productCount'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: String(categories.length + 1),
      revenue: 0,
      productCount: 0,
    };
    setCategories([...categories, newCategory]);
    closeModal();
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const addPayment = (paymentData: Omit<PaymentRecord, 'id' | 'reference' | 'date'>) => {
    const newRef = `PAY-${String(payments.length + 126).padStart(5, '0')}`;
    const newPay: PaymentRecord = {
      ...paymentData,
      id: String(payments.length + 1),
      reference: newRef,
      date: '29/05/2024',
    };
    setPayments([newPay, ...payments]);
    closeModal();
  };

  const adjustStock = (productId: string, newStock: number, reason: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const diff = newStock - p.stock;
          const movement: StockMovement = {
            id: String(stockMovements.length + 1),
            date: new Date().toLocaleString('fr-FR'),
            productName: p.name,
            type: diff >= 0 ? 'Entrée' : 'Sortie',
            quantity: Math.abs(diff),
            author: 'Admin',
            reason: reason || 'Ajustement manuel',
          };
          setStockMovements([movement, ...stockMovements]);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
    closeModal();
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        sales,
        purchases,
        products,
        lowStockProducts,
        clients,
        suppliers,
        employees,
        categories,
        payments,
        stockMovements,
        notifications,
        dateRange,
        setDateRange,
        globalSearch,
        setGlobalSearch,
        activeModal,
        openModal,
        closeModal,
        addClient,
        addSale,
        addPurchase,
        addProduct,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addSupplier,
        deleteSupplier,
        addCategory,
        deleteCategory,
        addPayment,
        adjustStock,
        markNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
