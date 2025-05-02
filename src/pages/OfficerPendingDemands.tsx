
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
import { CheckCircle, ClipboardList, FileText, Loader } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Mock data for Officer pending demands
const forwardedDemands: Demand[] = [
  {
    id: "3",
    title: "School Renovation",
    description: "The public school in North District needs renovation and new facilities.",
    categoryId: "2",
    categoryName: "Education",
    proposerId: "1",
    proposerName: "John Citizen",
    submissionDate: "2025-04-05T09:45:00Z",
    status: "Forwarded",
    voteCount: 87,
    mlaId: "2",
    mlaName: "Mary MLA",
    hash: "hash_i9j0k1l2"
  },
  {
    id: "13",
    title: "Water Treatment Plant Upgrade",
    description: "Upgrade the city water treatment plant to improve water quality and capacity.",
    categoryId: "8",
    categoryName: "Utilities",
    proposerId: "8",
    proposerName: "David Chen",
    submissionDate: "2025-04-14T08:30:00Z",
    status: "Forwarded",
    voteCount: 128,
    mlaId: "2",
    mlaName: "Mary MLA",
    hash: "hash_s7t8u9v0"
  },
  {
    id: "14",
    title: "Senior Citizen Recreation Center",
    description: "Establish a dedicated recreation center for senior citizens with appropriate facilities.",
    categoryId: "7",
    categoryName: "Community",
    proposerId: "9",
    proposerName: "Lisa Johnson",
    submissionDate: "2025-04-10T15:20:00Z",
    status: "Forwarded",
    voteCount: 96,
    mlaId: "2",
    mlaName: "Mary MLA",
    hash: "hash_w1x2y3z4"
  },
  {
    id: "16",
    title: "Traffic Management System",
    description: "Implement a smart traffic management system at major intersections to reduce congestion.",
    categoryId: "1",
    categoryName: "Infrastructure",
    proposerId: "11",
    proposerName: "Michael Brown",
    submissionDate: "2025-04-09T13:15:00Z",
    status: "Forwarded",
    voteCount: 103,
    mlaId: "2",
    mlaName: "Mary MLA",
    hash: "hash_e2f3g4h5"
  }
];

const OfficerPendingDemands = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [demands, setDemands] = useState<Demand[]>(forwardedDemands);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDemands = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch from the database
        // Using type assertion to work around TypeScript limitations with Supabase types
        // const { data, error } = await supabase
        //   .from('demands')
        //   .select('*')
        //   .eq('status', 'Forwarded') as any;
        
        // if (error) throw error;
        // if (data) {
        //   const mappedDemands = data.map((item: any) => ({
        //     id: item.id,
        //     title: item.title,
        //     description: item.description,
        //     categoryId: item.category_id,
        //     categoryName: item.category_name,
        //     proposerId: item.proposer_id,
        //     proposerName: item.proposer_name,
        //     submissionDate: item.submission_date,
        //     status: item.status as DemandStatus,
        //     voteCount: item.vote_count,
        //     hash: item.hash,
        //     mlaId: item.mla_id,
        //     mlaName: item.mla_name,
        //     officerId: item.officer_id,
        //     officerName: item.officer_name,
        //     approvalDate: item.approval_date,
        //     rejectionDate: item.rejection_date,
        //   }));
        //   setDemands(mappedDemands);
        // } else {
        //   // Using mock data as fallback
        //   setDemands(forwardedDemands);
        // }
        
        // Using mock data for now
        setDemands(forwardedDemands);
      } catch (error) {
        console.error("Error fetching demands:", error);
        toast.error("Failed to fetch forwarded demands");
      } finally {
        setLoading(false);
      }
    };

    fetchDemands();

    // Set up real-time subscription
    const subscription = supabase
      .channel('forwarded-demands')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'demands',
        filter: 'status=eq.Forwarded'
      }, payload => {
        if (payload.new) {
          // Convert from database format to app format
          const newDemand = {
            id: (payload.new as any).id,
            title: (payload.new as any).title,
            description: (payload.new as any).description,
            categoryId: (payload.new as any).category_id,
            categoryName: (payload.new as any).category_name,
            proposerId: (payload.new as any).proposer_id,
            proposerName: (payload.new as any).proposer_name,
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
          } else if (payload.eventType === 'UPDATE') {
            setDemands(prev => 
              prev.map(demand => demand.id === newDemand.id ? newDemand : demand)
            );
          } else if (payload.eventType === 'DELETE') {
            setDemands(prev => 
              prev.filter(demand => demand.id !== (payload.old as any).id)
            );
          }
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAction = async (demand: Demand, action: 'approve' | 'reject') => {
    if (!user) return;
    
    setLoading(true);
    try {
      let newStatus: DemandStatus;
      let updateData: any = {
        officer_id: user.id,
        officer_name: user.name,
      };
      
      if (action === 'approve') {
        newStatus = 'Approved';
        updateData.status = newStatus;
        updateData.approval_date = new Date().toISOString();
      } else { // reject
        newStatus = 'Rejected';
        updateData.status = newStatus;
        updateData.rejection_date = new Date().toISOString();
      }
      
      // Update the demand in the database
      // Using type assertion to work around TypeScript limitations
      const { error } = await supabase
        .from('demands')
        .update(updateData)
        .eq('id', demand.id) as any;
      
      if (error) throw error;
      
      // Navigate to detail view
      navigate(`/officer/demand/${demand.id}`);
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
            <h2 className="text-3xl font-bold tracking-tight">Pending Approvals</h2>
            <p className="text-muted-foreground">
              Review and process demands forwarded by MLAs
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/officer')}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forwarded Demands</CardTitle>
            <CardDescription>
              You have {demands.length} demands waiting for your final approval
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
                    <TableHead>Forwarded By</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demands.map((demand) => (
                    <TableRow key={demand.id}>
                      <TableCell className="font-medium">{demand.title}</TableCell>
                      <TableCell>{demand.categoryName}</TableCell>
                      <TableCell>{demand.mlaName}</TableCell>
                      <TableCell>{new Date(demand.submissionDate).toLocaleDateString()}</TableCell>
                      <TableCell>{demand.voteCount}</TableCell>
                      <TableCell>{getStatusBadge(demand.status)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/officer/demand/${demand.id}`)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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

export default OfficerPendingDemands;
