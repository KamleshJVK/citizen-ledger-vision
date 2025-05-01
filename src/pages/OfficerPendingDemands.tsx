
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
import { Badge } from "@/components/ui/badge";
import { Demand } from "@/types";
import { Search, FileText, ClipboardList, CheckCircle, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useBlockchain } from "@/hooks/useBlockchain";

// Mock forwarded demands data
const mockForwardedDemands: Demand[] = [
  {
    id: "201",
    title: "Highway Expansion Project",
    description: "Expand the highway connecting the city to the industrial zone to reduce traffic congestion.",
    categoryId: "1",
    categoryName: "Infrastructure",
    proposerId: "1",
    proposerName: "John Citizen",
    submissionDate: "2025-04-10T10:30:00Z",
    status: "Forwarded",
    voteCount: 156,
    mlaId: "2",
    mlaName: "Mary MLA",
    hash: "hash_a1b2c3d4"
  },
  {
    id: "202",
    title: "New Public Hospital",
    description: "Construct a new public hospital in the eastern district to improve healthcare access.",
    categoryId: "3",
    categoryName: "Healthcare",
    proposerId: "5",
    proposerName: "David Chen",
    submissionDate: "2025-04-08T09:15:00Z",
    status: "Forwarded",
    voteCount: 243,
    mlaId: "2",
    mlaName: "Mary MLA",
    hash: "hash_e5f6g7h8"
  },
  {
    id: "203",
    title: "Metro Railway Extension",
    description: "Extend the metro railway line to cover suburban areas for better connectivity.",
    categoryId: "6",
    categoryName: "Transportation",
    proposerId: "7",
    proposerName: "Priya Sharma",
    submissionDate: "2025-04-06T14:20:00Z",
    status: "Forwarded",
    voteCount: 187,
    mlaId: "2",
    mlaName: "Mary MLA",
    hash: "hash_i9j0k1l2"
  },
  {
    id: "204",
    title: "Smart City Initiative",
    description: "Implement smart technologies across the city for improved services and management.",
    categoryId: "5",
    categoryName: "Technology",
    proposerId: "3",
    proposerName: "Emily Wilson",
    submissionDate: "2025-04-04T11:40:00Z",
    status: "Forwarded",
    voteCount: 132,
    mlaId: "2",
    mlaName: "Mary MLA",
    hash: "hash_m3n4o5p6"
  }
];

const OfficerPendingDemands = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createBlockchainTransaction } = useBlockchain();
  const [searchTerm, setSearchTerm] = useState("");
  const [demands, setDemands] = useState<Demand[]>(mockForwardedDemands);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  const filteredDemands = demands.filter(demand =>
    demand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demand.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demand.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demand.proposerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demand.mlaName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = async (demandId: string, action: 'approve' | 'reject') => {
    setProcessing(prev => ({ ...prev, [demandId]: true }));
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const demand = demands.find(d => d.id === demandId);
      
      if (!demand) {
        toast.error("Demand not found");
        return;
      }
      
      let newStatus = action === 'approve' ? 'Approved' : 'Rejected';
      let transactionAction = action === 'approve' ? 'Demand Approved' : 'Demand Rejected';
      
      // Create a blockchain transaction
      const transaction = createBlockchainTransaction(
        demandId,
        user?.id || "",
        user?.name || "",
        transactionAction,
        demand.status,
        newStatus
      );
      
      // Update demand in the UI
      const updatedDemands = demands.filter(d => d.id !== demandId);
      setDemands(updatedDemands);
      
      toast.success(`Demand ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
    } catch (error) {
      console.error(`Error ${action}ing demand:`, error);
      toast.error(`Failed to ${action} demand. Please try again.`);
    } finally {
      setProcessing(prev => ({ ...prev, [demandId]: false }));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Forwarded Demands</h2>
            <p className="text-muted-foreground">
              Review demands forwarded by MLAs that require your approval
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/officer')}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search demands..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Pending demands table */}
        <Card>
          <CardHeader>
            <CardTitle>Forwarded Demands</CardTitle>
            <CardDescription>
              {filteredDemands.length} demands requiring your approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Forwarded By</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDemands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No forwarded demands found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDemands.map((demand) => (
                    <TableRow key={demand.id}>
                      <TableCell className="font-medium">{demand.title}</TableCell>
                      <TableCell>{demand.categoryName}</TableCell>
                      <TableCell>{demand.mlaName}</TableCell>
                      <TableCell>{demand.voteCount}</TableCell>
                      <TableCell>{new Date(demand.submissionDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/officer/demand/${demand.id}`)}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAction(demand.id, 'reject')}
                          disabled={processing[demand.id]}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAction(demand.id, 'approve')}
                          disabled={processing[demand.id]}
                          className="text-green-500 hover:text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Information cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demands.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Blockchain Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold">Secure</div>
                <Badge className="ml-2 bg-green-100 text-green-800 border-green-300">
                  Verified
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OfficerPendingDemands;
