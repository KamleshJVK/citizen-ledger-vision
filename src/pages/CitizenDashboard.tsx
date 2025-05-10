import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Demand, DemandStatus } from "@/types";
import { FileText, PlusCircle, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // State for demands
  const [myDemands, setMyDemands] = useState<Demand[]>([]);
  const [votingOpportunities, setVotingOpportunities] = useState<Demand[]>([]);
  const [votedDemands, setVotedDemands] = useState<string[]>([]);

  // Fetch demands and setup real-time subscriptions
  useEffect(() => {
    if (!user) return;
    
    // Fetch user's demands
    const fetchMyDemands = async () => {
      try {
        const { data, error } = await supabase
          .from('demands')
          .select('*')
          .eq('proposer_id', user.id)
          .order('submission_date', { ascending: false }) as any;
          
        if (error) throw error;
        
        if (data) {
          const demands: Demand[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            categoryId: item.category_id,
            categoryName: item.category_name,
            proposerId: item.proposer_id,
            proposerName: item.proposer_name,
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
          
          setMyDemands(demands);
        }
      } catch (error) {
        console.error("Error fetching user demands:", error);
        toast.error("Failed to load your demands");
      }
    };
    
    // Fetch voting opportunities (demands with status "Voting Open")
    const fetchVotingOpportunities = async () => {
      try {
        const { data, error } = await supabase
          .from('demands')
          .select('*')
          .eq('status', 'Voting Open')
          .order('vote_count', { ascending: false }) as any;
          
        if (error) throw error;
        
        if (data) {
          const demands: Demand[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            categoryId: item.category_id,
            categoryName: item.category_name,
            proposerId: item.proposer_id,
            proposerName: item.proposer_name,
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
          
          setVotingOpportunities(demands);
        }
      } catch (error) {
        console.error("Error fetching voting opportunities:", error);
        toast.error("Failed to load voting opportunities");
      }
    };
    
    // Fetch user's votes
    const fetchUserVotes = async () => {
      try {
        const { data, error } = await supabase
          .from('votes')
          .select('demand_id')
          .eq('user_id', user.id) as any;
          
        if (error) throw error;
        
        if (data) {
          setVotedDemands(data.map((vote: any) => vote.demand_id));
        }
      } catch (error) {
        console.error("Error fetching user votes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch all data
    Promise.all([
      fetchMyDemands(),
      fetchVotingOpportunities(),
      fetchUserVotes()
    ]).finally(() => {
      setLoading(false);
    });
    
    // Set up real-time subscriptions
    
    // Subscription for user's demands
    const myDemandsSubscription = supabase
      .channel('my-demands-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'demands',
        filter: `proposer_id=eq.${user.id}`
      }, payload => {
        if (payload.new) {
          const demandData = payload.new as any;
          const demand: Demand = {
            id: demandData.id,
            title: demandData.title,
            description: demandData.description,
            categoryId: demandData.category_id,
            categoryName: demandData.category_name,
            proposerId: demandData.proposer_id,
            proposerName: demandData.proposer_name,
            submissionDate: demandData.submission_date,
            status: demandData.status as DemandStatus,
            voteCount: demandData.vote_count,
            hash: demandData.hash,
            mlaId: demandData.mla_id,
            mlaName: demandData.mla_name,
            officerId: demandData.officer_id,
            officerName: demandData.officer_name,
            approvalDate: demandData.approval_date,
            rejectionDate: demandData.rejection_date,
          };

          if (payload.eventType === 'INSERT') {
            setMyDemands(prev => [demand, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setMyDemands(prev => 
              prev.map(d => d.id === demand.id ? demand : d)
            );
          } else if (payload.eventType === 'DELETE') {
            setMyDemands(prev => 
              prev.filter(d => d.id !== demandData.id)
            );
          }
        }
      })
      .subscribe();
    
    // Subscription for voting opportunities
    const votingSubscription = supabase
      .channel('voting-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'demands',
        filter: 'status=eq.Voting Open'
      }, payload => {
        if (payload.new) {
          const demandData = payload.new as any;
          const demand: Demand = {
            id: demandData.id,
            title: demandData.title,
            description: demandData.description,
            categoryId: demandData.category_id,
            categoryName: demandData.category_name,
            proposerId: demandData.proposer_id,
            proposerName: demandData.proposer_name,
            submissionDate: demandData.submission_date,
            status: demandData.status as DemandStatus,
            voteCount: demandData.vote_count,
            hash: demandData.hash,
            mlaId: demandData.mla_id,
            mlaName: demandData.mla_name,
            officerId: demandData.officer_id,
            officerName: demandData.officer_name,
            approvalDate: demandData.approval_date,
            rejectionDate: demandData.rejection_date,
          };

          if (payload.eventType === 'INSERT') {
            setVotingOpportunities(prev => [demand, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setVotingOpportunities(prev => 
              prev.map(d => d.id === demand.id ? demand : d)
            );
          } else if (payload.eventType === 'DELETE' || demandData.status !== 'Voting Open') {
            setVotingOpportunities(prev => 
              prev.filter(d => d.id !== demandData.id)
            );
          }
        }
      })
      .subscribe();
      
    // Subscription for user votes
    const votesSubscription = supabase
      .channel('votes-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'votes',
        filter: `user_id=eq.${user.id}`
      }, payload => {
        if (payload.eventType === 'INSERT' && payload.new) {
          setVotedDemands(prev => [...prev, (payload.new as any).demand_id]);
        } else if (payload.eventType === 'DELETE' && payload.old) {
          setVotedDemands(prev => 
            prev.filter(id => id !== (payload.old as any).demand_id)
          );
        }
      })
      .subscribe();

    // Cleanup function
    return () => {
      myDemandsSubscription.unsubscribe();
      votingSubscription.unsubscribe();
      votesSubscription.unsubscribe();
    };
  }, [user]);

  const handleVote = async (demandId: string) => {
    if (!user) {
      toast.error("You must be logged in to vote");
      return;
    }
    
    if (votedDemands.includes(demandId)) {
      toast.info("You have already voted for this demand");
      return;
    }
    
    try {
      // Insert vote into database
      const { error } = await supabase
        .from('votes')
        .insert({
          id: `v_${uuidv4()}`,
          demand_id: demandId,
          user_id: user.id,
          vote_date: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Increment vote count in the demand
      const { error: updateError } = await supabase.rpc('increment_vote_count', {
        demand_id: demandId
      });
      
      if (updateError) {
        // Handle RPC function missing by doing direct update
        const { data: demand, error: fetchError } = await supabase
          .from('demands')
          .select('vote_count')
          .eq('id', demandId)
          .single() as any;
          
        if (fetchError) throw fetchError;
        
        const newVoteCount = (demand?.vote_count || 0) + 1;
        
        // Update the demand with the new vote count
        const { error: directUpdateError } = await supabase
          .from('demands')
          .update({ vote_count: newVoteCount })
          .eq('id', demandId);
          
        if (directUpdateError) throw directUpdateError;
      }
      
      toast.success("Vote submitted successfully");
      
      // Optimistically update the UI
      setVotedDemands(prev => [...prev, demandId]);
      setVotingOpportunities(prev => 
        prev.map(demand => 
          demand.id === demandId 
            ? { ...demand, voteCount: demand.voteCount + 1 }
            : demand
        )
      );
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("Failed to submit vote. Please try again.");
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-lg">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Citizen Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => navigate('/citizen/submit-demand')}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit New Demand
          </Button>
        </div>

        {/* Main content */}
        <Tabs defaultValue="my-demands">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="my-demands">My Demands</TabsTrigger>
            <TabsTrigger value="vote">Vote on Demands</TabsTrigger>
          </TabsList>
          
          {/* My Demands Tab */}
          <TabsContent value="my-demands" className="space-y-4">
            {myDemands.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">You haven't submitted any demands yet.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate('/citizen/submit-demand')}
                >
                  Submit Your First Demand
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myDemands.map((demand) => (
                  <Card key={demand.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{demand.title}</CardTitle>
                        {getStatusBadge(demand.status)}
                      </div>
                      <CardDescription>{demand.categoryName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {demand.description}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        <div>Submitted: {new Date(demand.submissionDate).toLocaleDateString()}</div>
                        <div>Votes: {demand.voteCount}</div>
                        
                        {demand.mlaId && (
                          <div className="mt-1">Reviewed by: {demand.mlaName}</div>
                        )}
                        
                        {demand.officerId && (
                          <div>Processed by: {demand.officerName}</div>
                        )}
                        
                        {demand.approvalDate && (
                          <div>Approved: {new Date(demand.approvalDate).toLocaleDateString()}</div>
                        )}
                        
                        {demand.rejectionDate && (
                          <div>Rejected: {new Date(demand.rejectionDate).toLocaleDateString()}</div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/citizen/demand/${demand.id}`)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Vote Tab */}
          <TabsContent value="vote" className="space-y-4">
            {votingOpportunities.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">There are no demands currently open for voting.</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {votingOpportunities.map((demand) => (
                  <Card key={demand.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{demand.title}</CardTitle>
                        <Badge className="bg-blue-500">Voting Open</Badge>
                      </div>
                      <CardDescription>{demand.categoryName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {demand.description}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        <div>Proposed by: {demand.proposerName}</div>
                        <div>Submitted: {new Date(demand.submissionDate).toLocaleDateString()}</div>
                        <div>Current Votes: {demand.voteCount}</div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/citizen/demand/${demand.id}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        className="w-full"
                        disabled={votedDemands.includes(demand.id)}
                        onClick={() => handleVote(demand.id)}
                      >
                        {votedDemands.includes(demand.id) ? "Voted" : "Vote"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Demands Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myDemands.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved Demands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myDemands.filter(d => d.status === "Approved").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myDemands.filter(d => ["Pending", "Reviewed", "Forwarded"].includes(d.status)).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{votedDemands.length}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
