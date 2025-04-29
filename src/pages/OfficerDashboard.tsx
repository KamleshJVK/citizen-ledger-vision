
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Demand, DemandStatus, Policy } from "@/types";
import { FileText, FilePlus } from "lucide-react";

// Mock data for Officer dashboard
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
  }
];

const policies: Policy[] = [
  {
    id: "1",
    title: "Green Urban Development Initiative",
    description: "Establishing eco-friendly urban planning guidelines based on citizen inputs.",
    effectiveDate: "2025-04-15T00:00:00Z",
    officerId: "3",
    officerName: "Robert Officer",
    relatedDemandIds: ["4", "13"]
  },
  {
    id: "2",
    title: "Rural Education Enhancement Program",
    description: "Improving educational infrastructure in rural communities.",
    effectiveDate: "2025-04-12T00:00:00Z",
    officerId: "3",
    officerName: "Robert Officer",
    relatedDemandIds: ["3"]
  },
  {
    id: "3",
    title: "Public Transport Expansion",
    description: "Extending public transportation services to underserved neighborhoods.",
    effectiveDate: "2025-04-05T00:00:00Z",
    officerId: "3",
    officerName: "Robert Officer",
    relatedDemandIds: []
  }
];

const OfficerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
            <h2 className="text-3xl font-bold tracking-tight">Officer Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => navigate('/officer/policies/new')}
          >
            <FilePlus className="mr-2 h-4 w-4" />
            Create New Policy
          </Button>
        </div>

        {/* Main content */}
        <Tabs defaultValue="forwarded">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="forwarded">Demands For Approval</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>
          
          {/* Forwarded Demands Tab */}
          <TabsContent value="forwarded" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {forwardedDemands.map((demand) => (
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
                      <div>Proposed by: {demand.proposerName}</div>
                      <div>Submitted: {new Date(demand.submissionDate).toLocaleDateString()}</div>
                      <div>Votes: {demand.voteCount}</div>
                      <div className="mt-1">Reviewed by: {demand.mlaName}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/officer/demand/${demand.id}`)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Review Demand
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {policies.map((policy) => (
                <Card key={policy.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{policy.title}</CardTitle>
                    <CardDescription>
                      Effective: {new Date(policy.effectiveDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {policy.description}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      <div>Created by: {policy.officerName}</div>
                      <div>
                        Related Demands: {policy.relatedDemandIds.length > 0 ? policy.relatedDemandIds.length : "None"}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/officer/policy/${policy.id}`)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Policy
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
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forwardedDemands.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{policies.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved Demands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rejected Demands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OfficerDashboard;
