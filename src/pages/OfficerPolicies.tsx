
import { useState } from "react";
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Policy } from "@/types";
import { FileText, FilePlus, Search, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// Mock data for Officer policies
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
  },
  {
    id: "4",
    title: "Healthcare Accessibility Program",
    description: "Improving access to healthcare services in remote areas through mobile clinics.",
    effectiveDate: "2025-05-01T00:00:00Z",
    officerId: "3",
    officerName: "Robert Officer",
    relatedDemandIds: ["4"]
  },
  {
    id: "5",
    title: "Digital Literacy Initiative",
    description: "Providing digital skills training to underserved communities.",
    effectiveDate: "2025-04-20T00:00:00Z",
    officerId: "3",
    officerName: "Robert Officer",
    relatedDemandIds: []
  }
];

// Mock approved demands for policy creation
const approvedDemands = [
  { id: "3", title: "School Renovation" },
  { id: "4", title: "Healthcare Center Upgradation" },
  { id: "13", title: "Water Treatment Plant Upgrade" }
];

const OfficerPolicies = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    title: "",
    description: "",
    effectiveDate: "",
    relatedDemands: [] as string[]
  });

  const filteredPolicies = policies.filter(policy => 
    policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePolicy = () => {
    // Validate form
    if (!newPolicy.title || !newPolicy.description || !newPolicy.effectiveDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // In a real app, this would save to the database
    toast.success("Policy created successfully");
    setIsDialogOpen(false);
    setNewPolicy({
      title: "",
      description: "",
      effectiveDate: "",
      relatedDemands: []
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Policy Management</h2>
            <p className="text-muted-foreground">
              Create and manage public policies based on approved citizen demands
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <FilePlus className="mr-2 h-4 w-4" />
            Create New Policy
          </Button>
        </div>

        {/* Search and filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search policies..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Policies list */}
        <Card>
          <CardHeader>
            <CardTitle>Active Policies</CardTitle>
            <CardDescription>
              Showing {filteredPolicies.length} of {policies.length} policies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Related Demands</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{policy.description}</TableCell>
                    <TableCell>{new Date(policy.effectiveDate).toLocaleDateString()}</TableCell>
                    <TableCell>{policy.officerName}</TableCell>
                    <TableCell>{policy.relatedDemandIds.length}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/officer/policy/${policy.id}`)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Policy Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Policy</DialogTitle>
              <DialogDescription>
                Complete the form below to create a new public policy
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPolicy.title}
                  onChange={(e) => setNewPolicy({...newPolicy, title: e.target.value})}
                  placeholder="Policy title"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newPolicy.description}
                  onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                  placeholder="Policy description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="effectiveDate"
                    type="date"
                    className="pl-8"
                    value={newPolicy.effectiveDate}
                    onChange={(e) => setNewPolicy({...newPolicy, effectiveDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label>Related Approved Demands</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select related demands..." />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedDemands.map(demand => (
                      <SelectItem key={demand.id} value={demand.id}>{demand.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground mt-1">
                  Link approved demands that this policy addresses
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreatePolicy}>Create Policy</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default OfficerPolicies;
