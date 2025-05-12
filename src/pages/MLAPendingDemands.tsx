
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
import { ClipboardList, FileText } from "lucide-react";
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
              You have {pendingDemands.length} demands waiting for your review
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                {pendingDemands.map((demand) => (
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-xs text-muted-foreground">
              Showing {pendingDemands.length} of {pendingDemands.length} demands
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MLAPendingDemands;
