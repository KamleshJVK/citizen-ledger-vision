
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types";
import { Loader2, RefreshCw } from "lucide-react";
import { useBlockchain } from "@/hooks/useBlockchain";
import { supabase } from "@/integrations/supabase/client";

interface TransactionViewerProps {
  transactions?: Transaction[];
  demandId: string;
  demandHash?: string;
  className?: string;
}

const TransactionViewer = ({ transactions: initialTransactions, demandId, demandHash, className = "" }: TransactionViewerProps) => {
  const { verifyBlockchainTransaction, isVerifying, verificationResult, loadTransactions } = useBlockchain();
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Load transactions when demandId changes
  useEffect(() => {
    if (demandId) {
      fetchTransactions();
    }
  }, [demandId]);
  
  // Set up real-time listener for this demand's transactions
  useEffect(() => {
    if (!demandId) return;
    
    const channel = supabase
      .channel(`demand-${demandId}-transactions`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'transactions',
        filter: `demandId=eq.${demandId}` 
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
  }, [demandId]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const fetchedTransactions = await loadTransactions(demandId);
      setTransactions(fetchedTransactions);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyTransaction = async (transaction: Transaction) => {
    setVerifyingId(transaction.id);
    
    // Find the previous transaction to get its hash
    const transactionIndex = transactions.findIndex(t => t.id === transaction.id);
    const previousHash = transactionIndex > 0 
      ? transactions[transactionIndex - 1].dataHash 
      : '0';
    
    // Verify the transaction
    await verifyBlockchainTransaction(transaction, previousHash);
    
    setVerifyingId(null);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Blockchain Transaction History</CardTitle>
            <CardDescription>
              View and verify all transactions related to this demand
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={fetchTransactions}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <RefreshCw className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {demandHash && (
          <div className="rounded-md border p-4">
            <h3 className="mb-2 font-medium">Demand Hash</h3>
            <div className="font-mono text-sm break-all">{demandHash}</div>
          </div>
        )}
        
        <div className="space-y-4">
          <h3 className="font-medium">Transaction Log</h3>
          
          {transactions.length === 0 ? (
            <div className="rounded-md border bg-slate-50 p-4 text-center text-muted-foreground">
              {isLoading ? "Loading transactions..." : "No transactions found"}
            </div>
          ) : (
            transactions.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className="rounded-md border bg-slate-50 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">{transaction.action}</h4>
                  {verifyingId === transaction.id || (verificationResult !== null && verifyingId === transaction.id) ? (
                    <Badge 
                      className={verificationResult ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}
                    >
                      {verificationResult ? "Verified" : "Verification Failed"}
                    </Badge>
                  ) : null}
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
                  disabled={isVerifying}
                >
                  {isVerifying && verifyingId === transaction.id ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
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
