
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Demand, DemandStatus } from "@/types";
import { FileText, PlusCircle } from "lucide-react";

// Mock data for the demo
const mockDemands: Demand[] = [
  {
    id: "1",
    title: "Road Repair in Sector 7",
    description: "The roads in Sector 7 are in poor condition and need immediate repair.",
    categoryId: "1",
    categoryName: "Infrastructure",
    proposerId: "1",
    proposerName: "John Citizen",
    submissionDate: "2025-04-15T10:30:00Z",
    status: "Pending",
    voteCount: 24,
    hash: "hash_a1b2c3d4"
  },
  {
    id: "2",
    title: "New Park Development",
    description: "Develop a new public park in the eastern district with playground and walking trails.",
    categoryId: "1",
    categoryName: "Infrastructure",
    proposerId: "1",
    proposerName: "John Citizen",
    submissionDate: "2025-04-10T14:15:00Z",
    status: "Reviewed",
    voteCount: 56,
    mlaId: "2",
    mlaName: "Mary MLA",
    hash: "hash_e5f6g7h8"
  },
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
    id: "4",
    title: "Healthcare Center Upgradation",
    description: "Upgrade the community healthcare center with modern equipment and facilities.",
    categoryId: "3",
    categoryName: "Healthcare",
    proposerId: "1",
    proposerName: "John Citizen",
    submissionDate: "2025-03-28T11:20:00Z",
    status: "Approved",
    voteCount: 142,
    mlaId: "2",
    mlaName: "Mary MLA",
    officerId: "3",
    officerName: "Robert Officer",
    approvalDate: "2025-04-15T16:30:00Z",
    hash: "hash_m3n4o5p6"
  },
  {
    id: "5",
    title: "Public Library Expansion",
    description: "Expand the central public library to include digital resources section.",
    categoryId: "4",
    categoryName: "Education",
    proposerId: "1",
    proposerName: "John Citizen",
    submissionDate: "2025-03-20T13:10:00Z",
    status: "Rejected",
    voteCount: 67,
    mlaId: "2",
    mlaName: "Mary MLA",
    rejectionDate: "2025-04-10T10:45:00Z",
    hash: "hash_q7r8s9t0"
  }
];

// Mock data for voting opportunities
const votingOpportunities: Demand[] = [
  {
    id: "6",
    title: "Community Solar Power Project",
    description: "Implement solar panels in community buildings to reduce energy costs.",
    categoryId: "5",
    categoryName: "Environment",
    proposerId: "7",
    proposerName: "Sarah Johnson",
    submissionDate: "2025-04-16T08:20:00Z",
    status: "Voting Open",
    voteCount: 48,
    hash: "hash_u1v2w3x4"
  },
  {
    id: "7",
    title: "Public WiFi in Parks",
    description: "Install free public WiFi across all major city parks.",
    categoryId: "6",
    categoryName: "Technology",
    proposerId: "8",
    proposerName: "Michael Lee",
    submissionDate: "2025-04-14T16:40:00Z",
    status: "Voting Open",
    voteCount: 73,
    hash: "hash_y5z6a7b8"
  },
  {
    id: "8",
    title: "Weekend Farmers Market",
    description: "Establish a weekend farmers market to support local producers.",
    categoryId: "7",
    categoryName: "Community",
    proposerId: "9",
    proposerName: "Emma Wilson",
    submissionDate: "2025-04-12T11:30:00Z",
    status: "Voting Open",
    voteCount: 91,
    hash: "hash_c9d0e1f2"
  }
];

const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [votedDemands, setVotedDemands] = useState<string[]>([]);

  const handleVote = (demandId: string) => {
    if (votedDemands.includes(demandId)) {
      return;
    }
    
    // In a real app, this would be an API call
    setVotedDemands(prev => [...prev, demandId]);
    
    // Update the vote count in the UI
    const updatedVotingOpportunities = votingOpportunities.map(demand => {
      if (demand.id === demandId) {
        return { ...demand, voteCount: demand.voteCount + 1 };
      }
      return demand;
    });
    
    // We don't update the state here as this is just mock data
    console.log("Updated vote count", updatedVotingOpportunities);
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockDemands.map((demand) => (
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
          </TabsContent>
          
          {/* Vote Tab */}
          <TabsContent value="vote" className="space-y-4">
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
                      <div>Current Votes: {votedDemands.includes(demand.id) ? demand.voteCount + 1 : demand.voteCount}</div>
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
          </TabsContent>
        </Tabs>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Demands Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockDemands.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved Demands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockDemands.filter(d => d.status === "Approved").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockDemands.filter(d => ["Pending", "Reviewed", "Forwarded"].includes(d.status)).length}
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
