
import { useState } from 'react';
import { createTransaction, verifyTransaction, generateTransactionId } from '@/lib/blockchain';
import { Transaction, DemandStatus, TransactionAction } from '@/types';
import { toast } from 'sonner';

export function useBlockchain() {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const createBlockchainTransaction = (
    demandId: string,
    userId: string,
    userName: string,
    action: TransactionAction,
    previousStatus: DemandStatus | null,
    newStatus: DemandStatus,
    previousHash: string = '0'
  ): Transaction => {
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
    
    return transaction;
  };

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

  return {
    createBlockchainTransaction,
    verifyBlockchainTransaction,
    isVerifying,
    verificationResult,
    setVerificationResult,
    generateTransactionId
  };
}
