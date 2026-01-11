
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  CreditCard, 
  Package, 
  UserCircle, 
  LogOut, 
  Search, 
  Plus, 
  TrendingUp, 
  AlertCircle,
  Menu,
  X,
  Sparkles,
  MapPin,
  Smartphone,
  Hash,
  ShieldCheck,
  Briefcase,
  Power,
  PowerOff,
  Zap,
  Edit2,
  CheckCircle2,
  Printer,
  Trash2,
  Wallet,
  CalendarDays,
  Tag,
  Lock,
  Store,
  RefreshCw,
  Calendar,
  ChevronRight,
  HandCoins,
  Languages,
  UserPlus,
  KeyRound,
  Eye,
  EyeOff,
  MapPinned,
  UserMinus,
  Filter,
  ArrowRightLeft,
  Settings,
  Bell,
  Globe,
  Coins
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { UserRole, Customer, Transaction, Plan, User, PlanDuration } from './types';
import { getBillingAnalysis } from './services/geminiService';

// --- Types ---
interface Area {
  id: string;
  name: string;
  code?: string;
}

// --- Translations ---

const translations = {
  en: {
    dashboard: 'Dashboard',
    customers: 'Customers',
    plans: 'Plans',
    resellers: 'Resellers',
    employees: 'Employees',
    transactions: 'Transactions',
    areas: 'Areas',
    settings: 'Settings',
    logout: 'Logout',
    search: 'Search',
    addCustomer: 'Add Customer',
    editCustomer: 'Edit Customer',
    addPlan: 'Create Plan',
    editPlan: 'Edit Plan',
    addStaff: 'Add Staff',
    editStaff: 'Edit Staff',
    addReseller: 'Add Reseller',
    addArea: 'Add Area',
    editArea: 'Edit Area',
    totalActive: 'Active Users',
    overdue: 'Overdue Connections',
    totalPlans: 'Total Plans',
    lifeTimeRevenue: 'Life-time Revenue',
    todayCollection: 'Today\'s Collection',
    monthlyCollection: 'This Month',
    totalDue: 'Total Due',
    revenueTrend: 'Revenue Trend',
    statusBreakdown: 'Status Breakdown',
    aiAssistant: 'Smart Billing Assistant',
    generateInsight: 'Generate Insight',
    analyzing: 'Analyzing...',
    noInsight: 'Click "Generate Insight" to get an AI analysis.',
    customerTable: {
      customer: 'Customer',
      userId: 'User ID',
      plan: 'Plan',
      joined: 'Joined On',
      expiry: 'Expiry',
      status: 'Status',
      action: 'Action'
    },
    billingTable: {
      date: 'Date',
      customer: 'Customer',
      amount: 'Amount',
      collectedBy: 'Collected By',
      status: 'Status',
      paid: 'Paid'
    },
    staffTable: {
      name: 'Full Name',
      role: 'Username / Role',
      contact: 'Contact',
      joined: 'Joined On',
      collectedToday: 'Collections Today',
      action: 'Action'
    },
    collect: 'Collect',
    payOn: 'Pay & On',
    disable: 'Disable',
    enable: 'Enable',
    enableAll: 'Enable All',
    reviewAll: 'Review All Due',
    confirmPayment: 'Confirm Payment',
    confirmPrint: 'Confirm & Print',
    confirmOnly: 'Confirm Only',
    cancel: 'Cancel',
    updateDate: 'Update Date',
    edit: 'Edit',
    delete: 'Delete',
    active: 'ACTIVE',
    expired: 'EXPIRED',
    disconnected: 'OFF',
    billingTarget: 'Estimated Monthly Target',
    duration: 'Duration',
    days: 'days',
    rolling: 'Date Rolling',
    save: 'Save',
    create: 'Create',
    phone: 'Phone',
    address: 'Address',
    area: 'Area',
    password: 'Password',
    login: 'Login',
    loginToAccount: 'Login to your account',
    invalidCreds: 'Invalid username or password',
    confirmLogout: 'Confirm Logout',
    logoutMessage: 'Are you sure you want to end your session?',
    searchTransaction: 'Search transaction...',
    sections: {
      main: 'Main',
      operations: 'Operations',
      finance: 'Finance',
      administration: 'Administration'
    },
    settingsView: {
      companyInfo: 'Company Information',
      systemConfig: 'System Configuration',
      compName: 'Company Name',
      supportContact: 'Support Contact',
      currency: 'Currency Symbol',
      autoPrint: 'Auto-print Invoices',
      enableAi: 'Enable AI Assistant',
      saveChanges: 'Save Configuration'
    }
  },
  bn: {
    dashboard: 'ড্যাশবোর্ড',
    customers: 'গ্রাহক তালিকা',
    plans: 'প্যাকেজসমূহ',
    resellers: 'রিসেলার',
    employees: 'কর্মকর্তা',
    transactions: 'লেনদেন',
    areas: 'এলাকা তালিকা',
    settings: 'সেটিংস',
    logout: 'লগআউট',
    search: 'অনুসন্ধান করুন',
    addCustomer: 'নতুন গ্রাহক',
    editCustomer: 'গ্রাহক পরিবর্তন',
    addPlan: 'প্যাকেজ তৈরি',
    editPlan: 'প্যাকেজ পরিবর্তন',
    addStaff: 'স্টাফ যুক্ত করুন',
    editStaff: 'স্টাফ পরিবর্তন',
    addReseller: 'রিসেলার যুক্ত করুন',
    addArea: 'এলাকা যুক্ত করুন',
    editArea: 'এলাকা পরিবর্তন',
    totalActive: 'সক্রিয় গ্রাহক',
    overdue: 'বকেয়া সংযোগ',
    totalPlans: 'মোট প্যাকেজ',
    lifeTimeRevenue: 'সর্বমোট আয়',
    todayCollection: 'আজকের কালেকশন',
    monthlyCollection: 'এই মাসের কালেকশন',
    totalDue: 'মোট বকেয়া (Due)',
    revenueTrend: 'আয়ের প্রবণতা',
    statusBreakdown: 'অবস্থার বিশ্লেষণ',
    aiAssistant: 'স্মার্ট বিলিং অ্যাসিস্ট্যান্ট',
    generateInsight: 'বিশ্লেষণ করুন',
    analyzing: 'বিশ্লেষণ চলছে...',
    noInsight: 'AI বিশ্লেষণের জন্য "বিশ্লেষণ করুন" বাটনে ক্লিক করুন।',
    customerTable: {
      customer: 'গ্রাহক',
      userId: 'ইউজার আইডি',
      plan: 'প্যাকেজ',
      joined: 'যোগদানের তারিখ',
      expiry: 'মেয়াদ শেষ',
      status: 'অবস্থা',
      action: 'অ্যাকশন'
    },
    billingTable: {
      date: 'তারিখ',
      customer: 'গ্রাহক',
      amount: 'টাকা',
      collectedBy: 'সংগ্রহকারী',
      status: 'অবস্থা',
      paid: 'পরিশোধিত'
    },
    staffTable: {
      name: 'পুরো নাম',
      role: 'ইউজারনেম / পদবী',
      contact: 'যোগাযোগ',
      joined: 'যোগদানের তারিখ',
      collectedToday: 'আজকের সংগ্রহ',
      action: 'অ্যাকশন'
    },
    collect: 'সংগ্রহ',
    payOn: 'বিল ও সংযোগ',
    disable: 'বন্ধ করুন',
    enable: 'চালু করুন',
    enableAll: 'সব চালু করুন',
    reviewAll: 'সব বকেয়া দেখুন',
    confirmPayment: 'পেমেন্ট নিশ্চিত করুন',
    confirmPrint: 'নিশ্চিত ও প্রিন্ট',
    confirmOnly: 'শুধু নিশ্চিত করুন',
    cancel: 'বাতিল',
    updateDate: 'তারিখ পরিবর্তন',
    edit: 'সম্পাদনা',
    delete: 'ডিলিট',
    active: 'সক্রিয়',
    expired: 'মেয়াদোত্তীর্ণ',
    disconnected: 'বন্ধ',
    billingTarget: 'মাসিক লক্ষ্যমাত্রা',
    duration: 'মেয়াদ',
    days: 'দিন',
    rolling: 'তারিখ রোলিং',
    save: 'সংরক্ষণ',
    create: 'তৈরি করুন',
    phone: 'ফোন',
    address: 'ঠিকানা',
    area: 'এলাকা',
    password: 'পাসওয়ার্ড',
    login: 'লগইন',
    loginToAccount: 'আপনার অ্যাকাউন্টে লগইন করুন',
    invalidCreds: 'ভুল ইউজারনেম অথবা পাসওয়ার্ড',
    confirmLogout: 'লগআউট নিশ্চিত করুন',
    logoutMessage: 'আপনি কি নিশ্চিত যে আপনি আপনার সেশনটি বন্ধ করতে চান?',
    searchTransaction: 'লেনদেন অনুসন্ধান...',
    sections: {
      main: 'মূল মেনু',
      operations: 'অপারেশন',
      finance: 'আর্থিক',
      administration: 'প্রশাসন'
    },
    settingsView: {
      companyInfo: 'কোম্পানি তথ্য',
      systemConfig: 'সিস্টেম কনফিগারেশন',
      compName: 'কোম্পানির নাম',
      supportContact: 'সাপোর্ট কন্টাক্ট',
      currency: 'কারেন্সি চিহ্ন',
      autoPrint: 'অটো ইনভয়েস প্রিন্ট',
      enableAi: 'AI অ্যাসিস্ট্যান্ট চালু করুন',
      saveChanges: 'কনফিগারেশন সেভ করুন'
    }
  }
};

// --- Modals ---

const LogoutModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; t: any }> = ({ isOpen, onClose, onConfirm, t }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6 shadow-inner">
          <LogOut size={40}/>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">{t.confirmLogout}</h3>
        <p className="text-gray-400 text-sm font-medium mb-8">{t.logoutMessage}</p>
        <div className="flex flex-col space-y-3">
          <button onClick={onConfirm} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all">{t.logout}</button>
          <button onClick={onClose} className="w-full py-3 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all">{t.cancel}</button>
        </div>
      </div>
    </div>
  );
};

const AddCustomerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id'>) => void;
  plans: Plan[];
  areas: Area[];
  t: any;
}> = ({ isOpen, onClose, onSave, plans, areas, t }) => {
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', userId: '', planId: plans[0]?.id || '', status: 'ACTIVE' as Customer['status'],
    lastPaymentDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    assignedArea: areas[0]?.name || '', joiningDate: new Date().toISOString().split('T')[0]
  });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-bold mb-4">{t.addCustomer}</h3>
        <div className="space-y-3">
          <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg" />
          <input type="text" placeholder={t.phone} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded-lg" />
          <input type="text" placeholder="User ID" value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} className="w-full p-2 border rounded-lg" />
          <input type="text" placeholder={t.address} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border rounded-lg" />
          <select value={formData.assignedArea} onChange={e => setFormData({...formData, assignedArea: e.target.value})} className="w-full p-2 border rounded-lg bg-white">
            <option value="">Select Area</option>
            {areas.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
          <select value={formData.planId} onChange={e => setFormData({...formData, planId: e.target.value})} className="w-full p-2 border rounded-lg bg-white">
            {plans.map(p => <option key={p.id} value={p.id}>{p.name} (৳{p.price})</option>)}
          </select>
        </div>
        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold">{t.cancel}</button>
          <button onClick={() => { onSave(formData); onClose(); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">{t.create}</button>
        </div>
      </div>
    </div>
  );
};

const EditCustomerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  customer: Customer | null;
  plans: Plan[];
  areas: Area[];
  t: any;
}> = ({ isOpen, onClose, onSave, customer, plans, areas, t }) => {
  const [formData, setFormData] = useState<Customer | null>(null);
  useEffect(() => { if (customer) setFormData(customer); }, [customer]);
  if (!isOpen || !formData) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-bold mb-4">{t.editCustomer}</h3>
        <div className="space-y-3">
          <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg" />
          <input type="text" placeholder={t.phone} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded-lg" />
          <input type="text" placeholder={t.address} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border rounded-lg" />
          <select value={formData.assignedArea} onChange={e => setFormData({...formData, assignedArea: e.target.value})} className="w-full p-2 border rounded-lg bg-white">
            <option value="">Select Area</option>
            {areas.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
          <select value={formData.planId} onChange={e => setFormData({...formData, planId: e.target.value})} className="w-full p-2 border rounded-lg bg-white">
            {plans.map(p => <option key={p.id} value={p.id}>{p.name} (৳{p.price})</option>)}
          </select>
          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full p-2 border rounded-lg bg-white">
            <option value="ACTIVE">ACTIVE</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="DISCONNECTED">OFF</option>
          </select>
        </div>
        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold">{t.cancel}</button>
          <button onClick={() => { onSave(formData); onClose(); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">{t.save}</button>
        </div>
      </div>
    </div>
  );
};

const AddAreaModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (area: Omit<Area, 'id'>) => void; t: any }> = ({ isOpen, onClose, onSave, t }) => {
  const [name, setName] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-xl font-bold mb-4">{t.addArea}</h3>
        <input type="text" placeholder="Area Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded-lg mb-4" />
        <div className="flex space-x-3">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold">{t.cancel}</button>
          <button onClick={() => { onSave({ name }); onClose(); setName(''); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">{t.create}</button>
        </div>
      </div>
    </div>
  );
};

const EditAreaModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (area: Area) => void; area: Area | null; t: any }> = ({ isOpen, onClose, onSave, area, t }) => {
  const [name, setName] = useState('');
  useEffect(() => { if (area) setName(area.name); }, [area]);
  if (!isOpen || !area) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-xl font-bold mb-4">{t.editArea}</h3>
        <input type="text" placeholder="Area Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded-lg mb-4" />
        <div className="flex space-x-3">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold">{t.cancel}</button>
          <button onClick={() => { onSave({ ...area, name }); onClose(); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">{t.save}</button>
        </div>
      </div>
    </div>
  );
};

const AddPlanModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Omit<Plan, 'id'>) => void;
  t: any;
}> = ({ isOpen, onClose, onSave, t }) => {
  const [formData, setFormData] = useState({
    name: '', price: 0, durationDays: 30, discount: 0, dateRoll: false
  });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">{t.addPlan}</h3>
        <div className="space-y-3">
          <input type="text" placeholder="Package Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
            <input type="number" placeholder="Discount" value={formData.discount} onChange={e => setFormData({...formData, discount: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
          </div>
          <input type="number" placeholder="Duration (Days)" value={formData.durationDays} onChange={e => setFormData({...formData, durationDays: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
          <label className="flex items-center space-x-2 text-sm">
            <input type="checkbox" checked={formData.dateRoll} onChange={e => setFormData({...formData, dateRoll: e.target.checked})} />
            <span>{t.rolling}</span>
          </label>
        </div>
        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold">{t.cancel}</button>
          <button onClick={() => { onSave(formData); onClose(); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">{t.create}</button>
        </div>
      </div>
    </div>
  );
};

const EditPlanModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Plan) => void;
  plan: Plan | null;
  t: any;
}> = ({ isOpen, onClose, onSave, plan, t }) => {
  const [formData, setFormData] = useState<Plan | null>(null);
  useEffect(() => { if (plan) setFormData(plan); }, [plan]);
  if (!isOpen || !formData) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">{t.editPlan}</h3>
        <div className="space-y-3">
          <input type="text" placeholder="Package Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
            <input type="number" placeholder="Discount" value={formData.discount} onChange={e => setFormData({...formData, discount: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
          </div>
          <input type="number" placeholder="Duration (Days)" value={formData.durationDays} onChange={e => setFormData({...formData, durationDays: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
          <label className="flex items-center space-x-2 text-sm">
            <input type="checkbox" checked={formData.dateRoll} onChange={e => setFormData({...formData, dateRoll: e.target.checked})} />
            <span>{t.rolling}</span>
          </label>
        </div>
        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold">{t.cancel}</button>
          <button onClick={() => { onSave(formData); onClose(); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">{t.save}</button>
        </div>
      </div>
    </div>
  );
};

const AddEmployeeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id'>) => void;
  t: any;
}> = ({ isOpen, onClose, onSave, t }) => {
  const [formData, setFormData] = useState({
    username: '', fullName: '', phone: '', role: UserRole.EMPLOYEE, password: '', joiningDate: new Date().toISOString().split('T')[0]
  });
  const [showPass, setShowPass] = useState(false);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">{t.addStaff}</h3>
        <div className="space-y-3">
          <input type="text" placeholder={t.staffTable.name} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-2 border rounded-lg" />
          <input type="text" placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full p-2 border rounded-lg" />
          <div className="relative">
            <input type={showPass ? "text" : "password"} placeholder={t.password} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 border rounded-lg" />
            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
          </div>
          <input type="text" placeholder={t.staffTable.contact} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded-lg" />
          <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})} className="w-full p-2 border rounded-lg bg-white">
            <option value={UserRole.EMPLOYEE}>Collector</option>
            <option value={UserRole.RESELLER}>Reseller</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </select>
        </div>
        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold">{t.cancel}</button>
          <button onClick={() => { onSave(formData); onClose(); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">{t.create}</button>
        </div>
      </div>
    </div>
  );
};

const EditEmployeeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user: User | null;
  t: any;
}> = ({ isOpen, onClose, onSave, user, t }) => {
  const [formData, setFormData] = useState<User | null>(null);
  const [showPass, setShowPass] = useState(false);
  useEffect(() => { if (user) setFormData(user); }, [user]);
  if (!isOpen || !formData) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">{t.editStaff}</h3>
        <div className="space-y-3">
          <input type="text" placeholder={t.staffTable.name} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-2 border rounded-lg" />
          <div className="relative">
            <input type={showPass ? "text" : "password"} placeholder={t.password} value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 border rounded-lg" />
            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
          </div>
          <input type="text" placeholder={t.staffTable.contact} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded-lg" />
          <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})} className="w-full p-2 border rounded-lg bg-white">
            <option value={UserRole.EMPLOYEE}>Collector</option>
            <option value={UserRole.RESELLER}>Reseller</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </select>
        </div>
        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold">{t.cancel}</button>
          <button onClick={() => { onSave(formData); onClose(); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">{t.save}</button>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const SidebarHeader: React.FC<{ label: string }> = ({ label }) => (
  <div className="px-4 pt-6 pb-2">
    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">{label}</span>
  </div>
);

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl transition-all relative overflow-hidden group ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold scale-[1.02]' 
        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 font-medium'
    }`}
  >
    <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>{icon}</span>
    <span className="text-sm truncate">{label}</span>
    {active && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 rounded-full my-2 mr-2"></div>}
  </button>
);

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
    <div className={`p-3 rounded-lg ${color} text-white`}>{icon}</div>
    <div><p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{label}</p><h3 className="text-2xl font-black text-gray-900">{value}</h3></div>
  </div>
);

const CircularMetric: React.FC<{ label: string; value: number; total: number; color: string; icon: React.ReactNode }> = ({ label, value, total, color, icon }) => {
  const data = [{ value: value }, { value: Math.max(0, total - value) }];
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4"><div className={`p-2 rounded-lg bg-gray-50 text-gray-600`}>{icon}</div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right line-clamp-1">{label}</span></div>
      <div className="relative w-32 h-32"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={45} paddingAngle={2} dataKey="value" startAngle={90} endAngle={450}><Cell fill={color} /><Cell fill="#F3F4F6" /></Pie></PieChart></ResponsiveContainer><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-lg font-black text-gray-900 leading-none">৳{value}</span></div></div>
    </div>
  );
};

const AdjustExpiryModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: (newDate: string) => void; customer: Customer | null; t: any }> = ({ isOpen, onClose, onConfirm, customer, t }) => {
  const [newDate, setNewDate] = useState('');
  useEffect(() => { if (customer) setNewDate(customer.expiryDate); }, [customer]);
  if (!isOpen || !customer) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-xl font-bold mb-4">{t.updateDate}</h3>
        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full p-2 border rounded-lg mb-4" />
        <div className="flex space-x-3"><button onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold">{t.cancel}</button><button onClick={() => onConfirm(newDate)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">{t.save}</button></div>
      </div>
    </div>
  );
};

const BulkCollectionModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; onIndividualCollect: (customer: Customer, shouldPrint: boolean) => void; overdueCustomers: Customer[]; plans: Plan[]; t: any }> = ({ isOpen, onClose, onConfirm, onIndividualCollect, overdueCustomers, plans, t }) => {
  if (!isOpen) return null;
  const totalAmount = overdueCustomers.reduce((sum, c) => {
    const plan = plans.find(p => p.id === c.planId);
    return sum + (plan ? plan.price - (plan.discount || 0) : 0);
  }, 0);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2 text-orange-600"><Zap size={20} /><h3 className="text-xl font-bold text-gray-900">{t.reviewAll}</h3></div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {overdueCustomers.map(customer => {
            const plan = plans.find(p => p.id === customer.planId);
            const amount = plan ? plan.price - (plan.discount || 0) : 0;
            return (
              <div key={customer.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50 transition-colors">
                <div><p className="text-sm font-bold text-gray-900">{customer.name}</p><p className="text-[10px] font-mono text-gray-500">৳{amount} - {plan?.name}</p></div>
                <div className="flex space-x-1">
                  <button onClick={() => onIndividualCollect(customer, true)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"><Printer size={16} /></button>
                  <button onClick={() => onIndividualCollect(customer, false)} className="px-3 py-1 bg-orange-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-orange-700 transition-colors">{t.collect}</button>
                </div>
              </div>
            );
          })}
          <div className="bg-orange-50 p-6 rounded-2xl text-center shadow-inner"><p className="text-xs text-orange-700 font-bold uppercase tracking-widest">{t.totalDue}</p><p className="text-3xl font-black text-orange-600">৳{totalAmount}</p></div>
        </div>
        <div className="p-6 border-t flex space-x-3">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">{t.cancel}</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all">{t.reviewAll}</button>
        </div>
      </div>
    </div>
  );
};

const CollectBillModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: (shouldPrint: boolean) => void; customer: Customer | null; plan: Plan | undefined; t: any }> = ({ isOpen, onClose, onConfirm, customer, plan, t }) => {
  if (!isOpen || !customer || !plan) return null;
  const payableAmount = plan.price - (plan.discount || 0);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
          <CreditCard size={32}/>
        </div>
        <h3 className="text-xl font-bold mb-4">{t.confirmPayment}</h3>
        <p className="text-sm text-gray-500 mb-6 px-4">Confirm payment of <span className="font-black text-gray-900 italic text-lg">৳{payableAmount}</span> for {customer.name}?</p>
        <div className="flex flex-col space-y-3">
           <button onClick={() => onConfirm(true)} className="py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"><Printer size={18} /><span>{t.confirmPrint}</span></button>
           <button onClick={() => onConfirm(false)} className="py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg shadow-gray-900/10 hover:bg-black transition-all">{t.confirmOnly}</button>
           <button onClick={onClose} className="py-2 text-gray-400 font-bold hover:text-gray-600 transition-colors">{t.cancel}</button>
        </div>
      </div>
    </div>
  )
}

const DeleteModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; name: string; t: any }> = ({ isOpen, onClose, onConfirm, title, name, t }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <h3 className="text-xl font-bold mb-4 text-red-600">{title}</h3>
        <p className="text-gray-600 mb-6 px-4">Are you sure you want to delete <span className="font-black text-gray-900">{name}</span>? This action cannot be undone.</p>
        <div className="flex space-x-3"><button onClick={onClose} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-all">{t.cancel}</button><button onClick={onConfirm} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">{t.delete}</button></div>
      </div>
    </div>
  );
};

const EnableAllModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; count: number; t: any }> = ({ isOpen, onClose, onConfirm, count, t }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <h3 className="text-xl font-bold mb-4 text-green-600">{t.enableAll}</h3>
        <p className="text-gray-600 mb-6 px-4">Restore access for all <span className="font-black text-gray-900">{count}</span> customers?</p>
        <div className="flex space-x-3"><button onClick={onClose} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-all">{t.cancel}</button><button onClick={onConfirm} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all">Restore All</button></div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentLang, setCurrentLang] = useState<'en' | 'bn'>('en');
  const t = translations[currentLang];
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'plans' | 'billing' | 'employees' | 'resellers' | 'areas' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Login UI state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Modals visibility
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [isCollectBillModalOpen, setIsCollectBillModalOpen] = useState(false);
  const [isDeleteCustomerModalOpen, setIsDeleteCustomerModalOpen] = useState(false);
  const [isDeleteEmployeeModalOpen, setIsDeleteEmployeeModalOpen] = useState(false);
  const [isDeletePlanModalOpen, setIsDeletePlanModalOpen] = useState(false);
  const [isBulkCollectionModalOpen, setIsBulkCollectionModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [isAdjustExpiryModalOpen, setIsAdjustExpiryModalOpen] = useState(false);
  const [isEnableAllModalOpen, setIsEnableAllModalOpen] = useState(false);
  const [isAddAreaModalOpen, setIsAddAreaModalOpen] = useState(false);
  const [isEditAreaModalOpen, setIsEditAreaModalOpen] = useState(false);
  const [isDeleteAreaModalOpen, setIsDeleteAreaModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Selections for editing/deleting
  const [selectedCustomerForEdit, setSelectedCustomerForEdit] = useState<Customer | null>(null);
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<Plan | null>(null);
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState<User | null>(null);
  const [selectedCustomerForCollection, setSelectedCustomerForCollection] = useState<Customer | null>(null);
  const [selectedAreaForEdit, setSelectedAreaForEdit] = useState<Area | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<User | null>(null);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [areaToDelete, setAreaToDelete] = useState<Area | null>(null);
  const [customerForDateAdjustment, setCustomerForDateAdjustment] = useState<Customer | null>(null);
  
  // Filtering
  const [billingSearch, setBillingSearch] = useState('');
  
  // Settings State
  const [settings, setSettings] = useState({
    companyName: 'ISP Billing Pro',
    supportPhone: '01700000000',
    currency: '৳',
    autoPrint: true,
    enableAi: true
  });

  // Data State
  const [customers, setCustomers] = useState<Customer[]>([
    { id: '1', name: 'Rahim Ahmed', phone: '01711223344', address: 'Dhanmondi, Dhaka', userId: 'USR-001', planId: 'p1', status: 'ACTIVE', lastPaymentDate: '2023-10-01', expiryDate: '2023-11-01', assignedArea: 'Dhanmondi', joiningDate: '2023-01-15' },
    { id: '2', name: 'Karim Ullah', phone: '01811223344', address: 'Mirpur, Dhaka', userId: 'USR-002', planId: 'p1', status: 'EXPIRED', lastPaymentDate: '2023-09-01', expiryDate: '2023-10-01', assignedArea: 'Mirpur', joiningDate: '2023-02-10' },
  ]);

  const [employees, setEmployees] = useState<User[]>([
    { id: 'e1', username: 'admin', fullName: 'Sarah Boss', phone: '01711223344', role: UserRole.ADMIN, password: 'admin', joiningDate: '2022-12-01' },
    { id: 'e2', username: 'john', fullName: 'John Field', phone: '01700112233', role: UserRole.EMPLOYEE, password: 'john', joiningDate: '2023-01-01' },
    { id: 'e3', username: 'mike', fullName: 'Mike Ahmed', phone: '01700445566', role: UserRole.EMPLOYEE, password: 'mike', joiningDate: '2023-03-15' },
    { id: 'r1', username: 'reseller', fullName: 'SkyLink Reseller', phone: '01888112233', role: UserRole.RESELLER, password: 'reseller', joiningDate: '2023-05-10' },
  ]);

  const [plans, setPlans] = useState<Plan[]>([
    { id: 'p1', name: 'Monthly Standard', price: 500, durationDays: 30, discount: 0, dateRoll: false },
    { id: 'p2', name: 'Yearly Premium', price: 5000, durationDays: 365, discount: 500, dateRoll: true },
  ]);

  const [areas, setAreas] = useState<Area[]>([
    { id: 'a1', name: 'Dhanmondi' },
    { id: 'a2', name: 'Mirpur' },
    { id: 'a3', name: 'Uttara' },
    { id: 'a4', name: 'Mohammadpur' },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 't1', customerId: '1', customerName: 'Rahim Ahmed', amount: 500, date: '2023-10-01', collectedBy: 'Sarah Boss' },
    { id: 't2', customerId: '2', customerName: 'Karim Ullah', amount: 500, date: '2023-10-02', collectedBy: 'John Field' },
    { id: 't3', customerId: '1', customerName: 'Rahim Ahmed', amount: 500, date: '2023-11-01', collectedBy: 'Sarah Boss' },
  ]);

  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Derived State
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const currentMonthYear = useMemo(() => new Date().toISOString().substring(0, 7), []);
  const overdueCustomersList = useMemo(() => customers.filter(c => c.status === 'EXPIRED'), [customers]);
  const nonActiveCustomersCount = useMemo(() => customers.filter(c => c.status !== 'ACTIVE').length, [customers]);
  const dailyCollection = useMemo(() => transactions.filter(t => t.date === today).reduce((sum, t) => sum + t.amount, 0), [transactions, today]);
  const monthlyCollection = useMemo(() => transactions.filter(t => t.date.startsWith(currentMonthYear)).reduce((sum, t) => sum + t.amount, 0), [transactions, currentMonthYear]);
  const estimatedMonthlyTarget = useMemo(() => customers.reduce((sum, c) => {
    const plan = plans.find(p => p.id === c.planId);
    return sum + (plan ? plan.price - (plan.discount || 0) : 0);
  }, 0), [customers, plans]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.customerName.toLowerCase().includes(billingSearch.toLowerCase()) ||
      t.collectedBy.toLowerCase().includes(billingSearch.toLowerCase())
    );
  }, [transactions, billingSearch]);

  // Handlers
  const toggleLanguage = () => setCurrentLang(prev => prev === 'en' ? 'bn' : 'en');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = employees.find(emp => emp.username === loginForm.username && emp.password === loginForm.password);
    if (user) {
      setActiveUser(user);
      setLoginError('');
      if (user.role === UserRole.RESELLER) setActiveTab('customers');
      else setActiveTab('dashboard');
    } else {
      setLoginError(t.invalidCreds);
    }
  };

  const handleLogout = () => {
    setActiveUser(null);
    setLoginForm({ username: '', password: '' });
    setIsLogoutModalOpen(false);
  };

  // State Updates
  const handleSaveArea = (data: Omit<Area, 'id'>) => setAreas([...areas, { ...data, id: Math.random().toString(36).substr(2, 5) }]);
  const handleUpdateArea = (data: Area) => setAreas(areas.map(a => a.id === data.id ? data : a));
  const handleSavePlan = (data: Omit<Plan, 'id'>) => setPlans([...plans, { ...data, id: Math.random().toString(36).substr(2, 5) }]);
  const handleUpdatePlan = (data: Plan) => setPlans(plans.map(p => p.id === data.id ? data : p));
  const handleSaveEmployee = (data: Omit<User, 'id'>) => setEmployees([...employees, { ...data, id: Math.random().toString(36).substr(2, 5) }]);
  const handleUpdateEmployee = (data: User) => setEmployees(employees.map(e => e.id === data.id ? data : e));
  const handleSaveCustomer = (data: Omit<Customer, 'id'>) => setCustomers([...customers, { ...data, id: Math.random().toString(36).substr(2, 5) }]);
  const handleUpdateCustomer = (data: Customer) => setCustomers(customers.map(c => c.id === data.id ? data : c));

  const handleEnableCustomer = (customerId: string) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, status: 'ACTIVE' } : c));
  };

  const handleAdjustExpiryConfirm = (newDate: string) => {
    if (customerForDateAdjustment) {
      const todayDate = new Date().toISOString().split('T')[0];
      const newStatus = newDate >= todayDate ? 'ACTIVE' : 'EXPIRED';
      setCustomers(prev => prev.map(c => c.id === customerForDateAdjustment.id ? { ...c, expiryDate: newDate, status: (c.status === 'DISCONNECTED' ? 'DISCONNECTED' : newStatus) } : c));
      setIsAdjustExpiryModalOpen(false);
      setCustomerForDateAdjustment(null);
    }
  };

  const addTransaction = (customerId: string, amount: number, shouldPrint: boolean = false) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return null;
    const newTransaction: Transaction = { id: Math.random().toString(36).substr(2, 9), customerId, customerName: customer.name, amount, date: new Date().toISOString().split('T')[0], collectedBy: activeUser?.fullName || 'System' };
    setTransactions(prev => [newTransaction, ...prev]);
    const plan = plans.find(p => p.id === customer.planId);
    if (plan) {
      const todayDate = new Date();
      const currentExpiry = new Date(customer.expiryDate);
      const baseDate = plan.dateRoll ? currentExpiry : (customer.status === 'ACTIVE' && currentExpiry > todayDate ? currentExpiry : todayDate);
      const newExpiry = new Date(baseDate);
      newExpiry.setDate(newExpiry.getDate() + plan.durationDays);
      setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, status: 'ACTIVE', lastPaymentDate: newTransaction.date, expiryDate: newExpiry.toISOString().split('T')[0] } : c));
      if (shouldPrint || settings.autoPrint) handlePrintInvoice(newTransaction);
    }
    return newTransaction;
  };

  const handleCollectionConfirm = (shouldPrint: boolean) => {
    if (selectedCustomerForCollection) {
      const plan = plans.find(p => p.id === selectedCustomerForCollection.planId);
      if (plan) addTransaction(selectedCustomerForCollection.id, plan.price - (plan.discount || 0), shouldPrint);
      setIsCollectBillModalOpen(false);
      setSelectedCustomerForCollection(null);
    }
  };

  const handleBulkCollection = () => {
    overdueCustomersList.forEach(c => {
      const plan = plans.find(p => p.id === c.planId);
      if (plan) addTransaction(c.id, plan.price - (plan.discount || 0), false);
    });
    setIsBulkCollectionModalOpen(false);
  };

  const handleIndividualBulkCollect = (customer: Customer, shouldPrint: boolean) => {
    const plan = plans.find(p => p.id === customer.planId);
    if (plan) addTransaction(customer.id, plan.price - (plan.discount || 0), shouldPrint);
  };

  const handleEnableAllConfirm = () => {
    setCustomers(prev => prev.map(c => ({ ...c, status: 'ACTIVE' as const })));
    setIsEnableAllModalOpen(false);
  };

  const handlePrintInvoice = (transaction: Transaction) => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (printWindow) {
      printWindow.document.write(`<html><body style="font-family:monospace;width:300px;padding:20px;"><h3>${settings.companyName} Receipt</h3><hr/><p>Date: ${transaction.date}</p><p>Customer: ${transaction.customerName}</p><p>Amount: ${settings.currency}${transaction.amount}</p><hr/><p style="text-align:center">Thank you!</p></body></html>`);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const fetchAiInsight = async () => {
    setLoadingAi(true);
    const summary = await getBillingAnalysis(customers, transactions);
    setAiInsight(summary || 'Error.');
    setLoadingAi(false);
  };

  // --- Views ---

  const DashboardView = () => (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CircularMetric label={t.todayCollection} value={dailyCollection} total={5000} color="#10B981" icon={<TrendingUp size={20} />} />
        <CircularMetric label={t.monthlyCollection} value={monthlyCollection} total={estimatedMonthlyTarget} color="#3B82F6" icon={<CalendarDays size={20} />} />
        <CircularMetric label={t.totalDue} value={estimatedMonthlyTarget - monthlyCollection} total={estimatedMonthlyTarget} color="#F59E0B" icon={<Wallet size={20} />} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t.totalActive} value={customers.filter(c => c.status === 'ACTIVE').length} icon={<Users size={20}/>} color="bg-blue-500" />
        <StatCard label={t.overdue} value={overdueCustomersList.length} icon={<AlertCircle size={20}/>} color="bg-red-500" />
        <StatCard label={t.totalPlans} value={plans.length} icon={<Package size={20}/>} color="bg-purple-500" />
        <StatCard label={t.lifeTimeRevenue} value={`${settings.currency}${transactions.reduce((s,t) => s+t.amount, 0)}`} icon={<CreditCard size={20}/>} color="bg-gray-800" />
      </div>
      {activeUser?.role === UserRole.ADMIN && settings.enableAi && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-xl shadow-inner">
          <div className="flex items-center justify-between mb-4"><div className="flex items-center space-x-2 text-blue-700 font-bold uppercase tracking-wider"><Sparkles size={20} /><h3>{t.aiAssistant}</h3></div><button onClick={fetchAiInsight} disabled={loadingAi} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">{loadingAi ? t.analyzing : t.generateInsight}</button></div>
          {aiInsight ? <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap font-medium">{aiInsight}</div> : <p className="text-gray-400 italic text-sm text-center py-4">{t.noInsight}</p>}
        </div>
      )}
    </div>
  );

  const CustomersView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-md">
        <div className="relative flex-1 group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} /><input type="text" placeholder={t.search} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium" /></div>
        <div className="flex flex-wrap items-center gap-3">
          {activeUser?.role === UserRole.ADMIN && (
            <>
              {nonActiveCustomersCount > 0 && <button onClick={() => setIsEnableAllModalOpen(true)} className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-black shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all"><Power size={18} /><span>{t.enableAll}</span></button>}
              {overdueCustomersList.length > 0 && <button onClick={() => setIsBulkCollectionModalOpen(true)} className="flex items-center space-x-2 border-2 border-orange-600 text-orange-600 px-4 py-2 rounded-xl font-black text-sm hover:bg-orange-50 transition-all"><Zap size={18} /><span>{t.reviewAll}</span></button>}
            </>
          )}
          <button onClick={() => setIsAddCustomerModalOpen(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"><Plus size={20} /><span>{t.addCustomer}</span></button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-xs font-bold uppercase tracking-widest text-gray-400 border-b">
            <tr>
              <th className="px-6 py-5">{t.customerTable.customer}</th>
              <th className="px-6 py-5">{t.customerTable.expiry}</th>
              <th className="px-6 py-5">{t.area}</th>
              <th className="px-6 py-5">{t.customerTable.status}</th>
              <th className="px-6 py-5 text-center">{t.customerTable.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {customers.map(c => (
              <tr key={c.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-400 font-mono">ID: {c.userId}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 font-medium text-gray-600">
                    <Calendar size={14} className="text-gray-400"/>
                    <span>{c.expiryDate}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-gray-600 font-bold bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                    <MapPin size={14} className="text-blue-500"/>
                    <span className="text-xs">{c.assignedArea}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                    {c.status !== 'ACTIVE' && (
                      <button 
                        onClick={() => handleEnableCustomer(c.id)} 
                        title={t.enable}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                      >
                        <Power size={16}/>
                      </button>
                    )}
                    <button onClick={() => { setCustomerForDateAdjustment(c); setIsAdjustExpiryModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-xl"><Calendar size={16}/></button>
                    <button onClick={() => { setSelectedCustomerForCollection(c); setIsCollectBillModalOpen(true); }} className="px-4 py-1 bg-white border-2 border-blue-600 font-black text-[10px] text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">{t.collect}</button>
                    <button onClick={() => { setSelectedCustomerForEdit(c); setIsEditCustomerModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-xl"><Edit2 size={16}/></button>
                    {activeUser?.role === UserRole.ADMIN && (
                      <button onClick={() => { setCustomerToDelete(c); setIsDeleteCustomerModalOpen(true); }} className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 rounded-xl"><Trash2 size={16}/></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AreasView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center bg-white/50 backdrop-blur-md">
        <h3 className="text-lg font-black text-gray-900">{t.areas}</h3>
        <button onClick={() => setIsAddAreaModalOpen(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
          <MapPinned size={20}/>
          <span>{t.addArea}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {areas.map(a => (
          <div key={a.id} className="p-5 border-2 border-gray-50 rounded-2xl hover:border-blue-500/20 hover:bg-blue-50/10 transition-all group flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                <MapPin size={24}/>
              </div>
              <div>
                <div className="font-black text-gray-900 text-lg leading-none mb-1">{a.name}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{customers.filter(c => c.assignedArea === a.name).length} Customers</div>
              </div>
            </div>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setSelectedAreaForEdit(a); setIsEditAreaModalOpen(true); }} className="p-2 text-blue-600 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-blue-600 hover:text-white transition-all"><Edit2 size={16}/></button>
              <button onClick={() => { setAreaToDelete(a); setIsDeleteAreaModalOpen(true); }} className="p-2 text-red-600 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PlansView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-xl font-black text-gray-900">{t.plans}</h2><button onClick={() => setIsAddPlanModalOpen(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"><Plus size={20} /><span>{t.addPlan}</span></button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(p => (
          <div key={p.id} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-gray-50 hover:border-blue-500 transition-all relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <h4 className="text-lg font-black text-gray-900 mb-2">{p.name}</h4>
              <div className="text-4xl font-black mb-6 text-gray-900">{settings.currency}{p.price - p.discount}</div>
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg w-fit"><Calendar size={14}/><span>{p.durationDays} {t.days}</span></div>
                {p.discount > 0 && <div className="flex items-center space-x-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-fit"><Tag size={14}/><span>Saved {settings.currency}{p.discount}</span></div>}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => { setSelectedPlanForEdit(p); setIsEditPlanModalOpen(true); }} className="flex-1 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-gray-900/10 hover:bg-black transition-all">{t.edit}</button>
                <button onClick={() => { setPlanToDelete(p); setIsDeletePlanModalOpen(true); }} className="p-3 text-red-600 bg-red-50 rounded-2xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const StaffView = (role: UserRole) => {
    const isResellerTab = role === UserRole.RESELLER;
    const list = employees.filter(e => isResellerTab ? e.role === UserRole.RESELLER : (e.role === UserRole.EMPLOYEE || e.role === UserRole.ADMIN));
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-white/50 backdrop-blur-md">
          <h3 className="text-lg font-black text-gray-900">{isResellerTab ? t.resellers : t.employees}</h3>
          <button 
            onClick={() => setIsAddEmployeeModalOpen(true)} 
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
          >
            <UserPlus size={18}/>
            <span>{isResellerTab ? t.addReseller : t.addStaff}</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-xs font-bold uppercase tracking-widest text-gray-400 border-b">
              <tr>
                <th className="px-6 py-5">{t.staffTable.name}</th>
                <th className="px-6 py-5">{t.staffTable.contact}</th>
                <th className="px-6 py-5 text-center">Collection Today</th>
                <th className="px-6 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {list.map(e => (
                <tr key={e.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{e.fullName}</div>
                    <div className="text-xs text-gray-400 font-mono">@{e.username}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-700">{e.phone}</span>
                      <span className={`text-[10px] w-fit font-black px-2 py-0.5 rounded-full mt-1.5 uppercase tracking-widest shadow-sm ${e.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : e.role === UserRole.RESELLER ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {e.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-black text-gray-900">
                      {transactions.filter(t => t.collectedBy === e.fullName && t.date === today).length} 
                    </span>
                    <span className="text-xs text-gray-400 ml-1">Bills</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => { setSelectedEmployeeForEdit(e); setIsEditEmployeeModalOpen(true); }} className="p-2 text-blue-600 bg-gray-50 rounded-xl hover:bg-blue-100"><Edit2 size={16}/></button>
                      <button onClick={() => { setEmployeeToDelete(e); setIsDeleteEmployeeModalOpen(true); }} className="p-2 text-red-600 bg-gray-50 rounded-xl hover:bg-red-100"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const BillingView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b bg-white/50 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-black text-gray-900">{t.transactions}</h3>
        <div className="relative w-full md:w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder={t.searchTransaction} 
            value={billingSearch}
            onChange={(e) => setBillingSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-xs font-bold uppercase tracking-widest text-gray-400 border-b">
            <tr>
              <th className="px-6 py-5">{t.billingTable.date}</th>
              <th className="px-6 py-5">{t.billingTable.customer}</th>
              <th className="px-6 py-5">{t.billingTable.collectedBy}</th>
              <th className="px-6 py-5">{t.billingTable.amount}</th>
              <th className="px-6 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredTransactions.map(tr => (
              <tr key={tr.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">{tr.date}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{tr.customerName}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-xs font-medium text-gray-600">
                    <UserCircle size={14} className="text-gray-400"/>
                    <span>{tr.collectedBy}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-green-600 font-black text-lg">{settings.currency}{tr.amount}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handlePrintInvoice(tr)} className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                    <Printer size={20}/>
                  </button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center space-x-4 mb-8">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-inner"><Globe size={24}/></div>
           <h3 className="text-xl font-black text-gray-900">{t.settingsView.companyInfo}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.settingsView.compName}</label>
             <input 
               type="text" 
               value={settings.companyName}
               onChange={(e) => setSettings({...settings, companyName: e.target.value})}
               className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold" 
             />
           </div>
           <div className="space-y-2">
             <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.settingsView.supportContact}</label>
             <input 
               type="text" 
               value={settings.supportPhone}
               onChange={(e) => setSettings({...settings, supportPhone: e.target.value})}
               className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold" 
             />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center space-x-4 mb-8">
           <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shadow-inner"><Settings size={24}/></div>
           <h3 className="text-xl font-black text-gray-900">{t.settingsView.systemConfig}</h3>
        </div>
        <div className="space-y-6">
           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
             <div className="flex items-center space-x-4">
               <div className="p-2 bg-white rounded-xl shadow-sm text-blue-500"><Coins size={20}/></div>
               <div>
                 <p className="text-sm font-black text-gray-900">{t.settingsView.currency}</p>
                 <p className="text-[10px] text-gray-400 font-bold">Current: {settings.currency}</p>
               </div>
             </div>
             <input 
               type="text" 
               value={settings.currency}
               onChange={(e) => setSettings({...settings, currency: e.target.value})}
               className="w-16 p-2 text-center bg-white border border-gray-200 rounded-xl font-black text-blue-600" 
             />
           </div>

           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
             <div className="flex items-center space-x-4">
               <div className="p-2 bg-white rounded-xl shadow-sm text-orange-500"><Printer size={20}/></div>
               <p className="text-sm font-black text-gray-900">{t.settingsView.autoPrint}</p>
             </div>
             <button 
               onClick={() => setSettings({...settings, autoPrint: !settings.autoPrint})}
               className={`w-12 h-6 rounded-full transition-all relative ${settings.autoPrint ? 'bg-blue-600' : 'bg-gray-300'}`}
             >
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.autoPrint ? 'right-1' : 'left-1'}`}></div>
             </button>
           </div>

           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
             <div className="flex items-center space-x-4">
               <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-500"><Sparkles size={20}/></div>
               <p className="text-sm font-black text-gray-900">{t.settingsView.enableAi}</p>
             </div>
             <button 
               onClick={() => setSettings({...settings, enableAi: !settings.enableAi})}
               className={`w-12 h-6 rounded-full transition-all relative ${settings.enableAi ? 'bg-blue-600' : 'bg-gray-300'}`}
             >
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.enableAi ? 'right-1' : 'left-1'}`}></div>
             </button>
           </div>
        </div>
      </div>

      <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg shadow-2xl shadow-gray-900/20 hover:scale-[1.01] active:scale-95 transition-all">
        {t.settingsView.saveChanges}
      </button>
    </div>
  );

  // --- Main Render ---

  if (!activeUser) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      
      <div className="max-w-md w-full z-10">
        <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
          <div className="text-center mb-10">
            <div className="inline-flex p-5 bg-blue-600 text-white rounded-3xl mb-6 shadow-2xl shadow-blue-500/30">
              <ShieldCheck size={48}/>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">{settings.companyName}</h2>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{t.loginToAccount}</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"><UserCircle size={22}/></div>
                <input 
                  type="text" 
                  value={loginForm.username}
                  onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-black" 
                  placeholder="Enter username" 
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.password}</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"><Lock size={22}/></div>
                <input 
                  type={showLoginPass ? "text" : "password"} 
                  value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full pl-14 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-black" 
                  placeholder="••••••••" 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowLoginPass(!showLoginPass)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-600 transition-colors"
                >
                  {showLoginPass ? <EyeOff size={22}/> : <Eye size={22}/>}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black flex items-center space-x-2 animate-shake">
                <AlertCircle size={18}/>
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg shadow-2xl shadow-gray-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3"
            >
              <KeyRound size={22}/>
              <span>{t.login}</span>
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-50 flex justify-center">
             <button onClick={toggleLanguage} className="flex items-center space-x-2 text-[10px] font-black text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-2xl transition-all uppercase tracking-[0.2em] border border-transparent hover:border-blue-100">
               <Languages size={18} />
               <span>{currentLang === 'en' ? 'বাংলা সংস্করণ' : 'English Version'}</span>
             </button>
          </div>
        </div>
        <p className="text-center mt-8 text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] opacity-30">© 2025 {settings.companyName.toUpperCase()} GLOBAL</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* --- Sidebar Reorganized --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-950 text-white transition-transform lg:translate-x-0 overflow-y-auto border-r border-white/5 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full shadow-2xl'}`}>
        <div className="p-8 flex items-center space-x-4 mb-2">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/40 animate-pulse-slow">
            <Zap size={28}/>
          </div>
          <span className="text-3xl font-black tracking-tighter italic">ISP<span className="text-blue-600">PRO</span></span>
        </div>

        <nav className="px-4 pb-32 space-y-1">
          {/* Main Section */}
          <SidebarHeader label={t.sections.main} />
          {activeUser.role !== UserRole.RESELLER && (
            <SidebarItem icon={<LayoutDashboard size={20} />} label={t.dashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          )}
          
          {/* Operations Section */}
          <SidebarHeader label={t.sections.operations} />
          <SidebarItem icon={<Users size={20} />} label={t.customers} active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
          {activeUser.role === UserRole.ADMIN && (
            <SidebarItem icon={<MapPin size={20} />} label={t.areas} active={activeTab === 'areas'} onClick={() => setActiveTab('areas')} />
          )}

          {/* Finance Section */}
          <SidebarHeader label={t.sections.finance} />
          <SidebarItem icon={<HandCoins size={20} />} label={t.transactions} active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
          {activeUser.role === UserRole.ADMIN && (
            <SidebarItem icon={<Package size={20} />} label={t.plans} active={activeTab === 'plans'} onClick={() => setActiveTab('plans')} />
          )}

          {/* Admin Section */}
          {activeUser.role === UserRole.ADMIN && (
            <>
              <SidebarHeader label={t.sections.administration} />
              <SidebarItem icon={<Store size={20} />} label={t.resellers} active={activeTab === 'resellers'} onClick={() => setActiveTab('resellers')} />
              <SidebarItem icon={<Briefcase size={20} />} label={t.employees} active={activeTab === 'employees'} onClick={() => setActiveTab('employees')} />
              <SidebarItem icon={<Settings size={20} />} label={t.settings} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            </>
          )}
        </nav>

        {/* --- Sidebar Footer (Fixed Bottom) --- */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-gray-950/80 backdrop-blur-xl border-t border-white/5 space-y-4">
          <div className="px-5 py-4 bg-white/5 rounded-3xl border border-white/10 shadow-inner group transition-all hover:bg-white/[0.07]">
            <div className="flex items-center justify-between mb-2">
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Session</p>
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <p className="text-sm font-black truncate text-gray-100">{activeUser.fullName}</p>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.15em]">{activeUser.role}</p>
          </div>
          <button onClick={() => setIsLogoutModalOpen(true)} className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center space-x-2 font-black text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20">
            <LogOut size={20}/>
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all ${isSidebarOpen ? 'lg:ml-72' : ''}`}>
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b px-8 py-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors shadow-inner"><Menu size={20} /></button>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t[activeTab]}</h1>
          </div>
          <div className="flex items-center space-x-5">
            <button onClick={toggleLanguage} className="hidden sm:flex items-center space-x-2 px-4 py-2.5 border-2 border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-700 bg-white hover:border-blue-100 transition-all">
              <Languages size={18} className="text-blue-600" />
              <span>{currentLang === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg border-4 border-white shadow-xl">{activeUser.fullName.charAt(0)}</div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'customers' && <CustomersView />}
          {activeTab === 'plans' && <PlansView />}
          {activeTab === 'billing' && <BillingView />}
          {activeTab === 'areas' && <AreasView />}
          {activeTab === 'employees' && StaffView(UserRole.EMPLOYEE)}
          {activeTab === 'resellers' && StaffView(UserRole.RESELLER)}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>

      <AddCustomerModal isOpen={isAddCustomerModalOpen} onClose={() => setIsAddCustomerModalOpen(false)} onSave={handleSaveCustomer} plans={plans} areas={areas} t={t} />
      <EditCustomerModal isOpen={isEditCustomerModalOpen} onClose={() => setIsEditCustomerModalOpen(false)} onSave={handleUpdateCustomer} customer={selectedCustomerForEdit} plans={plans} areas={areas} t={t} />
      <AddAreaModal isOpen={isAddAreaModalOpen} onClose={() => setIsAddAreaModalOpen(false)} onSave={handleSaveArea} t={t} />
      <EditAreaModal isOpen={isEditAreaModalOpen} onClose={() => setIsEditAreaModalOpen(false)} onSave={handleUpdateArea} area={selectedAreaForEdit} t={t} />
      <AddPlanModal isOpen={isAddPlanModalOpen} onClose={() => setIsAddPlanModalOpen(false)} onSave={handleSavePlan} t={t} />
      <EditPlanModal isOpen={isEditPlanModalOpen} onClose={() => setIsEditPlanModalOpen(false)} onSave={handleUpdatePlan} plan={selectedPlanForEdit} t={t} />
      <AddEmployeeModal isOpen={isAddEmployeeModalOpen} onClose={() => setIsAddEmployeeModalOpen(false)} onSave={handleSaveEmployee} t={t} />
      <EditEmployeeModal isOpen={isEditEmployeeModalOpen} onClose={() => setIsEditEmployeeModalOpen(false)} onSave={handleUpdateEmployee} user={selectedEmployeeForEdit} t={t} />
      <AdjustExpiryModal isOpen={isAdjustExpiryModalOpen} onClose={() => setIsAdjustExpiryModalOpen(false)} onConfirm={handleAdjustExpiryConfirm} customer={customerForDateAdjustment} t={t} />
      <CollectBillModal isOpen={isCollectBillModalOpen} onClose={() => setIsCollectBillModalOpen(false)} onConfirm={handleCollectionConfirm} customer={selectedCustomerForCollection} plan={selectedCustomerForCollection ? plans.find(p => p.id === selectedCustomerForCollection.planId) : undefined} t={t} />
      <BulkCollectionModal isOpen={isBulkCollectionModalOpen} onClose={() => setIsBulkCollectionModalOpen(false)} onConfirm={handleBulkCollection} onIndividualCollect={handleIndividualBulkCollect} overdueCustomers={overdueCustomersList} plans={plans} t={t} />
      <EnableAllModal isOpen={isEnableAllModalOpen} onClose={() => setIsEnableAllModalOpen(false)} onConfirm={handleEnableAllConfirm} count={nonActiveCustomersCount} t={t} />
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleLogout} t={t} />

      <DeleteModal isOpen={isDeleteCustomerModalOpen} onClose={() => setIsDeleteCustomerModalOpen(false)} onConfirm={() => {setCustomers(customers.filter(c => c.id !== customerToDelete?.id)); setIsDeleteCustomerModalOpen(false);}} title="Delete Customer" name={customerToDelete?.name || ''} t={t} />
      <DeleteModal isOpen={isDeleteEmployeeModalOpen} onClose={() => setIsDeleteEmployeeModalOpen(false)} onConfirm={() => {setEmployees(employees.filter(e => e.id !== employeeToDelete?.id)); setIsDeleteEmployeeModalOpen(false);}} title="Remove Staff" name={employeeToDelete?.fullName || ''} t={t} />
      <DeleteModal isOpen={isDeletePlanModalOpen} onClose={() => setIsDeletePlanModalOpen(false)} onConfirm={() => {setPlans(plans.filter(p => p.id !== planToDelete?.id)); setIsDeletePlanModalOpen(false);}} title="Delete Plan" name={planToDelete?.name || ''} t={t} />
      <DeleteModal isOpen={isDeleteAreaModalOpen} onClose={() => setIsDeleteAreaModalOpen(false)} onConfirm={() => {setAreas(areas.filter(a => a.id !== areaToDelete?.id)); setIsDeleteAreaModalOpen(false);}} title="Delete Area" name={areaToDelete?.name || ''} t={t} />
    </div>
  );
}
