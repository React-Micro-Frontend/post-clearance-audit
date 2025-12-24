declare module "customMain/components/shared" {
  export const PageHeader: React.FC<{ title: string; description?: string }>;
  export const StatCard: React.FC<{ title: string; value: string | number; icon: string; color?: "emerald" | "blue" | "purple" | "orange" | "red" | "yellow" }>;
  export const Card: React.FC<{ children: React.ReactNode; className?: string }>;
  export const InfoCard: React.FC<{ title: string; value: string | number; color?: "emerald" | "blue" | "orange" | "red" | "yellow" | "purple" }>;
  export const SearchInput: React.FC<{ placeholder?: string; value?: string; onChange?: (value: string) => void }>;
  export const Button: React.FC<{ children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "danger" | "success"; size?: "sm" | "md" | "lg"; className?: string; type?: "button" | "submit" | "reset" }>;
  export const Avatar: React.FC<{ initials: string; size?: "sm" | "md" | "lg"; color?: string }>;
  export const LoadingSpinner: React.FC<{ message?: string; size?: "sm" | "md" | "lg" }>;
  export const QuickLinkCard: React.FC<{ title: string; description: string; onClick?: () => void }>;
}

declare module "customMain/PageHeader" {
  const PageHeader: React.FC<{ title: string; description?: string }>;
  export default PageHeader;
}

declare module "customMain/StatCard" {
  const StatCard: React.FC<{ title: string; value: string | number; icon: string; color?: "emerald" | "blue" | "purple" | "orange" | "red" | "yellow" }>;
  export default StatCard;
}

declare module "customMain/Card" {
  const Card: React.FC<{ children: React.ReactNode; className?: string }>;
  export default Card;
}

declare module "customMain/Button" {
  const Button: React.FC<{ children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "danger" | "success"; size?: "sm" | "md" | "lg"; className?: string; type?: "button" | "submit" | "reset" }>;
  export default Button;
}

// Redux Store modules
declare module "customMain/store" {
  import { Store } from '@reduxjs/toolkit';
  
  export interface RootState {
    users: {
      users: Array<{ id: string; name: string; email: string; role: string }>;
      selectedUser: { id: string; name: string; email: string; role: string } | null;
      totalCount: number;
      loading: boolean;
    };
    counter: {
      value: number;
      incrementAmount: number;
    };
  }
  
  export type AppDispatch = any;
  export const store: Store<RootState>;
}

declare module "customMain/store/hooks" {
  import { TypedUseSelectorHook } from 'react-redux';
  import { RootState, AppDispatch } from 'customMain/store';
  
  export const useAppDispatch: () => AppDispatch;
  export const useAppSelector: TypedUseSelectorHook<RootState>;
}

declare module "customMain/store/slices/userSlice" {
  import { PayloadAction } from '@reduxjs/toolkit';
  
  export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }
  
  export const setUsers: (users: User[]) => PayloadAction<User[]>;
  export const addUser: (user: User) => PayloadAction<User>;
  export const updateUser: (user: User) => PayloadAction<User>;
  export const deleteUser: (id: string) => PayloadAction<string>;
  export const selectUser: (user: User | null) => PayloadAction<User | null>;
  export const setLoading: (loading: boolean) => PayloadAction<boolean>;
}

declare module "customMain/store/slices/counterSlice" {
  import { PayloadAction } from '@reduxjs/toolkit';
  
  export const increment: () => PayloadAction<void>;
  export const decrement: () => PayloadAction<void>;
  export const incrementByAmount: (amount: number) => PayloadAction<number>;
  export const reset: () => PayloadAction<void>;
  export const setIncrementAmount: (amount: number) => PayloadAction<number>;
}

declare module "customMain/TailwindStyles" {
  const content: string;
  export default content;
}
