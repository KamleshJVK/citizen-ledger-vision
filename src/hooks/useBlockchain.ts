
import { useState, useEffect } from 'react';
import { createTransaction, verifyTransaction, generateTransactionId } from '@/lib/blockchain';
import { Transaction, DemandStatus, TransactionAction } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useBlockchain() {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load transactions for a specific demand
  const loadTransactions = async (demandId: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from the database
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('demandId', demandId)
        .order('timestamp', { ascending: true });
        
      if (error) throw error;
      
      setTransactions(data as Transaction[] || []);
      return data as Transaction[];
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Failed to load transaction history");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Create a blockchain transaction and save it
  const createBlockchainTransaction = async (
    demandId: string,
    userId: string,
    userName: string,
    action: TransactionAction,
    previousStatus: DemandStatus | null,
    newStatus: DemandStatus,
    previousHash: string = '0'
  ): Promise<Transaction> => {
    // Create a blockchain transaction
    const transaction = createTransaction(
      demandId,
      userId,
      userName,
      action,
      previousStatus,
      newStatus,
      previousHash
    );
    
    try {
      // In a real app, save the transaction to the database
      const { error } = await supabase
        .from('transactions')
        .insert(transaction);
        
      if (error) throw error;
      
      // Update local state
      setTransactions(prev => [...prev, transaction]);
      
      return transaction;
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error("Failed to record blockchain transaction");
      return transaction; // Return the transaction anyway for the UI
    }
  };

  // Verify a blockchain transaction
  const verifyBlockchainTransaction = async (transaction: Transaction, previousHash: string = '0'): Promise<boolean> => {
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      // Simulate API delay for verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify the transaction
      const result = verifyTransaction(
        transaction.id,
        transaction.demandId,
        transaction.userId,
        transaction.action,
        transaction.timestamp,
        previousHash,
        transaction.dataHash
      );
      
      setVerificationResult(result);
      
      if (result) {
        toast.success("Transaction verified successfully");
      } else {
        toast.error("Transaction verification failed - data integrity compromised");
      }
      
      return result;
    } catch (error) {
      console.error("Error verifying transaction:", error);
      toast.error("Failed to verify transaction");
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  // Set up listener for new transactions
  useEffect(() => {
    const channel = supabase
      .channel('transactions-channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'transactions' 
      }, (payload) => {
        const newTransaction = payload.new as Transaction;
        setTransactions(prev => {
          // Check if we already have this transaction to avoid duplicates
          const exists = prev.some(t => t.id === newTransaction.id);
          if (!exists) {
            return [...prev, newTransaction];
          }
          return prev;
        });
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return {
    createBlockchainTransaction,
    verifyBlockchainTransaction,
    loadTransactions,
    transactions,
    isVerifying,
    isLoading,
    verificationResult,
    setVerificationResult,
    generateTransactionId
  };
}
