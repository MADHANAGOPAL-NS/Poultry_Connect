
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  [key: string]: any;
}

export interface Session {
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (token: string, userData: User) => void;
  signOut: () => Promise<void>;
  loading: boolean;
  subscribed: boolean;
  subscriptionEnd: string | null;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Points to the Express backend running locally (or in production)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const { toast } = useToast();

  const checkSubscription = async () => {
    // Basic mock since subscription involves payment gateway changes from Supabase
    setSubscribed(false);
    setSubscriptionEnd(null);
  };

  const signIn = (token: string, userData: User) => {
    setSession({ access_token: token });
    setUser(userData);
    localStorage.setItem('auth_token', token);
  };

  useEffect(() => {
    // Check initial session
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      fetch(`${API_URL}/auth/session`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then(data => {
        setSession({ access_token: token });
        setUser({ id: data.user._id, email: data.user.email });
      })
      .catch((err) => {
        console.error('Session error', err);
        localStorage.removeItem('auth_token');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const signOut = async () => {
    setLoading(true);
    localStorage.removeItem('auth_token');
    setSession(null);
    setUser(null);
    setLoading(false);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const value = {
    user,
    session,
    signIn,
    signOut,
    loading,
    subscribed,
    subscriptionEnd,
    checkSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
