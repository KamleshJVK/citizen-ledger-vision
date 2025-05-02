
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Transaction as BlockchainTransaction,
  verifyTransaction as verifyBlockchainTransaction
} from "@/lib/blockchain";
import { Loader, CheckCircle, XCircle } from "lucide-react";

export interface TransactionViewerProps {
  transactions: BlockchainTransaction[];
  demandId: string;
  demandHash: string;
}

const TransactionViewer = ({ transactions, demandId, demandHash }: TransactionViewerProps) => {
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationResults, setVerificationResults] = useState<Record<string, boolean>>({});

  const handleVerifyTransaction = async (transaction: BlockchainTransaction) => {
    setVerifyingId(transaction.id);
    try {
      // Find the previous transaction to get its hash
      const transactionIndex = transactions.findIndex(t => t.id === transaction.id);
      const previousHash = transactionIndex > 0 
        ? transactions[transactionIndex - 1].dataHash 
        : '0';
      
      // Verify the transaction
      const result = verifyBlockchainTransaction(
        transaction.id,
        transaction.demandId,
        transaction.userId,
        transaction.action,
        transaction.timestamp,
        previousHash,
        transaction.dataHash
      );
      
      // Store the verification result
      setVerificationResults(prev => ({
        ...prev,
        [transaction.id]: result
      }));
      
    } catch (error) {
      console.error("Error verifying transaction:", error);
      setVerificationResults(prev => ({
        ...prev,
        [transaction.id]: false
      }));
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Transaction History</CardTitle>
        <CardDescription>
          View and verify all transactions related to this demand
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="rounded-md border p-4">
          <h3 className="mb-2 font-medium">Demand Hash</h3>
          <div className="font-mono text-sm break-all">{demandHash}</div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Transaction Log</h3>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions recorded yet
            </div>
          ) : (
            transactions.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className="rounded-md border bg-slate-50 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">{transaction.action}</h4>
                  {verificationResults[transaction.id] !== undefined && (
                    <Badge 
                      className={verificationResults[transaction.id] 
                        ? "bg-green-100 text-green-800 border-green-300" 
                        : "bg-red-100 text-red-800 border-red-300"
                      }
                    >
                      {verificationResults[transaction.id] ? "Verified" : "Verification Failed"}
                    </Badge>
                  )}
                </div>
                
                <div className="mb-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <span className="font-medium">Transaction ID:</span> 
                    <div className="font-mono text-xs">{transaction.id}</div>
                  </div>
                  <div>
                    <span className="font-medium">Timestamp:</span> 
                    <div>{new Date(transaction.timestamp).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="font-medium">User:</span> 
                    <div>{transaction.userName}</div>
                  </div>
                  <div>
                    <span className="font-medium">Status Change:</span> 
                    <div>
                      {transaction.previousStatus || "None"} → {transaction.newStatus}
                    </div>
                  </div>
                </div>
                
                <div className="mb-2">
                  <span className="font-medium">Data Hash:</span>
                  <div className="font-mono text-xs break-all mt-1">{transaction.dataHash}</div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => handleVerifyTransaction(transaction)}
                  disabled={verifyingId === transaction.id}
                >
                  {verifyingId === transaction.id ? (
                    <Loader className="mr-2 h-3 w-3 animate-spin" />
                  ) : null}
                  Verify Transaction
                </Button>
              </div>
            ))
          )}
        </div>
        
        <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
          <h3 className="mb-2 font-medium">About Blockchain Verification</h3>
          <p>
            Each transaction creates a unique hash based on the demand data and previous transaction, 
            forming an immutable chain. Verification checks if the stored hash matches a recalculation 
            of the hash using the original data, confirming data integrity.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionViewer;
