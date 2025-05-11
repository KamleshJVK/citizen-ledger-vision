
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Demand, DemandStatus } from "@/types";
import { supabase, DemandStatus as SupabaseDemandStatus } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export const useDemandsData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myDemands, setMyDemands] = useState<Demand[]>([]);
  const [votingOpportunities, setVotingOpportunities] = useState<Demand[]>([]);
  const [votedDemands, setVotedDemands] = useState<string[]>([]);

  // Helper function to convert API data to Demand objects
  const mapApiToDemand = (item: any): Demand => ({
    id: item.id,
    title: item.title,
    description: item.description,
    categoryId: item.category_id,
    categoryName: item.category_name || '',
    proposerId: item.proposer_id,
    proposerName: item.proposer_name || '',
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
  });

  // Handle vote submission
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
          user_id: user.id
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
          .single();
          
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

  // Fetch data and set up subscriptions
  useEffect(() => {
    if (!user) return;
    
    // Fetch user's demands
    const fetchMyDemands = async () => {
      try {
        const { data, error } = await supabase
          .from('demands')
          .select('*, users!demands_proposer_id_fkey(name), categories!demands_category_id_fkey(name)')
          .eq('proposer_id', user.id)
          .order('submission_date', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          const processedDemands = data.map(item => ({
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
            mlaName: null,
            officerId: item.officer_id,
            officerName: null,
            approvalDate: item.approval_date,
            rejectionDate: item.rejection_date,
          }));
          setMyDemands(processedDemands);
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
          .select('*, users!demands_proposer_id_fkey(name), categories!demands_category_id_fkey(name)')
          .eq('status', 'Voting Open')
          .order('vote_count', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          const processedDemands = data.map(item => ({
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
            mlaName: null,
            officerId: item.officer_id,
            officerName: null,
            approvalDate: item.approval_date,
            rejectionDate: item.rejection_date,
          }));
          setVotingOpportunities(processedDemands);
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
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data) {
          setVotedDemands(data.map(vote => vote.demand_id));
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
        console.log("Real-time update for my demands:", payload);
        
        if (payload.new) {
          const demandData = payload.new as any;
          const demand = mapApiToDemand(demandData);

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
        console.log("Real-time update for voting opportunities:", payload);
        
        if (payload.new) {
          const demandData = payload.new as any;
          const demand = mapApiToDemand(demandData);

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
        console.log("Real-time update for user votes:", payload);
        
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

  return {
    loading,
    myDemands,
    votingOpportunities,
    votedDemands,
    handleVote
  };
};

export default useDemandsData;
