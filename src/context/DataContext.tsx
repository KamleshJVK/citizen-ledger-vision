
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Demand, Transaction, Policy } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DataContextType {
  users: User[];
  demands: Demand[];
  transactions: Transaction[];
  policies: Policy[];
  isLoading: boolean;
  refreshUsers: () => Promise<void>;
  refreshDemands: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshPolicies: () => Promise<void>;
}

// Mock data
import { mockUsers } from '@/data/mockUsers';
import { mockDemands } from '@/data/mockDemands';
import { mockPolicies } from '@/data/mockPolicies';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial data fetch
  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        refreshUsers(), 
        refreshDemands(), 
        refreshTransactions(),
        refreshPolicies()
      ]);
      setIsLoading(false);
    };
    
    fetchAllData();
    
    // Set up realtime listeners for all tables
    const usersChannel = supabase
      .channel('users-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'users' 
      }, handleUserChange)
      .subscribe();
      
    const demandsChannel = supabase
      .channel('demands-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'demands' 
      }, handleDemandChange)
      .subscribe();
      
    const transactionsChannel = supabase
      .channel('transactions-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'transactions' 
      }, handleTransactionChange)
      .subscribe();
      
    const policiesChannel = supabase
      .channel('policies-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'policies' 
      }, handlePolicyChange)
      .subscribe();
    
    // Cleanup
    return () => {
      usersChannel.unsubscribe();
      demandsChannel.unsubscribe();
      transactionsChannel.unsubscribe();
      policiesChannel.unsubscribe();
    };
  }, []);

  // Handle realtime changes
  const handleUserChange = (payload: any) => {
    const { eventType, new: newUser, old: oldUser } = payload;
    
    if (eventType === 'INSERT') {
      setUsers(prev => [...prev, newUser as User]);
      toast.success('New user registered');
    } else if (eventType === 'UPDATE') {
      setUsers(prev => prev.map(u => u.id === newUser.id ? newUser as User : u));
      toast.info('User information updated');
    } else if (eventType === 'DELETE') {
      setUsers(prev => prev.filter(u => u.id !== oldUser.id));
      toast.info('User removed from system');
    }
  };
  
  const handleDemandChange = (payload: any) => {
    const { eventType, new: newDemand, old: oldDemand } = payload;
    
    if (eventType === 'INSERT') {
      setDemands(prev => [...prev, newDemand as Demand]);
      toast.success('New demand submitted');
    } else if (eventType === 'UPDATE') {
      setDemands(prev => prev.map(d => d.id === newDemand.id ? newDemand as Demand : d));
      toast.info(`Demand status updated to ${newDemand.status}`);
    } else if (eventType === 'DELETE') {
      setDemands(prev => prev.filter(d => d.id !== oldDemand.id));
      toast.info('Demand removed from system');
    }
  };
  
  const handleTransactionChange = (payload: any) => {
    const { eventType, new: newTransaction } = payload;
    
    if (eventType === 'INSERT') {
      setTransactions(prev => [...prev, newTransaction as Transaction]);
      toast.success('New blockchain transaction recorded');
    }
  };
  
  const handlePolicyChange = (payload: any) => {
    const { eventType, new: newPolicy, old: oldPolicy } = payload;
    
    if (eventType === 'INSERT') {
      setPolicies(prev => [...prev, newPolicy as Policy]);
      toast.success('New policy created');
    } else if (eventType === 'UPDATE') {
      setPolicies(prev => prev.map(p => p.id === newPolicy.id ? newPolicy as Policy : p));
      toast.info('Policy information updated');
    } else if (eventType === 'DELETE') {
      setPolicies(prev => prev.filter(p => p.id !== oldPolicy.id));
      toast.info('Policy removed from system');
    }
  };

  // Refresh functions
  const refreshUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        // Use mock data for demo purposes
        setUsers(mockUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fall back to mock data
      setUsers(mockUsers);
    }
  };
  
  const refreshDemands = async () => {
    try {
      const { data, error } = await supabase
        .from('demands')
        .select('*');
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setDemands(data);
      } else {
        // Use mock data for demo purposes
        setDemands(mockDemands);
      }
    } catch (error) {
      console.error('Error fetching demands:', error);
      // Fall back to mock data
      setDemands(mockDemands);
    }
  };
  
  const refreshTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*');
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setTransactions(data);
      } else {
        // Start with empty transactions
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Start with empty transactions
      setTransactions([]);
    }
  };
  
  const refreshPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('*');
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setPolicies(data);
      } else {
        // Use mock data for demo purposes
        setPolicies(mockPolicies);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
      // Fall back to mock data
      setPolicies(mockPolicies);
    }
  };

  return (
    <DataContext.Provider value={{ 
      users, 
      demands, 
      transactions,
      policies,
      isLoading,
      refreshUsers,
      refreshDemands,
      refreshTransactions,
      refreshPolicies
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
