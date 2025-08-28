import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  derivToken?: string;
  isDerivConnected: boolean;
  createdAt: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setDerivToken: (token: string) => void;
  removeDerivToken: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

// Mock user database (in real app, this would be handled by Supabase)
const mockUsers = new Map<string, { 
  id: string; 
  name: string; 
  email: string; 
  password: string; 
  derivToken?: string;
  createdAt: number;
}>();

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = mockUsers.get(email);
          if (!user || user.password !== password) {
            set({ error: 'Invalid email or password', isLoading: false });
            return false;
          }

          const userData: User = {
            id: user.id,
            email: user.email,
            name: user.name,
            derivToken: user.derivToken,
            isDerivConnected: !!user.derivToken,
            createdAt: user.createdAt
          };

          set({ 
            user: userData, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
          return true;
        } catch (error) {
          set({ 
            error: 'Login failed. Please try again.', 
            isLoading: false 
          });
          return false;
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (mockUsers.has(email)) {
            set({ error: 'Email already exists', isLoading: false });
            return false;
          }

          const userId = `user_${Date.now()}`;
          const newUser = {
            id: userId,
            name,
            email,
            password,
            createdAt: Date.now()
          };

          mockUsers.set(email, newUser);

          const userData: User = {
            id: userId,
            email,
            name,
            isDerivConnected: false,
            createdAt: newUser.createdAt
          };

          set({ 
            user: userData, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
          return true;
        } catch (error) {
          set({ 
            error: 'Signup failed. Please try again.', 
            isLoading: false 
          });
          return false;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      setDerivToken: (token: string) => {
        const { user } = get();
        if (user) {
          const updatedUser = { 
            ...user, 
            derivToken: token, 
            isDerivConnected: true 
          };
          
          // Update mock database
          const mockUser = mockUsers.get(user.email);
          if (mockUser) {
            mockUsers.set(user.email, { ...mockUser, derivToken: token });
          }
          
          set({ user: updatedUser });
        }
      },

      removeDerivToken: () => {
        const { user } = get();
        if (user) {
          const updatedUser = { 
            ...user, 
            derivToken: undefined, 
            isDerivConnected: false 
          };
          
          // Update mock database
          const mockUser = mockUsers.get(user.email);
          if (mockUser) {
            const { derivToken, ...userWithoutToken } = mockUser;
            mockUsers.set(user.email, userWithoutToken);
          }
          
          set({ user: updatedUser });
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
