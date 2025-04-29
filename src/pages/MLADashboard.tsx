
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Demand, DemandStatus } from "@/types";
import { FileText } from "lucide-react";

// Mock data for MLA dashboard
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
  }
];

const reviewedDemands: Demand[] = [
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

const MLADashboard = () => {
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
        <div>
          <h2 className="text-3xl font-bold tracking-tight">MLA Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Main content */}
        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed Demands</TabsTrigger>
          </TabsList>
          
          {/* Pending Review Tab */}
          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingDemands.map((demand) => (
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
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/mla/demand/${demand.id}`)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Review Demand
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Reviewed Demands Tab */}
          <TabsContent value="reviewed" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviewedDemands.map((demand) => (
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
                      
                      {demand.officerId && (
                        <div className="mt-1">Processed by: {demand.officerName}</div>
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
                      onClick={() => navigate(`/mla/demand/${demand.id}`)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Details
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
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingDemands.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviewedDemands.filter(d => ["Reviewed", "Forwarded", "Approved", "Rejected"].includes(d.status)).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviewedDemands.filter(d => d.status === "Approved").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviewedDemands.filter(d => d.status === "Rejected").length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MLADashboard;
