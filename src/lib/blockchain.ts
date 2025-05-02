
import { UserRole, TransactionAction, DemandStatus } from '@/types';

// Generate a public/private key pair for a user
export function generateKeyPair(role: UserRole) {
  // In a real blockchain app, this would use proper cryptographic methods
  // For this prototype, we'll generate random strings with role prefixes
  
  const randomString = () => {
    return Math.random().toString(36).substring(2, 10) +
           Math.random().toString(36).substring(2, 10);
  };
  
  let publicKey = '';
  let privateKey = '';
  
  switch (role) {
    case 'Common Citizen':
      publicKey = `pk_ctz_${randomString()}`;
      break;
    case 'MLA':
      publicKey = `pk_mla_${randomString()}`;
      privateKey = `sk_mla_${randomString()}`;
      break;
    case 'Higher Public Officer':
      publicKey = `pk_off_${randomString()}`;
      privateKey = `sk_off_${randomString()}`;
      break;
    case 'Admin':
      publicKey = `pk_adm_${randomString()}`;
      privateKey = `sk_adm_${randomString()}`;
      break;
  }
  
  return { publicKey, privateKey };
}

// Generate a transaction ID
export function generateTransactionId() {
  return `tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Create a hash for a transaction
export function createTransactionHash(
  transactionId: string,
  demandId: string,
  userId: string,
  action: TransactionAction,
  timestamp: string,
  previousHash: string = '0'
) {
  // In a real blockchain app, this would be a proper cryptographic hash function
  // For this prototype, we'll create a simple string-based hash
  
  const data = `${transactionId}:${demandId}:${userId}:${action}:${timestamp}:${previousHash}`;
  
  // Simple hash function for demo purposes
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string
  const hashHex = (hash >>> 0).toString(16);
  return `hash_${hashHex}`;
}

// Create a transaction record
export function createTransaction(
  demandId: string,
  userId: string,
  userName: string,
  action: TransactionAction,
  previousStatus: DemandStatus | null,
  newStatus: DemandStatus,
  previousHash: string = '0'
): Transaction {
  const transactionId = generateTransactionId();
  const timestamp = new Date().toISOString();
  
  const dataHash = createTransactionHash(
    transactionId,
    demandId,
    userId,
    action,
    timestamp,
    previousHash
  );
  
  return {
    id: transactionId,
    demandId,
    userId,
    userName,
    action,
    timestamp,
    previousStatus,
    newStatus,
    dataHash
  };
}

// Define Transaction type for clear return type
export interface Transaction {
  id: string;
  demandId: string;
  userId: string;
  userName: string;
  action: TransactionAction;
  timestamp: string;
  previousStatus: DemandStatus | null;
  newStatus: DemandStatus;
  dataHash: string;
}

// Verify a transaction hash
export function verifyTransaction(
  transactionId: string,
  demandId: string,
  userId: string,
  action: TransactionAction,
  timestamp: string,
  previousHash: string,
  storedHash: string
) {
  const calculatedHash = createTransactionHash(
    transactionId,
    demandId,
    userId,
    action,
    timestamp,
    previousHash
  );
  
  return calculatedHash === storedHash;
}
