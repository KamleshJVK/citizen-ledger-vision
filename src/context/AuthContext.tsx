import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { generateKeyPair } from '@/lib/blockchain';
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole, aadharNumber?: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for demo — now include passwords
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    name: "John Citizen",
    email: "citizen@example.com",
    role: "Common Citizen",
    publicKey: "pk_ctz_8f72bd9e3a4c1d5f",
    createdAt: new Date().toISOString(),
    password: "54321"
  },
  {
    id: "2",
    name: "Mary MLA",
    email: "mla@example.com",
    role: "MLA",
    publicKey: "pk_mla_6d2c8a9f1b7e4d3a",
    privateKey: "sk_mla_5e3f7d8c9b2a1f6e",
    createdAt: new Date().toISOString(),
    password: "54321"
  },
  {
    id: "3",
    name: "Robert Officer",
    email: "officer@example.com",
    role: "Higher Public Officer",
    publicKey: "pk_off_4a7b3c8d9e2f1a5c",
    privateKey: "sk_off_3e2a7c8b9d4f5a6e",
    createdAt: new Date().toISOString(),
    password: "54321"
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    publicKey: "pk_adm_2c1d9e8f3a7b4c6d",
    privateKey: "sk_adm_1a9c8b7d6e5f4a3c",
    createdAt: new Date().toISOString(),
    password: "54321"
  }
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

      const foundUser = mockUsers.find(u => u.email === email && u.password === password);

      if (!foundUser) {
        toast.error("Invalid email or password");
        return false;
      }

      const { password: _, ...safeUser } = foundUser; // Don't store password
      localStorage.setItem('user', JSON.stringify(safeUser));
      setUser(safeUser);
      toast.success(`Welcome back, ${foundUser.name}`);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.info("Successfully logged out");
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    aadharNumber?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (mockUsers.some(u => u.email === email)) {
        toast.error("Email already registered");
        return false;
      }

      const { publicKey, privateKey } = generateKeyPair(role);

      const newUser: User & { password: string } = {
        id: `${mockUsers.length + 1}`,
        name,
        email,
        role,
        publicKey,
        createdAt: new Date().toISOString(),
        password
      };

      if (role === 'MLA' || role === 'Higher Public Officer' || role === 'Admin') {
        newUser.privateKey = privateKey;
      }

      if (aadharNumber) {
        newUser.aadharNumber = aadharNumber;
      }

      mockUsers.push(newUser);
      const { password: _, ...safeUser } = newUser;
      localStorage.setItem('user', JSON.stringify(safeUser));
      setUser(safeUser);

      toast.success("Registration successful!");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const userExists = mockUsers.some(u => u.email === email);
      if (!userExists) {
        toast.error("Email not found");
        return false;
      }
      toast.success("Password reset instructions sent to your email");
      return true;
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send reset email. Please try again.");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
