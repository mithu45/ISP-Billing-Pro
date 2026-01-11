
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  RESELLER = 'RESELLER'
}

export enum PlanDuration {
  DAILY = 1,
  MONTHLY = 30,
  YEARLY = 365
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  discount: number;
  dateRoll: boolean; // True: Adds duration to previous expiry, False: Resets from today
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  userId: string;
  planId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'DISCONNECTED';
  lastPaymentDate: string;
  expiryDate: string;
  assignedArea: string;
  joiningDate: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  date: string;
  collectedBy: string;
}

export interface User {
  id: string;
  username: string;
  password?: string; // Optional for security in some contexts, but needed for management
  role: UserRole;
  fullName: string;
  phone: string;
  joiningDate: string;
}
