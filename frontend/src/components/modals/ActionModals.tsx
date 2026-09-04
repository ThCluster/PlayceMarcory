import React, { useState } from 'react';
import { X, UserPlus, ShoppingCart, Truck, PackagePlus, CreditCard, Warehouse, LayoutGrid, Plus, FileText, Download, Trash2, ShoppingBag, Tag, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SaleItem, PaymentMethod } from '../../types';

export const ActionModals: React.FC = () => {
  const {
    activeModal,
    closeModal,
    addClient,
    addSale,
    addPurchase,
    addProduct,
    addEmployee,
    addSupplier,
    addCategory,
    addPayment,
    adjustStock,
    products,
    clients,
    suppliers,
    sales,
    purchases,
    currentUser,
  } = useApp();

  // State for Add Client
  const [clientForm, setClientForm] = useState({ name: '', phone: '', email: '', city: 'Abidjan', status: 'Actif' as const });
  // State for Add Employee
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    department: 'Ventes / Caisse',
    role: 'Vendeur' as 'Administrateur' | 'Directeur' | 'Vendeur' | 'Magasinier',
    email: '',
    phone: '',
    status: 'Actif' as 'Actif' | 'En congé' | 'Inactif',
  });
  // State for Add Sale POS
  const [saleClient, setSaleClient] = useState('Kouadio Jean');
  const [saleVendeuse, setSaleVendeuse] = useState(currentUser?.name || 'Marie Kassi');
  const [salePaymentMethod, setSalePaymentMethod] = useState<PaymentMethod>('Espèces');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [saleError, setSaleError] = useState<string | null>(null);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([
    { id: '1', productId: '4', productName: 'Riz 25 kg', quantity: 2, unitPrice: 20000, unit: 'Sac', subtotal: 40000 },
    { id: '2', productId: '1', productName: 'Huile 5 L', quantity: 3, unitPrice: 15000, unit: 'Bouteille', subtotal: 45000 },
    { id: '3', productId: '2', productName: 'Sucre 1 kg', quantity: 4, unitPrice: 3000, unit: 'Paquet', subtotal: 12000 },
  ]);
  // State for Add Purchase
  const [purchaseForm, setPurchaseForm] = useState({ fournisseur: 'Sodexci', amount: '', itemsCount: '10', status: 'Reçu' as const });
  // State for Add Product
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Boissons',
    price: '',
    cost: '',
    stock: '50',
    minStock: '10',
    unit: 'Bouteille',
    imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=400',
  });
  // State for Add Payment
  const [paymentForm, setPaymentForm] = useState({ type: 'Recette' as const, partyName: 'Kouadio Jean', amount: '', method: 'Espèces' as const, notes: '' });
  // State for Add Supplier
  const [supplierForm, setSupplierForm] = useState({ name: '', contact: '', phone: '', email: '', address: '' });
  // State for Add Category
  const [categoryForm, setCategoryForm] = useState({ name: '', color: '#0942a6', percentage: '10' });
  // State for Adjust Stock
  const [stockForm, setStockForm] = useState({ productId: products[0]?.id || '1', newStock: '', reason: 'Inventaire périodique' });
  // State for Executive Report (Espace Directeur)
  const [reportForm, setReportForm] = useState({
    type: 'Bilan Financier & Marges Brutes',
    period: 'Ce mois-ci (Mai 2024)',
    format: 'PDF',
    department: 'Tous les départements',
    includeDetails: true,
  });

  if (!activeModal) return null;

  const isWideModal = activeModal === 'add_sale' || activeModal === 'add_product';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`bg-white w-full ${isWideModal ? 'max-w-2xl' : 'max-w-md'} rounded-2xl shadow-2xl border border-gray-100 overflow-hidden`}>
        {/* Modal 1: Nouveau Client */}
        {activeModal === 'add_client' && (
          <div>
            <div className="p-5 bg-gradient-to-r from-[#0942a6] to-blue-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-bold text-base">Nouveau client</h3>
              </div>
              <button onClick={closeModal} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addClient(clientForm);
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom complet *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Kouame Bertin"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#0942a6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Téléphone *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: +225 07 00 00 00"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#0942a6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="ex: client@email.ci"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#0942a6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ville</label>
                <input
                  type="text"
                  placeholder="ex: Abidjan"
                  value={clientForm.city}
                  onChange={(e) => setClientForm({ ...clientForm, city: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#0942a6]"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0942a6] text-white hover:bg-blue-800 shadow-xs"
                >
                  Enregistrer client
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal: Nouvel Employé par Département */}
        {activeModal === 'add_employee' && (
          <div>
            <div className="p-5 bg-gradient-to-r from-[#0942a6] to-blue-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base">Nouvel employé</h3>
                  <p className="text-[11px] text-blue-100 font-medium">Affectation par département et niveau d'accès</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addEmployee({
                  name: employeeForm.name,
                  department: employeeForm.department,
                  role: employeeForm.role,
                  email: employeeForm.email || `${employeeForm.name.toLowerCase().replace(/\s+/g, '.')}@carrefour.ci`,
                  phone: employeeForm.phone || '+225 07 00 00 00',
                  status: employeeForm.status,
                });
              }}
              className="p-5 space-y-3.5"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom complet de l'employé *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Yao Jean-Baptiste"
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-[#0942a6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Département d'affectation *</label>
                <select
                  value={employeeForm.department}
                  onChange={(e) => {
                    const dept = e.target.value;
                    let suggestedRole: 'Administrateur' | 'Directeur' | 'Vendeur' | 'Magasinier' = employeeForm.role;
                    if (dept === 'Ventes / Caisse') suggestedRole = 'Vendeur';
                    else if (dept === 'Logistique / Stock') suggestedRole = 'Magasinier';
                    else if (dept === 'Direction') suggestedRole = 'Directeur';
                    else if (dept === 'Informatique / IT') suggestedRole = 'Administrateur';
                    setEmployeeForm({ ...employeeForm, department: dept, role: suggestedRole });
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                >
                  <option value="Ventes / Caisse">Ventes / Caisse</option>
                  <option value="Logistique / Stock">Logistique / Stock</option>
                  <option value="Direction">Direction Générale / Management</option>
                  <option value="Informatique / IT">Informatique / IT</option>
                  <option value="Comptabilité / Finance">Comptabilité / Finance</option>
                  <option value="Ressources Humaines">Ressources Humaines</option>
                  <option value="Marketing & Communication">Marketing & Communication</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rôle & Permissions Système *</label>
                <select
                  value={employeeForm.role}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      role: e.target.value as 'Administrateur' | 'Directeur' | 'Vendeur' | 'Magasinier',
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-[#0942a6] focus:outline-hidden"
                >
                  <option value="Administrateur">Administrateur (Accès total & configuration)</option>
                  <option value="Directeur">Directeur (Rapports, Bilan & Statistiques)</option>
                  <option value="Vendeur">Vendeur (Saisie des ventes & Encaissements)</option>
                  <option value="Magasinier">Magasinier (Gestion des stocks & Achats)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email pro</label>
                  <input
                    type="email"
                    placeholder="ex: j.yao@carrefour.ci"
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    placeholder="ex: +225 07 00 00 00"
                    value={employeeForm.phone}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Statut initial</label>
                <div className="flex gap-4 text-xs font-bold pt-1">
                  {(['Actif', 'En congé', 'Inactif'] as const).map((st) => (
                    <label key={st} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="empStatus"
                        checked={employeeForm.status === st}
                        onChange={() => setEmployeeForm({ ...employeeForm, status: st })}
                        className="text-[#0942a6]"
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0942a6] text-white hover:bg-blue-800 shadow-xs cursor-pointer"
                >
                  Enregistrer l'employé
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal 2: Nouvelle Vente (Module Vendeuse & Caisse) */}
        {activeModal === 'add_sale' && (
          <div>
            <div className="p-5 bg-gradient-to-r from-[#d91f26] to-red-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base">Saisie d'une Nouvelle Vente</h3>
                  <p className="text-[11px] text-red-100 font-medium">Création de facture & Enregistrement caisse</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (saleItems.length === 0) {
                  setSaleError('Veuillez ajouter au moins un produit à la vente avant de valider.');
                  return;
                }
                setSaleError(null);
                const totalAmount = saleItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
                const totalQty = saleItems.reduce((sum, item) => sum + item.quantity, 0);

                addSale({
                  clientName: saleClient,
                  vendeuseName: saleVendeuse,
                  amount: totalAmount,
                  itemsCount: totalQty,
                  paymentMethod: salePaymentMethod,
                  status: 'Payée',
                  items: saleItems,
                });
              }}
              className="p-5 space-y-4 max-h-[82vh] overflow-y-auto"
            >
              {saleError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold animate-in fade-in">
                  ⚠️ {saleError}
                </div>
              )}
              {/* Client & Vendeuse Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Sélectionner le Client *</label>
                  <select
                    value={saleClient}
                    onChange={(e) => setSaleClient(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-hidden focus:border-[#d91f26]"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                    <option value="Client de passage">Client de passage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vendeuse / Caissière *</label>
                  <input
                    type="text"
                    value={saleVendeuse}
                    onChange={(e) => setSaleVendeuse(e.target.value)}
                    placeholder="Marie Kassi"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-hidden focus:border-[#d91f26]"
                  />
                </div>
              </div>

              {/* Add Product Selector */}
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80 space-y-2">
                <label className="block text-xs font-bold text-gray-800">Ajouter des produits au panier</label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden"
                  >
                    <option value="">-- Choisir un produit du catalogue --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.stock === 0}>
                        {p.name} ({p.unit}) — {new Intl.NumberFormat('fr-FR').format(p.price)} FCFA [Stock : {p.stock}]
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedProductId) return;
                      const prod = products.find((p) => p.id === selectedProductId);
                      if (!prod) return;

                      setSaleItems((prev) => {
                        const existingIdx = prev.findIndex(
                          (it) => it.productId === prod.id || it.productName.toLowerCase() === prod.name.toLowerCase()
                        );
                        if (existingIdx >= 0) {
                          const updated = [...prev];
                          const curQty = updated[existingIdx].quantity;
                          const newQty = curQty + 1;
                          updated[existingIdx] = {
                            ...updated[existingIdx],
                            quantity: newQty,
                            subtotal: newQty * updated[existingIdx].unitPrice,
                          };
                          return updated;
                        } else {
                          return [
                            ...prev,
                            {
                              id: String(Date.now()),
                              productId: prod.id,
                              productName: prod.name,
                              quantity: 1,
                              unitPrice: prod.price,
                              unit: prod.unit,
                              subtotal: prod.price,
                            },
                          ];
                        }
                      });
                      setSelectedProductId('');
                    }}
                    className="bg-[#d91f26] hover:bg-red-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>

              {/* Products Basket Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Produits vendus ({saleItems.length})</span>
                  <span className="text-gray-400 font-normal">Ajustez les quantités pour recalculer</span>
                </div>

                {saleItems.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-xs border border-dashed border-gray-200 rounded-2xl">
                    Aucun produit dans le panier de vente.
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 bg-white">
                    {saleItems.map((item, idx) => (
                      <div key={item.id || idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex-1 min-w-0">
                          <span className="font-extrabold text-gray-900 block truncate">{item.productName}</span>
                          <span className="text-[10px] text-gray-400">{item.unit || 'Unité'}</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                          <button
                            type="button"
                            onClick={() => {
                              setSaleItems((prev) =>
                                prev.map((it, i) => {
                                  if (i === idx) {
                                    const q = Math.max(1, it.quantity - 1);
                                    return { ...it, quantity: q, subtotal: q * it.unitPrice };
                                  }
                                  return it;
                                })
                              );
                            }}
                            className="w-5 h-5 rounded bg-white hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center cursor-pointer text-xs"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const q = Math.max(1, Number(e.target.value) || 1);
                              setSaleItems((prev) =>
                                prev.map((it, i) => (i === idx ? { ...it, quantity: q, subtotal: q * it.unitPrice } : it))
                              );
                            }}
                            className="w-10 text-center font-bold text-gray-900 bg-transparent focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSaleItems((prev) =>
                                prev.map((it, i) => {
                                  if (i === idx) {
                                    const q = it.quantity + 1;
                                    return { ...it, quantity: q, subtotal: q * it.unitPrice };
                                  }
                                  return it;
                                })
                              );
                            }}
                            className="w-5 h-5 rounded bg-white hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center cursor-pointer text-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right w-28">
                          <div className="font-black text-gray-900">
                            {new Intl.NumberFormat('fr-FR').format(item.subtotal)} FCFA
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {new Intl.NumberFormat('fr-FR').format(item.unitPrice)} /u
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => {
                            setSaleItems((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Supprimer la ligne"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total Calculation Box */}
              <div className="bg-gradient-to-r from-red-50 to-amber-50 p-3.5 rounded-2xl border border-red-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">Montant Total Facturé</span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {saleItems.reduce((sum, item) => sum + item.quantity, 0)} articles au total
                  </span>
                </div>
                <div className="text-xl font-black text-[#d91f26]">
                  {new Intl.NumberFormat('fr-FR').format(
                    saleItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
                  )}{' '}
                  FCFA
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Moyen de Paiement *</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['Espèces', 'Orange Money', 'Wave', 'Carte', 'Moov Money'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSalePaymentMethod(method)}
                      className={`p-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                        salePaymentMethod === method
                          ? 'bg-[#d91f26] text-white border-[#d91f26] shadow-2xs'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#d91f26] text-white hover:bg-red-800 cursor-pointer shadow-2xs transition-all"
                >
                  Valider la vente
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal 3: Nouvel Achat */}
        {activeModal === 'add_purchase' && (
          <div>
            <div className="p-5 bg-[#0942a6] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5" />
                <h3 className="font-bold text-base">Nouvel achat fournisseur</h3>
              </div>
              <button onClick={closeModal} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addPurchase({
                  fournisseur: purchaseForm.fournisseur,
                  amount: Number(purchaseForm.amount) || 200000,
                  itemsCount: Number(purchaseForm.itemsCount) || 10,
                  status: purchaseForm.status,
                });
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Fournisseur *</label>
                <select
                  value={purchaseForm.fournisseur}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, fournisseur: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Montant total (FCFA) *</label>
                <input
                  type="number"
                  required
                  placeholder="ex: 450000"
                  value={purchaseForm.amount}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, amount: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Quantité globale reçue</label>
                <input
                  type="number"
                  value={purchaseForm.itemsCount}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, itemsCount: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0942a6] text-white hover:bg-blue-800"
                >
                  Enregistrer l'achat
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal: Nouveau Fournisseur */}
        {activeModal === 'add_supplier' && (
          <div>
            <div className="p-5 bg-gradient-to-r from-[#0942a6] to-blue-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base">Nouveau fournisseur</h3>
                  <p className="text-[11px] text-blue-100 font-medium">Partenaire & grossiste d'approvisionnement</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addSupplier({
                  name: supplierForm.name,
                  contact: supplierForm.contact || 'Resp. Commercial',
                  phone: supplierForm.phone || '+225 27 00 00 00',
                  email: supplierForm.email || 'contact@fournisseur.ci',
                  address: supplierForm.address || 'Abidjan, Côte d’Ivoire',
                });
                setSupplierForm({ name: '', contact: '', phone: '', email: '', address: '' });
              }}
              className="p-5 space-y-3.5"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Raison sociale / Nom entreprise *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Solibra / SIFCA / Unilever CI"
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-[#0942a6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom du contact principal</label>
                <input
                  type="text"
                  placeholder="ex: M. Kouassi Jean"
                  value={supplierForm.contact}
                  onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Téléphone *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: +225 27 21 00 11"
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email commercial</label>
                  <input
                    type="email"
                    placeholder="ex: contact@fournisseur.ci"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Adresse physique / Zone</label>
                <input
                  type="text"
                  placeholder="ex: Zone Industrielle Yopougon, Abidjan"
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0942a6] text-white hover:bg-blue-800 shadow-xs cursor-pointer"
                >
                  Ajouter le fournisseur
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal: Nouvelle Catégorie */}
        {activeModal === 'add_category' && (
          <div>
            <div className="p-5 bg-gradient-to-r from-[#0942a6] to-blue-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base">Nouvelle catégorie</h3>
                  <p className="text-[11px] text-blue-100 font-medium">Organisation des rayons et produits</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addCategory({
                  name: categoryForm.name,
                  color: categoryForm.color,
                  percentage: Number(categoryForm.percentage) || 10,
                });
                setCategoryForm({ name: '', color: '#0942a6', percentage: '10' });
              }}
              className="p-5 space-y-3.5"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom de la catégorie / Rayon *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Produits Frais, Surgelés, Électroménager..."
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-[#0942a6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Couleur d'identification du rayon</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5 bg-gray-50"
                  />
                  <div className="flex gap-2">
                    {['#0b44a7', '#d91f26', '#1e3a8a', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setCategoryForm({ ...categoryForm, color: c })}
                        className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${
                          categoryForm.color === c ? 'scale-110 border-gray-900' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Part estimée des ventes (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={categoryForm.percentage}
                  onChange={(e) => setCategoryForm({ ...categoryForm, percentage: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0942a6] text-white hover:bg-blue-800 shadow-xs cursor-pointer"
                >
                  Créer la catégorie
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal 4: Nouveau Produit */}
        {activeModal === 'add_product' && (
          <div>
            <div className="p-5 bg-[#d91f26] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <PackagePlus className="w-5 h-5" />
                <h3 className="font-bold text-base">Nouveau produit</h3>
              </div>
              <button onClick={closeModal} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addProduct({
                  name: productForm.name,
                  category: productForm.category,
                  price: Number(productForm.price) || 1000,
                  cost: Number(productForm.cost) || 700,
                  stock: Number(productForm.stock) || 50,
                  minStock: Number(productForm.minStock) || 10,
                  unit: productForm.unit,
                  imageUrl: productForm.imageUrl,
                });
              }}
              className="p-5 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              {/* Photo du produit & Prévisualisation */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Photo du produit</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 shadow-2xs relative">
                    {productForm.imageUrl ? (
                      <img
                        src={productForm.imageUrl}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                        No photo
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="url"
                      placeholder="URL de la photo (https://...)"
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-hidden"
                    />
                    <div className="flex flex-wrap gap-1 text-[10px] font-semibold text-gray-500">
                      <span>Exemples :</span>
                      {[
                        { label: 'Jus', url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=400' },
                        { label: 'Riz', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400' },
                        { label: 'Café', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400' },
                        { label: 'Savon', url: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&q=80&w=400' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setProductForm({ ...productForm, imageUrl: preset.url })}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom du produit *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Eau Minérale 1.5L"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                  >
                    <option value="Boissons">Boissons</option>
                    <option value="Alimentation">Alimentation</option>
                    <option value="Hygiène">Hygiène</option>
                    <option value="Entretien">Entretien</option>
                    <option value="Autres">Autres</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Unité</label>
                  <input
                    type="text"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Prix Vente (FCFA)</label>
                  <input
                    type="number"
                    required
                    placeholder="1500"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Prix Achat (FCFA)</label>
                  <input
                    type="number"
                    required
                    placeholder="1000"
                    value={productForm.cost}
                    onChange={(e) => setProductForm({ ...productForm, cost: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Initial</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Min (Alerte)</label>
                  <input
                    type="number"
                    value={productForm.minStock}
                    onChange={(e) => setProductForm({ ...productForm, minStock: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#d91f26] text-white hover:bg-red-800 cursor-pointer shadow-2xs"
                >
                  Créer produit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal 5: Enregistrer Paiement */}
        {activeModal === 'add_payment' && (
          <div>
            <div className="p-5 bg-[#0942a6] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-bold text-base">Enregistrer un paiement</h3>
              </div>
              <button onClick={closeModal} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addPayment({
                  type: paymentForm.type,
                  partyName: paymentForm.partyName,
                  amount: Number(paymentForm.amount) || 100000,
                  method: paymentForm.method,
                  notes: paymentForm.notes || 'Règlement divers',
                });
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Type de flux</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="payType"
                      checked={paymentForm.type === 'Recette'}
                      onChange={() => setPaymentForm({ ...paymentForm, type: 'Recette' })}
                    />
                    Recette (Client)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="payType"
                      checked={paymentForm.type === 'Dépense'}
                      onChange={() => setPaymentForm({ ...paymentForm, type: 'Dépense' })}
                    />
                    Dépense (Fournisseur)
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom du tiers / Facture</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Kouadio Jean"
                  value={paymentForm.partyName}
                  onChange={(e) => setPaymentForm({ ...paymentForm, partyName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Montant (FCFA)</label>
                  <input
                    type="number"
                    required
                    placeholder="125000"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Moyen</label>
                  <select
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="Espèces">Espèces</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="Wave">Wave</option>
                    <option value="Carte">Carte</option>
                    <option value="Moov Money">Moov Money</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0942a6] text-white hover:bg-blue-800"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal 6: Ajuster Stock */}
        {activeModal === 'adjust_stock' && (
          <div>
            <div className="p-5 bg-[#d91f26] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Warehouse className="w-5 h-5" />
                <h3 className="font-bold text-base">Ajuster le stock</h3>
              </div>
              <button onClick={closeModal} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                adjustStock(
                  stockForm.productId,
                  Number(stockForm.newStock) || 20,
                  stockForm.reason
                );
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sélectionner le produit</label>
                <select
                  value={stockForm.productId}
                  onChange={(e) => setStockForm({ ...stockForm, productId: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock actuel : {p.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nouveau stock réel</label>
                <input
                  type="number"
                  required
                  placeholder="ex: 25"
                  value={stockForm.newStock}
                  onChange={(e) => setStockForm({ ...stockForm, newStock: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Motif d'ajustement</label>
                <input
                  type="text"
                  placeholder="ex: Réception physique / Casse / Périmé"
                  value={stockForm.reason}
                  onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#d91f26] text-white hover:bg-red-800"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Modal 7: Générer Rapport (Espace Directeur) */}
        {activeModal === 'generate_report' && (
          <div>
            <div className="p-5 bg-gradient-to-r from-[#0942a6] to-blue-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base">Générer un Rapport Exécutif</h3>
                  <p className="text-[11px] text-blue-100 font-medium">Formulaire de bilan & audit (Espace Directeur)</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                let csvContent = '';
                const safeType = reportForm.type.toLowerCase().replace(/[^a-z0-9]/g, '_');
                const filename = `rapport_${safeType}_${reportForm.period.replace(/[^a-z0-9]/g, '_')}.csv`;

                if (reportForm.type.includes('Caisses') || reportForm.type.includes('Ventes')) {
                  csvContent = 'Facture;Client;Vendeuse;Date;Heure;Mode Paiement;Articles;Montant Total FCFA;Statut\n';
                  sales.forEach((s) => {
                    const itemDetails = (s.items || [])
                      .map((i) => `${i.productName} (x${i.quantity})`)
                      .join(' | ');
                    csvContent += `"${s.facture}";"${s.clientName}";"${s.vendeuseName || 'Marie Kassi'}";"${s.date}";"${s.time || ''}";"${s.paymentMethod}";"${itemDetails}";${s.amount};"${s.status}"\n`;
                  });
                } else if (reportForm.type.includes('Stocks')) {
                  csvContent = 'Code;Produit;Rayon;Stock Actuel;Unite;Seuil Min;Prix Vente;Cout Achat;Valeur Totale Stock FCFA\n';
                  products.forEach((p) => {
                    csvContent += `"${p.code}";"${p.name}";"${p.category}";${p.stock};"${p.unit}";${p.minStock};${p.price};${p.cost};${p.stock * p.price}\n`;
                  });
                } else if (reportForm.type.includes('Achats') || reportForm.type.includes('Fournisseurs')) {
                  csvContent = 'Facture Achat;Fournisseur;Date Commande;Nombre Articles;Montant Total FCFA;Statut\n';
                  purchases.forEach((p) => {
                    csvContent += `"${p.facture}";"${p.supplierName}";"${p.date}";${p.itemsCount};${p.amount};"${p.status}"\n`;
                  });
                } else {
                  const totalCA = sales.reduce((sum, s) => sum + s.amount, 0);
                  const totalAchats = purchases.reduce((sum, p) => sum + p.amount, 0);
                  csvContent = 'Indicateur;Valeur\n';
                  csvContent += `"Type de Rapport";"${reportForm.type}"\n`;
                  csvContent += `"Periode";"${reportForm.period}"\n`;
                  csvContent += `"Departement";"${reportForm.department}"\n`;
                  csvContent += `"Chiffre d'Affaires Ventes";"${totalCA} FCFA"\n`;
                  csvContent += `"Achats Fournisseurs";"${totalAchats} FCFA"\n`;
                  csvContent += `"Marge Brute Consolidee";"${totalCA - totalAchats} FCFA"\n`;
                  csvContent += `"Nombre de Ventes";"${sales.length}"\n`;
                }

                const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                closeModal();
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Type de rapport / Bilan *</label>
                <select
                  value={reportForm.type}
                  onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-[#0942a6] focus:outline-hidden"
                >
                  <option value="Bilan Financier & Marges Brutes">Bilan Financier & Marges Brutes</option>
                  <option value="Rapport Journalier des Caisses & Écarts">Rapport Journalier des Caisses & Écarts</option>
                  <option value="Valorisation & État des Stocks">Valorisation & État des Stocks</option>
                  <option value="Analyse comparative des Ventes">Analyse comparative des Ventes</option>
                  <option value="Synthèse d'Achats & Dettes Fournisseurs">Synthèse d'Achats & Dettes Fournisseurs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Période d'analyse *</label>
                <select
                  value={reportForm.period}
                  onChange={(e) => setReportForm({ ...reportForm, period: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                >
                  <option value="Aujourd'hui">Aujourd'hui (Journalier)</option>
                  <option value="Cette semaine">Cette semaine</option>
                  <option value="Ce mois-ci (Mai 2024)">Ce mois-ci (Mai 2024)</option>
                  <option value="Trimestre en cours (T2 2024)">Trimestre en cours (T2 2024)</option>
                  <option value="Exercice complet 2024">Exercice complet 2024</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Périmètre / Département</label>
                <select
                  value={reportForm.department}
                  onChange={(e) => setReportForm({ ...reportForm, department: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden"
                >
                  <option value="Tous les départements">Tous les départements (Global Magasin)</option>
                  <option value="Caisse & Ventes Directes">Caisse & Ventes Directes</option>
                  <option value="Entrepôt & Réception Stock">Entrepôt & Réception Stock</option>
                  <option value="Rayons Frais & Épicerie">Rayons Frais & Épicerie</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Format d'exportation</label>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold pt-1">
                  {['PDF', 'EXCEL'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setReportForm({ ...reportForm, format: fmt })}
                      className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                        reportForm.format === fmt
                          ? 'bg-blue-50 border-[#0942a6] text-[#0942a6]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Document {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0942a6] hover:bg-blue-800 text-white shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Générer le document</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
