import React, { createContext, useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthState, User } from '../types';
import { useAuthState } from '../hooks/useAuthState';
import { authService } from '../lib/auth';

interface AuthContextType {
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType>({
  authState: { user: null, session: null, loading: true },
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  continueAsGuest: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState, setAuthState } = useAuthState();

  const continueAsGuest = () => {
    const guestUser: User = { id: 'guest', email: 'guest' };
    setAuthState(prev => ({
      ...prev,
      user: guestUser,
      session: null,
      loading: false
    }));
    toast.success('Continuing as guest');
  };

  return (
    <AuthContext.Provider value={{
      authState,
      signIn: authService.signIn,
      signUp: authService.signUp,
      signOut: authService.signOut,
      continueAsGuest,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);