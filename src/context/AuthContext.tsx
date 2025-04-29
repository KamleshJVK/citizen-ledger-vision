
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

// Mock users for demo
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Citizen",
    email: "citizen@example.com",
    role: "Common Citizen",
    publicKey: "pk_ctz_8f72bd9e3a4c1d5f",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Mary MLA",
    email: "mla@example.com",
    role: "MLA",
    publicKey: "pk_mla_6d2c8a9f1b7e4d3a",
    privateKey: "sk_mla_5e3f7d8c9b2a1f6e",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Robert Officer",
    email: "officer@example.com",
    role: "Higher Public Officer",
    publicKey: "pk_off_4a7b3c8d9e2f1a5c",
    privateKey: "sk_off_3e2a7c8b9d4f5a6e",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    publicKey: "pk_adm_2c1d9e8f3a7b4c6d",
    privateKey: "sk_adm_1a9c8b7d6e5f4a3c",
    createdAt: new Date().toISOString()
  }
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing logged in user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // This is a mock implementation - would connect to backend in real app
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        toast.error("Invalid email or password");
        return false;
      }
      
      // In a real app, we'd verify the password hash here
      
      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        toast.error("Email already registered");
        return false;
      }
      
      // Generate blockchain keys
      const { publicKey, privateKey } = generateKeyPair(role);
      
      // Create new user
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        name,
        email,
        role,
        publicKey,
        createdAt: new Date().toISOString()
      };
      
      // Add private key only for MLAs and Higher Public Officers
      if (role === 'MLA' || role === 'Higher Public Officer' || role === 'Admin') {
        newUser.privateKey = privateKey;
      }
      
      // Add aadhar number if provided
      if (aadharNumber) {
        newUser.aadharNumber = aadharNumber;
      }
      
      // In a real app, we'd hash the password and send to the backend
      
      // For demo purposes, add to mock users
      mockUsers.push(newUser);
      
      // Log the user in
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userExists = mockUsers.some(u => u.email === email);
      
      if (!userExists) {
        toast.error("Email not found");
        return false;
      }
      
      // In a real app, we'd send a password reset email
      
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
