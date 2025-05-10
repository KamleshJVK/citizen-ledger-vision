
import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  createTransaction as createBlockchainTransaction,
  Transaction
} from "@/lib/blockchain";
import { DemandStatus, TransactionAction } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export const useBlockchain = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const getTransactions = async (demandId: string): Promise<Transaction[]> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('demand_id', demandId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      // Convert from database format to app format
      return (data || []).map((tx: any) => ({
        id: tx.id,
        demandId: tx.demand_id,
        userId: tx.user_id,
        userName: tx.user_name,
        action: tx.action as TransactionAction,
        timestamp: tx.timestamp,
        previousStatus: tx.previous_status as DemandStatus | null,
        newStatus: tx.new_status as DemandStatus,
        dataHash: tx.data_hash
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transaction history");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = useCallback(async (
    demandId: string,
    action: TransactionAction,
    previousStatus: DemandStatus | null,
    newStatus: DemandStatus,
    previousHash: string = '0'
  ): Promise<Transaction> => {
    if (!user) {
      throw new Error("User must be logged in to create transactions");
    }

    try {
      setIsLoading(true);
      
      // Create the transaction object
      const transaction = createBlockchainTransaction(
        demandId,
        user.id,
        user.name,
        action,
        previousStatus,
        newStatus,
        previousHash
      );

      // Create transaction record for database
      const transactionData = {
        id: transaction.id || `t_${uuidv4()}`,
        demand_id: transaction.demandId,
        user_id: transaction.userId,
        user_name: transaction.userName,
        action: transaction.action,
        timestamp: transaction.timestamp,
        previous_status: transaction.previousStatus,
        new_status: transaction.newStatus,
        data_hash: transaction.dataHash
      };

      // Save to database
      const { error } = await supabase
        .from('transactions')
        .insert(transactionData);

      if (error) throw error;

      return transaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to record transaction on blockchain");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const verifyTransaction = async (transaction: Transaction): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Find the previous transaction to get its hash
      const { data: prevTxs } = await supabase
        .from('transactions')
        .select('*')
        .eq('demand_id', transaction.demandId)
        .lt('timestamp', transaction.timestamp)
        .order('timestamp', { ascending: false })
        .limit(1);
      
      const previousHash = prevTxs && prevTxs.length > 0 ? prevTxs[0].data_hash : '0';
      
      // Use the blockchain utility to verify the transaction
      return import('@/lib/blockchain').then(({ verifyTransaction }) => {
        return verifyTransaction(
          transaction.id,
          transaction.demandId,
          transaction.userId,
          transaction.action,
          transaction.timestamp,
          previousHash,
          transaction.dataHash
        );
      });
    } catch (error) {
      console.error("Error verifying transaction:", error);
      toast.error("Failed to verify transaction");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Set up a subscription to listen for transactions updates
  const subscribeToTransactions = (demandId: string, callback: (transactions: Transaction[]) => void) => {
    const subscription = supabase
      .channel(`transactions-${demandId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions',
        filter: `demand_id=eq.${demandId}`
      }, async (payload) => {
        // When a transaction changes, fetch all transactions again
        const updatedTransactions = await getTransactions(demandId);
        callback(updatedTransactions);
      })
      .subscribe();

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
    };
  };

  return {
    isLoading,
    getTransactions,
    createTransaction,
    verifyTransaction,
    subscribeToTransactions
  };
};
