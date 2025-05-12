
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Demand, DemandStatus, Transaction } from "@/types";
import { ArrowLeft, Loader } from "lucide-react";
import { toast } from "sonner";
import { useBlockchain } from "@/hooks/useBlockchain";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import DemandDetailsCard from "@/components/demands/DemandDetailsCard";
import BlockchainTab from "@/components/demands/BlockchainTab";

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
          // Get MLA and Officer names if they're assigned
          let mlaName = '';
          let officerName = '';
          
          if (data.mla_id) {
            const { data: mlaData, error: mlaError } = await supabase
              .from('users')
              .select('name')
              .eq('id', data.mla_id)
              .single();
              
            if (!mlaError && mlaData) {
              mlaName = mlaData.name;
            }
          }
          
          if (data.officer_id) {
            const { data: officerData, error: officerError } = await supabase
              .from('users')
              .select('name')
              .eq('id', data.officer_id)
              .single();
              
            if (!officerError && officerData) {
              officerName = officerData.name;
            }
          }
          
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
            mlaName: mlaName,
            officerId: data.officer_id,
            officerName: officerName,
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

  // Fetch blockchain transactions
  useEffect(() => {
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
            try {
              const blockchainTxs = await getTransactions(id);
              if (blockchainTxs.length > 0) {
                setTransactions(blockchainTxs);
              }
            } catch (bcError) {
              console.error("Blockchain fallback failed:", bcError);
              toast.error("Failed to load transaction history from blockchain");
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transaction history");
      }
    };
    
    fetchTransactions();
  }, [id, getTransactions]);

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
              <DemandDetailsCard
                demand={demand}
                userRole={user?.role}
                notes={notes}
                setNotes={setNotes}
                isProcessing={isProcessing}
                onAction={handleAction}
              />
            </TabsContent>
            
            {/* Blockchain Tab */}
            <TabsContent value="blockchain" className="space-y-4">
              <BlockchainTab
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

export default DemandDetails;
