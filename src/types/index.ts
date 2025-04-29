
export type UserRole = 'Common Citizen' | 'MLA' | 'Higher Public Officer' | 'Admin';

export type DemandStatus = 
  | 'Pending' 
  | 'Voting Open' 
  | 'Reviewed' 
  | 'Forwarded' 
  | 'Approved' 
  | 'Rejected';

export type TransactionAction = 
  | 'Demand Submitted'
  | 'Demand Reviewed'
  | 'Demand Voted'
  | 'Demand Approved'
  | 'Demand Rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  aadharNumber?: string;
  publicKey: string;
  privateKey?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Demand {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  proposerId: string;
  proposerName: string;
  submissionDate: string;
  status: DemandStatus;
  voteCount: number;
  mlaId?: string;
  mlaName?: string;
  officerId?: string;
  officerName?: string;
  approvalDate?: string;
  rejectionDate?: string;
  hash: string;
}

export interface Policy {
  id: string;
  title: string;
  description: string;
  effectiveDate: string;
  officerId: string;
  officerName: string;
  relatedDemandIds: string[];
}

export interface Vote {
  id: string;
  demandId: string;
  userId: string;
  voteDate: string;
}

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
