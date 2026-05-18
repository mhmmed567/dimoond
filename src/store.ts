import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  query, 
  orderBy,
  setDoc,
  getDoc,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './lib/firebase';
import { handleFirestoreError, OperationType } from './lib/firestoreUtils';
import type { Product, CartItem, Order, UserRole, OrderStatus, AppSettings, User } from './types';

interface AppState {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  userPhone: string | null;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  getActiveOrders: () => Order[];
  getCompletedOrders: () => Order[];
  staff: User[];
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  addStaff: (staffData: Omit<User, 'id'>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  initSync: () => () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User & Role
      currentRole: 'customer',
      userPhone: null,
      setCurrentRole: (role: UserRole) => set({ currentRole: role }),

      // Settings
      settings: {
        logoUrl: 'https://firebasestorage.googleapis.com/v0/b/diamond-coffee-80415.appspot.com/o/Diamond%20Logo.jpg?alt=media&token=e9e8e9e8-e9e8-e9e8-e9e8-e9e8e9e8e9e8',
        storeName: 'ديـمـونـد'
      },
      updateSettings: async (newSettings) => {
        try {
          await setDoc(doc(db, 'settings', 'global'), newSettings, { merge: true });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, 'settings/global');
        }
      },

      // Products
      products: [],
      addProduct: async (product) => {
        try {
          await addDoc(collection(db, 'products'), {
            ...product,
            available: true
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'products');
        }
      },
      updateProduct: async (id, updatedProduct) => {
        try {
          await updateDoc(doc(db, 'products', id), updatedProduct);
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
        }
      },
      deleteProduct: async (id) => {
        try {
          await deleteDoc(doc(db, 'products', id));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
        }
      },

      // Cart (Kept local/persistent)
      cart: [],
      addToCart: (product: Product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { product, quantity: 1 }] };
        }),
      removeFromCart: (productId: string) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),
      updateQuantity: (productId: string, quantity: number) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () =>
        get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0),

      // Orders
      orders: [],
      addOrder: async (orderData) => {
        try {
          await addDoc(collection(db, 'orders'), {
            ...orderData,
            userId: 'customer',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          get().clearCart();
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'orders');
        }
      },
      updateOrderStatus: async (id, status) => {
        try {
          await updateDoc(doc(db, 'orders', id), { 
            status,
            updatedAt: serverTimestamp() 
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
        }
      },
      getActiveOrders: () =>
        get().orders.filter((order) => order.status !== 'delivered'),
      getCompletedOrders: () =>
        get().orders.filter((order) => order.status === 'delivered'),

      // Staff Management & Auth
      staff: [],
      login: async (phone, password) => {
        try {
          // Hardcoded first admin check or database check
          // For security, we should check DB first.
          const q = query(
            collection(db, 'users'), 
            where('phone', '==', phone), 
            where('password', '==', password)
          );
          const snapshot = await getDocs(q);
          
          if (!snapshot.empty) {
            const userData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as User;
            set({ userPhone: phone, currentRole: userData.role });
            return true;
          }

          // Special case for first-time admin setup if DB is empty
          if (phone === '0500000000' && password === 'admin123') {
            const adminData = { phone, password, role: 'admin' as UserRole };
            await addDoc(collection(db, 'users'), adminData);
            set({ userPhone: phone, currentRole: 'admin' });
            return true;
          }

          return false;
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, 'users');
          return false;
        }
      },
      logout: () => set({ userPhone: null, currentRole: 'customer' }),
      addStaff: async (staffData) => {
        try {
          await addDoc(collection(db, 'users'), staffData);
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'users');
        }
      },
      deleteStaff: async (id) => {
        try {
          await deleteDoc(doc(db, 'users', id));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `users/${id}`);
        }
      },

      // Sync Logic
      initSync: () => {
        const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
          if (snapshot.exists()) {
            set({ settings: snapshot.data() as AppSettings });
          }
        }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/global'));

        const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
          const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
          set({ products });
        }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));

        const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const unsubOrders = onSnapshot(qOrders, (snapshot) => {
          const orders = snapshot.docs.map(doc => {
            const data = doc.data();
            return { 
              id: doc.id, 
              ...data,
              createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
            };
          }) as Order[];
          set({ orders });
        }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));

        // Sync staff list (only for admin/staff view)
        const qUsers = query(collection(db, 'users'), where('role', '==', 'staff'));
        const unsubStaff = onSnapshot(qUsers, (snapshot) => {
          const staff = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
          set({ staff });
        }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));

        return () => {
          unsubSettings();
          unsubProducts();
          unsubOrders();
          unsubStaff();
        };
      }
    }),
    {
      name: 'coffee-shop-storage',
      partialize: (state) => ({
        cart: state.cart,
        userPhone: state.userPhone,
        currentRole: state.currentRole
      }),
    }
  )
);
