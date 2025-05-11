
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Demand, DemandStatus } from "@/types";
import { ClipboardList, FileText, Loader } from "lucide-react";
import { supabase, TablesUpdate, DemandStatus as SupabaseDemandStatus } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for MLA pending demands
const pendingDemands: Demand[] = [
  {
    id: "10",
    title: "Traffic Signal at Junction Road",
    description: "Install traffic signals at the busy Junction Road crossing for safety.",
    categoryId: "1",
    categoryName: "Infrastructure",
    proposerId: "5",
    proposerName: "Alex Thompson",
    submissionDate: "2025-04-18T09:20:00Z",
    status: "Pending",
    voteCount: 38,
    hash: "hash_g5h6i7j8"
  },
  {
    id: "11",
    title: "Community Center Renovation",
    description: "Renovate the aging community center in the western district.",
    categoryId: "7",
    categoryName: "Community",
    proposerId: "6",
    proposerName: "Priya Sharma",
    submissionDate: "2025-04-17T13:45:00Z",
    status: "Pending",
    voteCount: 52,
    hash: "hash_k9l0m1n2"
  },
  {
    id: "12",
    title: "School Computer Lab Update",
    description: "Update computers and equipment in public school computer labs.",
    categoryId: "2",
    categoryName: "Education",
    proposerId: "7",
    proposerName: "James Wilson",
    submissionDate: "2025-04-16T10:10:00Z",
    status: "Pending",
    voteCount: 47,
    hash: "hash_o3p4q5r6"
  },
  {
    id: "15",
    title: "Park Playground Upgrade",
    description: "Install modern play equipment and safety surfacing at Central Park.",
    categoryId: "4",
    categoryName: "Recreation",
    proposerId: "10",
    proposerName: "Sarah Martinez",
    submissionDate: "2025-04-15T11:20:00Z",
    status: "Pending",
    voteCount: 72,
    hash: "hash_a8b9c0d1"
  }
];

const MLAPendingDemands = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemands = async () => {
      setLoading(true);
      try {
        // Fetch real data from Supabase
        const { data, error } = await supabase
          .from('demands')
          .select('*, users!demands_proposer_id_fkey(name), categories!demands_category_id_fkey(name)')
          .eq('status', 'Pending');
        
        if (error) throw error;
        
        if (data) {
          const mappedDemands = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            categoryId: item.category_id,
            categoryName: item.categories?.name || '',
            proposerId: item.proposer_id,
            proposerName: item.users?.name || '',
            submissionDate: item.submission_date,
            status: item.status as DemandStatus,
            voteCount: item.vote_count,
            hash: item.hash,
            mlaId: item.mla_id,
            mlaName: item.mla_name,
            officerId: item.officer_id,
            officerName: item.officer_name,
            approvalDate: item.approval_date,
            rejectionDate: item.rejection_date,
          }));
          
          setDemands(mappedDemands);
        }
      } catch (error) {
        console.error("Error fetching demands:", error);
        toast.error("Failed to fetch pending demands");
      } finally {
        setLoading(false);
      }
    };

    fetchDemands();

    // Set up real-time subscription using separate channel to avoid conflicts
    const pendingDemandsChannel = supabase
      .channel('pending-demands-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'demands',
        filter: 'status=eq.Pending'
      }, payload => {
        console.log("Realtime update received:", payload);
        
        if (payload.new) {
          // Convert from database format to app format
          const newDemand = {
            id: (payload.new as any).id,
            title: (payload.new as any).title,
            description: (payload.new as any).description,
            categoryId: (payload.new as any).category_id,
            categoryName: (payload.new as any).category_name || '',
            proposerId: (payload.new as any).proposer_id,
            proposerName: (payload.new as any).proposer_name || '',
            submissionDate: (payload.new as any).submission_date,
            status: (payload.new as any).status as DemandStatus,
            voteCount: (payload.new as any).vote_count,
            hash: (payload.new as any).hash,
            mlaId: (payload.new as any).mla_id,
            mlaName: (payload.new as any).mla_name,
            officerId: (payload.new as any).officer_id,
            officerName: (payload.new as any).officer_name,
            approvalDate: (payload.new as any).approval_date,
            rejectionDate: (payload.new as any).rejection_date,
          };

          if (payload.eventType === 'INSERT') {
            setDemands(prev => [...prev, newDemand]);
            toast.info(`New demand submitted: ${newDemand.title}`);
          } else if (payload.eventType === 'UPDATE') {
            setDemands(prev => 
              prev.map(demand => demand.id === newDemand.id ? newDemand : demand)
            );
          } else if (payload.eventType === 'DELETE') {
            setDemands(prev => 
              prev.filter(demand => demand.id !== (payload.old as any).id)
            );
          }
        } else if (payload.old && payload.eventType === 'DELETE') {
          setDemands(prev => 
            prev.filter(demand => demand.id !== (payload.old as any).id)
          );
        }
      })
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      pendingDemandsChannel.unsubscribe();
    };
  }, []);

  const handleReview = async (demand: Demand, action: 'approve' | 'reject' | 'forward') => {
    if (!user) return;
    
    setLoading(true);
    try {
      let newStatus: SupabaseDemandStatus = 'Pending'; // Initialize with a valid DemandStatus
      let updateData: TablesUpdate['demands'] = {
        mla_id: user.id,
      };
      
      if (action === 'approve') {
        newStatus = 'Reviewed';
        updateData.status = newStatus;
      } else if (action === 'reject') {
        newStatus = 'Rejected';
        updateData.status = newStatus;
        updateData.rejection_date = new Date().toISOString();
      } else { // forward
        newStatus = 'Forwarded';
        updateData.status = newStatus;
      }
      
      // Update the demand in the database
      const { error } = await supabase
        .from('demands')
        .update(updateData)
        .eq('id', demand.id);
      
      if (error) throw error;
      
      toast.success(`Demand ${action}ed successfully`);
      
      // Navigate to detail view
      navigate(`/mla/demand/${demand.id}`);
    } catch (error) {
      console.error(`Error ${action}ing demand:`, error);
      toast.error(`Failed to ${action} the demand`);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Pending Demands</h2>
            <p className="text-muted-foreground">
              Review and process citizen demands that require your attention
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/mla')}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Pending Demands</CardTitle>
            <CardDescription>
              You have {demands.length} demands waiting for your review
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Proposer</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demands.length > 0 ? (
                    demands.map((demand) => (
                      <TableRow key={demand.id}>
                        <TableCell className="font-medium">{demand.title}</TableCell>
                        <TableCell>{demand.categoryName}</TableCell>
                        <TableCell>{demand.proposerName}</TableCell>
                        <TableCell>{new Date(demand.submissionDate).toLocaleDateString()}</TableCell>
                        <TableCell>{demand.voteCount}</TableCell>
                        <TableCell>{getStatusBadge(demand.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/mla/demand/${demand.id}`)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No pending demands found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-xs text-muted-foreground">
              Showing {demands.length} of {demands.length} demands
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MLAPendingDemands;
