
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Demand, DemandStatus } from "@/types";
import { Search, MoreHorizontal, FileText, ClipboardList } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// Mock demands data - combining different statuses
const allDemands: Demand[] = [
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
  },
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
    status: "Voting Open",
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
    status: "Reviewed",
    voteCount: 47,
    mlaId: "2",
    mlaName: "Mary MLA",
    hash: "hash_o3p4q5r6"
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
    status: "Approved",
    voteCount: 128,
    mlaId: "2",
    mlaName: "Mary MLA",
    officerId: "3",
    officerName: "Robert Officer",
    approvalDate: "2025-04-30T14:25:00Z",
    hash: "hash_s7t8u9v0"
  }
];

const AdminDemands = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<DemandStatus | "All">("All");

  const filteredDemands = allDemands.filter(demand => {
    const matchesSearch = 
      demand.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      demand.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demand.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demand.proposerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || demand.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const handleActionClick = (action: string, demand: Demand) => {
    switch (action) {
      case "view":
        navigate(`/admin/demand/${demand.id}`);
        break;
      case "verify":
        toast.success(`Demand hash ${demand.hash.substring(0, 12)}... verified on blockchain`);
        break;
      case "delete":
        toast.success(`Demand "${demand.title}" has been deleted`);
        break;
    }
  };

  // Count demands by status
  const countByStatus = (status: DemandStatus) => {
    return allDemands.filter(d => d.status === status).length;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Demand Management</h2>
            <p className="text-muted-foreground">
              Monitor and manage all citizen demands in the system
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search demands..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={statusFilter === "All" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("All")}
            >
              All
            </Button>
            <Button 
              variant={statusFilter === "Pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("Pending")}
            >
              Pending
            </Button>
            <Button 
              variant={statusFilter === "Voting Open" ? "default" : "outline"}
              size="sm"
              className={statusFilter === "Voting Open" ? "bg-blue-600" : ""}
              onClick={() => setStatusFilter("Voting Open")}
            >
              Voting
            </Button>
            <Button 
              variant={statusFilter === "Reviewed" ? "default" : "outline"}
              size="sm"
              className={statusFilter === "Reviewed" ? "bg-purple-600" : ""}
              onClick={() => setStatusFilter("Reviewed")}
            >
              Reviewed
            </Button>
            <Button 
              variant={statusFilter === "Forwarded" ? "default" : "outline"}
              size="sm"
              className={statusFilter === "Forwarded" ? "bg-amber-600" : ""}
              onClick={() => setStatusFilter("Forwarded")}
            >
              Forwarded
            </Button>
            <Button 
              variant={statusFilter === "Approved" ? "default" : "outline"}
              size="sm"
              className={statusFilter === "Approved" ? "bg-green-600" : ""}
              onClick={() => setStatusFilter("Approved")}
            >
              Approved
            </Button>
            <Button 
              variant={statusFilter === "Rejected" ? "default" : "outline"}
              size="sm"
              className={statusFilter === "Rejected" ? "bg-red-600" : ""}
              onClick={() => setStatusFilter("Rejected")}
            >
              Rejected
            </Button>
          </div>
        </div>

        {/* Demands table */}
        <Card>
          <CardHeader>
            <CardTitle>All Demands</CardTitle>
            <CardDescription>
              Showing {filteredDemands.length} of {allDemands.length} demands
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Proposer</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDemands.map((demand) => (
                  <TableRow key={demand.id}>
                    <TableCell className="font-medium">{demand.title}</TableCell>
                    <TableCell>{demand.categoryName}</TableCell>
                    <TableCell>{demand.proposerName}</TableCell>
                    <TableCell>{demand.voteCount}</TableCell>
                    <TableCell>{getStatusBadge(demand.status)}</TableCell>
                    <TableCell>{new Date(demand.submissionDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleActionClick("view", demand)}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActionClick("verify", demand)}>
                            <span>Verify Hash</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleActionClick("delete", demand)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <span>Delete Demand</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Status counts */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allDemands.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countByStatus("Pending")}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Voting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countByStatus("Voting Open")}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countByStatus("Reviewed")}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countByStatus("Approved")}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countByStatus("Rejected")}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDemands;
