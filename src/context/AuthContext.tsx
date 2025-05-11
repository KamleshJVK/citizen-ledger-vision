
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { generateKeyPair } from '@/lib/blockchain';
import { toast } from "sonner";
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

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

// Mock users for demo when Supabase authentication fails
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

// Helper function to convert Supabase user to our app's User format
const mapSupabaseUserToAppUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
  try {
    // Fetch user profile data from the users table
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error || !userData) {
      console.error("Error fetching user data:", error);
      return null;
    }

    return {
      id: supabaseUser.id,
      name: userData.name,
      email: supabaseUser.email || '',
      role: userData.role as UserRole,
      publicKey: userData.public_key,
      privateKey: userData.private_key || undefined,
      aadharNumber: userData.aadhar_number || undefined,
      createdAt: userData.created_at
    };
  } catch (error) {
    console.error("Error in mapSupabaseUserToAppUser:", error);
    return null;
  }
};

// Use mock authentication as fallback for demo accounts
const useMockAuth = async (email: string, password: string): Promise<User | null> => {
  const foundUser = mockUsers.find(u => u.email === email && u.password === password);
  if (foundUser) {
    const { password: _, ...safeUser } = foundUser;
    return safeUser;
  }
  return null;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Set up authentication state listener
  useEffect(() => {
    // Set up auth state listener FIRST to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetching to prevent auth deadlock
          setTimeout(async () => {
            const appUser = await mapSupabaseUserToAppUser(session.user);
            if (appUser) {
              setUser(appUser);
              localStorage.setItem('user', JSON.stringify(appUser));
            }
          }, 0);
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const appUser = await mapSupabaseUserToAppUser(session.user);
        if (appUser) {
          setUser(appUser);
          localStorage.setItem('user', JSON.stringify(appUser));
        }
      }
      
      setIsLoading(false);
    });
    
    // Try to get user from localStorage if Supabase session is not available
    if (!session) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Try Supabase authentication first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log("Supabase auth error, trying mock auth:", error.message);
        
        // Fall back to mock authentication for demo accounts
        const mockUser = await useMockAuth(email, password);
        if (mockUser) {
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          toast.success(`Welcome back, ${mockUser.name}`);
          return true;
        }
        
        toast.error("Invalid email or password");
        return false;
      }

      if (data.user) {
        const appUser = await mapSupabaseUserToAppUser(data.user);
        if (appUser) {
          localStorage.setItem('user', JSON.stringify(appUser));
          setUser(appUser);
          toast.success(`Welcome back, ${appUser.name}`);
          return true;
        }
      }
      
      return !!data.user;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out from Supabase:", error);
    }
    
    // Always clear local storage and state
    localStorage.removeItem('user');
    setUser(null);
    setSession(null);
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
      // Check if email is already in use in mockUsers (for demo accounts)
      if (mockUsers.some(u => u.email === email)) {
        toast.error("Email already registered in demo accounts");
        return false;
      }
      
      // Try to sign up with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error("Supabase signup error:", authError);
        toast.error(authError.message || "Registration failed");
        return false;
      }

      if (!authData.user) {
        toast.error("Failed to create account");
        return false;
      }
      
      // Generate blockchain keys
      const { publicKey, privateKey } = generateKeyPair(role);
      
      // Create user profile in users table
      const { error: userError } = await supabase.from('users').insert({
        id: authData.user.id,
        name,
        email,
        role,
        aadhar_number: aadharNumber || null,
        public_key: publicKey,
        private_key: role === 'Common Citizen' ? null : privateKey,
        created_at: new Date().toISOString()
      });

      if (userError) {
        console.error("Error creating user profile:", userError);
        
        // Clean up auth if profile creation fails
        try {
          // We can't actually delete the user since we're not admin,
          // but we can sign out to prevent a dangling auth account
          await supabase.auth.signOut();
        } catch (error) {
          console.error("Error cleaning up auth after failed profile creation:", error);
        }
        
        toast.error("Failed to create user profile");
        return false;
      }

      // Create app user object
      const newUser: User = {
        id: authData.user.id,
        name,
        email,
        role,
        publicKey,
        createdAt: new Date().toISOString()
      };

      if (role === 'MLA' || role === 'Higher Public Officer' || role === 'Admin') {
        newUser.privateKey = privateKey;
      }

      if (aadharNumber) {
        newUser.aadharNumber = aadharNumber;
      }

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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        console.error("Password reset error:", error);
        
        // For demo emails, simulate success
        if (mockUsers.some(u => u.email === email)) {
          toast.success("Password reset instructions sent to your email");
          return true;
        }
        
        toast.error(error.message || "Failed to send reset email");
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
