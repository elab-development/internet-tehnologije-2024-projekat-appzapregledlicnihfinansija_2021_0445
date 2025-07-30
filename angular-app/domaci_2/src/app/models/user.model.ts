export interface logInUser {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
  email_verified_at: string | null;
}

export interface Account {
  id: number;
  user_id: string;
  name?: string;
  account_name?: string;
  balance: string;
  user?: User;
}

export interface PaginatedAccounts {
  data: Account[];
  meta: {"current_page": 1,
  "last_page": 1,}
}

export interface Transaction {
  id: number;
  account_id: number;
  category_id: number;
  amount: string;
  type: 'expense' | 'income';
  details: string;
  created_at: string;
  updated_at: string;
  account: Account;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense' | string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  total: number;
}