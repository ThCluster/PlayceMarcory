export type UserRole = 'Administrateur' | 'Directeur' | 'Vendeur' | 'Magasinier';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  code?: string;
  avatar?: string;
}

export type PaymentStatus = 'Payée' | 'En attente' | 'Annulée' | 'Partiel';
export type PurchaseStatus = 'Reçu' | 'En commande' | 'En retard' | 'Annulé';
export type PaymentMethod = 'Espèces' | 'Orange Money' | 'Wave' | 'Carte' | 'Moov Money';

export interface Client {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  totalSpent: number;
  lastPurchaseDate: string;
  status: 'Actif' | 'Inactif';
}

export interface Employee {
  id: string;
  code: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: 'Actif' | 'En congé' | 'Inactif';
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  totalPurchases: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  percentage: number;
  revenue: number;
  productCount: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  unit: string;
  imageUrl?: string;
}

export interface SaleItem {
  id?: string;
  productId?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
  subtotal: number;
}

export interface Sale {
  id: string;
  facture: string;
  clientName: string;
  clientId?: string;
  vendeuseName: string;
  amount: number;
  date: string;
  time: string;
  status: PaymentStatus;
  itemsCount: number;
  paymentMethod: PaymentMethod;
  items: SaleItem[];
}

export interface Purchase {
  id: string;
  facture: string;
  fournisseur: string;
  amount: number;
  date: string;
  status: PurchaseStatus;
  itemsCount: number;
}

export interface PaymentRecord {
  id: string;
  reference: string;
  type: 'Recette' | 'Dépense';
  partyName: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  notes: string;
}

export interface StockMovement {
  id: string;
  date: string;
  productName: string;
  type: 'Entrée' | 'Sortie' | 'Ajustement';
  quantity: number;
  author: string;
  reason: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'warning' | 'info' | 'success';
}
