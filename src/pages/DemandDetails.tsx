import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Demand, DemandStatus, Transaction } from "@/types";
import { ArrowLeft, CheckCircle, Clock, Loader, X } from "lucide-react";
import { toast } from "sonner";
import TransactionViewer from "@/components/TransactionViewer";
import { useBlockchain } from "@/hooks/useBlockchain";
import DocumentsList from "@/components/DocumentsList";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

const DemandDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createTransaction, getTransactions, isLoading: isBlockchainLoading } = useBlockchain();
  
  const [demand, setDemand] = useState<Demand | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch demand details
  useEffect(() => {
    const fetchDemand = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('demands')
          .select('*, users!demands_proposer_id_fkey(name), categories!demands_category_id_fkey(name)')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setDemand({
            id: data.id,
            title: data.title,
            description: data.description,
            categoryId: data.category_id,
            categoryName: data.categories?.name || '',
            proposerId: data.proposer_id,
            proposerName: data.users?.name || '',
            submissionDate: data.submission_date,
            status: data.status as DemandStatus,
            voteCount: data.vote_count,
            hash: data.hash,
            mlaId: data.mla_id,
            mlaName: data.mla_name,
            officerId: data.officer_id,
            officerName: data.officer_name,
            approvalDate: data.approval_date,
            rejectionDate: data.rejection_date,
          });
        }
      } catch (error: any) {
        console.error("Error fetching demand:", error);
        toast.error(`Failed to load demand: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDemand();
  }, [id]);

  useEffect(() => {
    // Fetch blockchain transactions
    const fetchTransactions = async () => {
      try {
        if (id) {
          // First try to get from database
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('demand_id', id)
            .order('timestamp', { ascending: true });
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            const txs: Transaction[] = data.map(tx => ({
              id: tx.id,
              demandId: tx.demand_id,
              userId: tx.user_id,
              userName: tx.user_name,
              action: tx.action,
              timestamp: tx.timestamp,
              previousStatus: tx.previous_status,
              newStatus: tx.new_status,
              dataHash: tx.data_hash
            }));
            
            setTransactions(txs);
          } else {
            // Fallback to blockchain
            const blockchainTxs = await getTransactions(id);
            if (blockchainTxs.length > 0) {
              setTransactions(blockchainTxs);
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transaction history");
        
        // Try blockchain as fallback
        try {
          if (id) {
            const blockchainTxs = await getTransactions(id);
            if (blockchainTxs.length > 0) {
              setTransactions(blockchainTxs);
            }
          }
        } catch (bcError) {
          console.error("Blockchain fallback also failed:", bcError);
        }
      }
    };
    
    fetchTransactions();
  }, [id, getTransactions]);

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
    if (!user || !id || !demand) return;
    
    setIsProcessing(true);
    
    try {
      // Determine new status and transaction action based on user role and action
      let newStatus: DemandStatus;
      let transactionAction: Transaction['action'];
      
      if (user.role === 'MLA') {
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
      
      // Update the demand in the database
      const updateData: any = {
        status: newStatus
      };
      
      if (user.role === 'MLA') {
        updateData.mla_id = user.id;
        updateData.mla_name = user.name;
      } else if (user.role === 'Higher Public Officer') {
        updateData.officer_id = user.id;
        updateData.officer_name = user.name;
        
        if (action === 'approve') {
          updateData.approval_date = new Date().toISOString();
        } else if (action === 'reject') {
          updateData.rejection_date = new Date().toISOString();
        }
      }
      
      const { error: updateError } = await supabase
        .from('demands')
        .update(updateData)
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      // Create a blockchain transaction
      const previousHash = transactions.length > 0 ? transactions[transactions.length - 1].dataHash : '0';
      const transaction = await createTransaction(
        id,
        transactionAction,
        demand.status,
        newStatus,
        previousHash
      );
      
      // Record the transaction in the database
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          id: `t_${uuidv4()}`,
          demand_id: id,
          user_id: user.id,
          user_name: user.name,
          action: transactionAction,
          timestamp: new Date().toISOString(),
          previous_status: demand.status,
          new_status: newStatus,
          data_hash: transaction.dataHash
        });
        
      if (txError) {
        console.error("Error recording transaction:", txError);
        // Continue anyway since the demand was updated
      }
      
      // Update transactions list
      setTransactions(prevTransactions => [...prevTransactions, transaction]);
      
      // Update demand in state
      setDemand(prev => 
        prev ? { ...prev, status: newStatus } : null
      );
      
      // Show success message
      toast.success(`Demand ${action === 'forward' ? 'forwarded' : action + 'd'} successfully`);
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        if (user.role === 'MLA') {
          navigate("/mla");
        } else {
          navigate("/officer");
        }
      }, 1500);
    } catch (error: any) {
      console.error(`Error ${action}ing demand:`, error);
      toast.error(`Failed to ${action} demand. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionButtons = () => {
    // Only show action buttons if the user is an MLA or Officer and the demand is in the right state
    if (user?.role === 'MLA' && demand?.status === 'Pending') {
      return (
        <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleAction('reject')}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
            Reject
          </Button>
          <Button 
            variant="outline"
            className="border-amber-300 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
            onClick={() => handleAction('forward')}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
            Forward to Officer
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleAction('approve')}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Approve
          </Button>
        </div>
      );
    }
    
    if (user?.role === 'Higher Public Officer' && demand?.status === 'Forwarded') {
      return (
        <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleAction('reject')}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
            Reject
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleAction('approve')}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
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
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : demand ? (
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
                    <DocumentsList demandId={demand.id} />
                  </div>
                  
                  {/* Notes field for MLA/Officer */}
                  {(user?.role === 'MLA' || user?.role === 'Higher Public Officer') && 
                  (demand?.status === 'Pending' || demand?.status === 'Forwarded') && (
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
              <TransactionViewer 
                transactions={transactions} 
                demandId={id || ''}
                demandHash={demand.hash} 
              />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl font-medium text-muted-foreground">Demand not found</p>
          <Button 
            variant="link" 
            onClick={() => navigate(-1)}
            className="mt-2"
          >
            Go Back
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
};

const getActionButtons = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const { createTransaction } = useBlockchain();
  const [demand, setDemand] = useState<Demand | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleAction = async (action: 'approve' | 'reject' | 'forward') => {
    if (!user || !id || !demand) return;
    
    setIsProcessing(true);
    
    try {
      // Determine new status and transaction action based on user role and action
      let newStatus: DemandStatus;
      let transactionAction: Transaction['action'];
      
      if (user.role === 'MLA') {
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
      // const previousHash = transactions.length > 0 ? transactions[transactions.length - 1].dataHash : '0';
      // const transaction = await createTransaction(
      //   id,
      //   transactionAction,
      //   demand.status,
      //   newStatus,
      //   previousHash
      // );
      
      // // Update transactions list
      // setTransactions(prevTransactions => [...prevTransactions, transaction]);
      
      // // Update demand in state
      // setDemand(prev => 
      //   prev ? { ...prev, status: newStatus } : null
      // );
      
      // Show success message
      toast.success(`Demand ${action === 'forward' ? 'forwarded' : action + 'd'} successfully`);
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        if (user.role === 'MLA') {
          navigate("/mla");
        } else {
          navigate("/officer");
        }
      }, 1500);
    } catch (error: any) {
      console.error(`Error ${action}ing demand:`, error);
      toast.error(`Failed to ${action} demand. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const { user: authUser } = useAuth();
  const { demand: currentDemand } = useParams();

  if (!authUser) {
    return null;
  }

  if (!demand) {
    return null;
  }

  // Only show action buttons if the user is an MLA or Officer and the demand is in the right state
  if (authUser?.role === 'MLA' && demand?.status === 'Pending') {
    return (
      <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button 
          variant="outline" 
          className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => handleAction('reject')}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
          Reject
        </Button>
        <Button 
          variant="outline"
          className="border-amber-300 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
          onClick={() => handleAction('forward')}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
          Forward to Officer
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => handleAction('approve')}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
          Approve
        </Button>
      </div>
    );
  }
  
  if (authUser?.role === 'Higher Public Officer' && demand?.status === 'Forwarded') {
    return (
      <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button 
          variant="outline" 
          className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => handleAction('reject')}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
          Reject
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => handleAction('approve')}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
          Approve
        </Button>
      </div>
    );
  }
  
  return null;
};

const getBackLink = () => {
  const { user } = useAuth();

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

export default DemandDetails;
