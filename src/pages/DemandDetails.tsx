
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Demand, DemandStatus, Transaction } from "@/types";
import { ArrowLeft, CheckCircle, Clock, FileDown, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { createTransaction, verifyTransaction } from "@/lib/blockchain";

// Mock demand details for the demo
const mockDemand: Demand = {
  id: "1",
  title: "Road Repair in Sector 7",
  description: "The roads in Sector 7 are in poor condition and need immediate repair. Multiple potholes have developed over the past year, causing damage to vehicles and creating safety hazards for pedestrians. This repair would benefit approximately 5000 residents in the area and improve access to the local market and school.\n\nSpecific issues include:\n- Large potholes at the main junction\n- Cracked pavement along residential streets\n- Poor drainage causing water accumulation\n- Faded road markings and signs\n\nThe community has attempted to address minor issues through volunteer efforts, but professional repair is now necessary for long-term resolution.",
  categoryId: "1",
  categoryName: "Infrastructure",
  proposerId: "1",
  proposerName: "John Citizen",
  submissionDate: "2025-04-15T10:30:00Z",
  status: "Pending",
  voteCount: 24,
  hash: "hash_a1b2c3d4"
};

// Mock transactions for the demo
const mockTransactions: Transaction[] = [
  {
    id: "tx_001",
    demandId: "1",
    userId: "1",
    userName: "John Citizen",
    action: "Demand Submitted",
    timestamp: "2025-04-15T10:30:00Z",
    previousStatus: null,
    newStatus: "Pending",
    dataHash: "hash_a1b2c3d4"
  }
];

const DemandDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [demand] = useState<Demand>(mockDemand); // In real app, would fetch based on ID
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const getStatusBadge = (status: DemandStatus) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-slate-100">Pending</Badge>;
      case 'Voting Open':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Voting Open</Badge>;
      case 'Reviewed':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Reviewed</Badge>;
      case 'Forwarded':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Forwarded</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 'Rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
    }
  };

  const handleAction = async (action: 'approve' | 'reject' | 'forward') => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let newStatus: DemandStatus;
      let transactionAction: Transaction['action'];
      
      // Determine new status and transaction action based on user role and action
      if (user?.role === 'MLA') {
        if (action === 'approve') {
          newStatus = 'Reviewed';
          transactionAction = 'Demand Reviewed';
        } else if (action === 'reject') {
          newStatus = 'Rejected';
          transactionAction = 'Demand Rejected';
        } else { // forward
          newStatus = 'Forwarded';
          transactionAction = 'Demand Reviewed';
        }
      } else { // Higher Public Officer
        if (action === 'approve') {
          newStatus = 'Approved';
          transactionAction = 'Demand Approved';
        } else {
          newStatus = 'Rejected';
          transactionAction = 'Demand Rejected';
        }
      }
      
      // Create a blockchain transaction
      const previousHash = transactions[transactions.length - 1].dataHash;
      const transaction = createTransaction(
        demand.id,
        user?.id || "",
        user?.name || "",
        transactionAction,
        demand.status,
        newStatus,
        previousHash
      );
      
      // Update transactions
      setTransactions([...transactions, transaction]);
      
      // Show success message based on action
      toast.success(`Demand ${action === 'forward' ? 'forwarded' : action + 'd'} successfully`);
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        if (user?.role === 'MLA') {
          navigate("/mla");
        } else {
          navigate("/officer");
        }
      }, 1500);
    } catch (error) {
      console.error(`Error ${action}ing demand:`, error);
      toast.error(`Failed to ${action} demand. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyTransaction = async (transaction: Transaction) => {
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Find the previous transaction to get its hash
      const transactionIndex = transactions.findIndex(t => t.id === transaction.id);
      const previousHash = transactionIndex > 0 
        ? transactions[transactionIndex - 1].dataHash 
        : '0';
      
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
    } catch (error) {
      console.error("Error verifying transaction:", error);
      toast.error("Failed to verify transaction");
    } finally {
      setIsVerifying(false);
    }
  };

  const getActionButtons = () => {
    // Only show action buttons if the user is an MLA or Officer and the demand is in the right state
    if (user?.role === 'MLA' && demand.status === 'Pending') {
      return (
        <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleAction('reject')}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
            Reject
          </Button>
          <Button 
            variant="outline"
            className="border-amber-300 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
            onClick={() => handleAction('forward')}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
            Forward to Officer
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleAction('approve')}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Approve
          </Button>
        </div>
      );
    }
    
    if (user?.role === 'Higher Public Officer' && demand.status === 'Forwarded') {
      return (
        <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleAction('reject')}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
            Reject
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleAction('approve')}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Approve
          </Button>
        </div>
      );
    }
    
    return null;
  };

  const getBackLink = () => {
    switch (user?.role) {
      case 'Common Citizen':
        return '/citizen';
      case 'MLA':
        return '/mla';
      case 'Higher Public Officer':
        return '/officer';
      case 'Admin':
        return '/admin';
      default:
        return '/';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(getBackLink())}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Demand Details</h2>
            <p className="text-muted-foreground">
              View and manage demand information
            </p>
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain Record</TabsTrigger>
          </TabsList>
          
          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-2xl">{demand.title}</CardTitle>
                  {getStatusBadge(demand.status)}
                </div>
                <CardDescription>Category: {demand.categoryName}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-1 font-medium">Description</h3>
                  <div className="whitespace-pre-line rounded-md bg-slate-50 p-4 text-sm">
                    {demand.description}
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-1 text-sm font-medium">Submitted By</h3>
                    <p>{demand.proposerName}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-medium">Submission Date</h3>
                    <p>{new Date(demand.submissionDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-medium">Votes</h3>
                    <p>{demand.voteCount}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-medium">Status</h3>
                    <p>{demand.status}</p>
                  </div>
                </div>
                
                {demand.mlaId && (
                  <div>
                    <h3 className="mb-1 text-sm font-medium">MLA Review</h3>
                    <p>Reviewed by {demand.mlaName}</p>
                  </div>
                )}
                
                {demand.officerId && (
                  <div>
                    <h3 className="mb-1 text-sm font-medium">Officer Approval</h3>
                    <p>Processed by {demand.officerName}</p>
                    {demand.approvalDate && (
                      <p>Approved on {new Date(demand.approvalDate).toLocaleDateString()}</p>
                    )}
                    {demand.rejectionDate && (
                      <p>Rejected on {new Date(demand.rejectionDate).toLocaleDateString()}</p>
                    )}
                  </div>
                )}
                
                {/* Supporting Documents Section */}
                <div>
                  <h3 className="mb-1 font-medium">Supporting Documents</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <FileDown className="mr-1 h-3 w-3" />
                      site_survey.pdf
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <FileDown className="mr-1 h-3 w-3" />
                      damage_photos.zip
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <FileDown className="mr-1 h-3 w-3" />
                      budget_estimate.xlsx
                    </Button>
                  </div>
                </div>
                
                {/* Notes field for MLA/Officer */}
                {(user?.role === 'MLA' || user?.role === 'Higher Public Officer') && 
                 (demand.status === 'Pending' || demand.status === 'Forwarded') && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Add Notes</h3>
                    <Textarea
                      placeholder="Add your comments or justification for your decision..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="h-24"
                    />
                  </div>
                )}
                
                {/* Action buttons */}
                {getActionButtons()}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Blockchain Tab */}
          <TabsContent value="blockchain" className="space-y-4">
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
                  <div className="font-mono text-sm break-all">{demand.hash}</div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Transaction Log</h3>
                  
                  {transactions.map((transaction, index) => (
                    <div 
                      key={transaction.id} 
                      className="rounded-md border bg-slate-50 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium">{transaction.action}</h4>
                        {verificationResult !== null && transactions[index].id === transaction.id && (
                          <Badge 
                            className={verificationResult ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}
                          >
                            {verificationResult ? "Verified" : "Verification Failed"}
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
                        disabled={isVerifying}
                      >
                        {isVerifying && transactions[index].id === transaction.id ? (
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        ) : null}
                        Verify Transaction
                      </Button>
                    </div>
                  ))}
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DemandDetails;
