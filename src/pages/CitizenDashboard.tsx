
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusCircle } from "lucide-react";
import DemandsList from "@/components/citizen/DemandsList";
import DashboardSummary from "@/components/citizen/DashboardSummary";
import useDemandsData from "@/hooks/useDemandsData";

const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    loading, 
    myDemands, 
    votingOpportunities, 
    votedDemands, 
    handleVote 
  } = useDemandsData();

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
            <DemandsList 
              demands={myDemands}
              emptyMessage="You haven't submitted any demands yet."
            />
          </TabsContent>
          
          {/* Vote Tab */}
          <TabsContent value="vote" className="space-y-4">
            <DemandsList 
              demands={votingOpportunities}
              votedDemands={votedDemands}
              showVoteButtons
              onVote={handleVote}
              emptyMessage="There are no demands currently open for voting."
            />
          </TabsContent>
        </Tabs>

        {/* Summary Cards */}
        <DashboardSummary 
          myDemands={myDemands} 
          votedDemands={votedDemands} 
        />
      </div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
