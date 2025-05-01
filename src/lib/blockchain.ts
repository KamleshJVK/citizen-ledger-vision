
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
  // For this prototype, we'll create a more complex string-based hash
  
  const data = `${transactionId}:${demandId}:${userId}:${action}:${timestamp}:${previousHash}`;
  
  // Enhanced hash function that generates more blockchain-like hashes
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string with leading zeros for more blockchain-like appearance
  const hashHex = Math.abs(hash).toString(16).padStart(16, '0');
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
) {
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

// Simulate a blockchain consensus mechanism
export function simulateConsensus(transactions: any[], threshold: number = 0.67) {
  // In a real blockchain, this would involve multiple nodes validating transactions
  // For this prototype, we'll simulate consensus with a simple probability check
  
  const consensusReached = Math.random() > (1 - threshold);
  
  return {
    consensusReached,
    validatedTransactions: consensusReached ? transactions : [],
    invalidTransactions: consensusReached ? [] : transactions,
    validationTimestamp: new Date().toISOString()
  };
}

// Create a block of transactions for the blockchain
export function createBlock(transactions: any[], previousBlockHash: string = '0') {
  const blockId = `block_${Date.now()}`;
  const timestamp = new Date().toISOString();
  const merkleRoot = createMerkleRoot(transactions);
  
  const blockData = `${blockId}:${timestamp}:${merkleRoot}:${previousBlockHash}`;
  
  // Simple hash function for the entire block
  let blockHash = 0;
  for (let i = 0; i < blockData.length; i++) {
    const char = blockData.charCodeAt(i);
    blockHash = ((blockHash << 5) - blockHash) + char;
    blockHash = blockHash & blockHash;
  }
  
  const blockHashHex = Math.abs(blockHash).toString(16).padStart(16, '0');
  
  return {
    blockId,
    timestamp,
    transactions,
    transactionCount: transactions.length,
    merkleRoot,
    previousBlockHash,
    blockHash: `bk_${blockHashHex}`,
    nonce: Math.floor(Math.random() * 1000000)
  };
}

// Create a Merkle root hash from a list of transaction hashes
function createMerkleRoot(transactions: any[]) {
  // In a real blockchain, this would be a proper Merkle tree implementation
  // For this prototype, we'll use a simplified approach
  
  const transactionHashes = transactions.map(tx => tx.dataHash);
  
  if (transactionHashes.length === 0) {
    return 'merkle_root_0';
  }
  
  if (transactionHashes.length === 1) {
    return `merkle_root_${transactionHashes[0]}`;
  }
  
  // Combine hashes in pairs
  const combinedHashes = [];
  
  for (let i = 0; i < transactionHashes.length; i += 2) {
    const firstHash = transactionHashes[i];
    const secondHash = (i + 1 < transactionHashes.length) 
      ? transactionHashes[i + 1] 
      : firstHash;
    
    const combinedData = `${firstHash}:${secondHash}`;
    
    // Simple hash function
    let hash = 0;
    for (let j = 0; j < combinedData.length; j++) {
      const char = combinedData.charCodeAt(j);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const hashHex = Math.abs(hash).toString(16).padStart(16, '0');
    combinedHashes.push(`mr_${hashHex}`);
  }
  
  // Recursively combine until we have a single root hash
  if (combinedHashes.length > 1) {
    return createMerkleRoot(combinedHashes.map(hash => ({ dataHash: hash })));
  } else {
    return combinedHashes[0];
  }
}
