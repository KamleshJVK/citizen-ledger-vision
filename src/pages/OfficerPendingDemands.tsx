
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
import { CheckCircle, ClipboardList, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
              You have {forwardedDemands.length} demands waiting for your final approval
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                {forwardedDemands.map((demand) => (
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
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-xs text-muted-foreground">
              Showing {forwardedDemands.length} of {forwardedDemands.length} demands
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OfficerPendingDemands;
