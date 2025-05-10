
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { supabase } from "@/integrations/supabase/client";
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session
  useEffect(() => {
    setIsLoading(true);
    
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user profile from the database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError || !userData) {
            setUser(null);
            console.error("Error fetching user profile:", userError);
          } else {
            // Convert from database format to app format
            const appUser: User = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              publicKey: userData.public_key,
              createdAt: userData.created_at,
              aadharNumber: userData.aadhar_number
            };
            
            // Only include private key for certain roles
            if (['MLA', 'Higher Public Officer', 'Admin'].includes(userData.role)) {
              appUser.privateKey = userData.private_key;
            }
            
            setUser(appUser);
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError || !userData) {
          setUser(null);
          console.error("Error fetching user profile:", userError);
        } else {
          // Convert from database format to app format
          const appUser: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            publicKey: userData.public_key,
            createdAt: userData.created_at,
            aadharNumber: userData.aadhar_number
          };
          
          // Only include private key for certain roles
          if (['MLA', 'Higher Public Officer', 'Admin'].includes(userData.role)) {
            appUser.privateKey = userData.private_key;
          }
          
          setUser(appUser);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (userError || !userData) {
          toast.error("Could not fetch user details");
          return false;
        }
        
        // Convert from database format to app format
        const appUser: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          publicKey: userData.public_key,
          createdAt: userData.created_at,
          aadharNumber: userData.aadhar_number
        };
        
        // Only include private key for certain roles
        if (['MLA', 'Higher Public Officer', 'Admin'].includes(userData.role)) {
          appUser.privateKey = userData.private_key;
        }
        
        setUser(appUser);
        toast.success(`Welcome back, ${userData.name}`);
        return true;
      }
      
      return false;
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
      setUser(null);
      toast.info("Successfully logged out");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
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
      // Generate blockchain keys
      const { publicKey, privateKey } = await import('@/lib/blockchain').then(
        module => module.generateKeyPair(role)
      );
      
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (!data.user) {
        toast.error("Registration failed");
        return false;
      }
      
      // Create user profile in the database
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          name,
          email,
          role,
          public_key: publicKey,
          private_key: ['MLA', 'Higher Public Officer', 'Admin'].includes(role) ? privateKey : null,
          aadhar_number: aadharNumber,
          created_at: new Date().toISOString()
        });
      
      if (profileError) {
        console.error("Error creating user profile:", profileError);
        toast.error("Failed to create user profile");
        return false;
      }
      
      // Create user in the app state
      const newUser: User = {
        id: data.user.id,
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
        toast.error(error.message);
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
