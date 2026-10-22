import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '../types';
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string) => Promise<void>;
  addAddress: (address: Omit<Address, '_id'>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = getAuthToken();
      if (storedToken) {
        try {
          const res = await api.getProfile();
          setUser(res.user);
        } catch (error) {
          console.error('Session expired or invalid:', error);
          removeAuthToken();
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.login(credentials);
    setAuthToken(res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    const res = await api.register(data);
    setAuthToken(res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (name: string) => {
    const res = await api.updateProfile({ name });
    setUser(res.user);
  };

  const addAddress = async (address: Omit<Address, '_id'>) => {
    const res = await api.addAddress(address);
    setUser(res.user);
  };

  const deleteAddress = async (addressId: string) => {
    const res = await api.deleteAddress(addressId);
    setUser(res.user);
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      throw new Error('Please sign in to save items to your wishlist');
    }
    const res = await api.toggleWishlist(productId);
    setUser({ ...user, wishlist: res.wishlist });
  };

  const isInWishlist = (productId: string): boolean => {
    return user?.wishlist?.includes(productId) ?? false;
  };

  const wishlistCount = user?.wishlist?.length || 0;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
