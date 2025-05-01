
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Policy, Demand } from "@/types";
import { Search, FileText, PlusCircle, CalendarIcon, Loader2 } from "lucide-react";
import { useBlockchain } from "@/hooks/useBlockchain";
import { toast } from "sonner";

// Mock approved demands
const mockApprovedDemands: Demand[] = [
  {
    id: "401",
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
    id: "402",
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

// Mock policies
const mockPolicies: Policy[] = [
  {
    id: "1",
    title: "Healthcare Infrastructure Enhancement Policy",
    description: "This policy outlines the strategic plan for upgrading healthcare facilities across the region, including modernization of equipment, expansion of services, and improved patient care systems.",
    effectiveDate: "2025-05-01T00:00:00Z",
    officerId: "3",
    officerName: "Robert Officer",
    relatedDemandIds: ["401"]
  },
  {
    id: "2",
    title: "Urban Water Management Framework",
    description: "A comprehensive framework for managing and improving urban water infrastructure, ensuring clean and sustainable water supply to all citizens through modern treatment facilities and efficient distribution networks.",
    effectiveDate: "2025-06-01T00:00:00Z",
    officerId: "3",
    officerName: "Robert Officer",
    relatedDemandIds: ["402"]
  }
];

const OfficerPolicies = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { generateTransactionId } = useBlockchain();
  const [searchTerm, setSearchTerm] = useState("");
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [approvedDemands, setApprovedDemands] = useState<Demand[]>(mockApprovedDemands);
  const [isCreating, setIsCreating] = useState(false);
  
  // New policy dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState<{
    title: string;
    description: string;
    effectiveDate: string;
    relatedDemandIds: string[];
  }>({
    title: "",
    description: "",
    effectiveDate: "",
    relatedDemandIds: []
  });

  const filteredPolicies = policies.filter(policy =>
    policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePolicy = async () => {
    if (!newPolicy.title || !newPolicy.description || !newPolicy.effectiveDate || newPolicy.relatedDemandIds.length === 0) {
      toast.error("Please fill in all fields and select at least one demand");
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create policy with blockchain transaction id as reference
      const policyId = generateTransactionId();
      
      const policy: Policy = {
        id: policyId,
        title: newPolicy.title,
        description: newPolicy.description,
        effectiveDate: newPolicy.effectiveDate,
        officerId: user?.id || "",
        officerName: user?.name || "",
        relatedDemandIds: newPolicy.relatedDemandIds
      };
      
      // Add policy to the list
      setPolicies([policy, ...policies]);
      
      // Remove the used demands from the approved demands list
      setApprovedDemands(approvedDemands.filter(
        demand => !newPolicy.relatedDemandIds.includes(demand.id)
      ));
      
      // Close dialog and reset form
      setDialogOpen(false);
      setNewPolicy({
        title: "",
        description: "",
        effectiveDate: "",
        relatedDemandIds: []
      });
      
      toast.success("Policy created successfully");
    } catch (error) {
      console.error("Error creating policy:", error);
      toast.error("Failed to create policy");
    } finally {
      setIsCreating(false);
    }
  };
  
  const toggleSelectedDemand = (demandId: string) => {
    if (newPolicy.relatedDemandIds.includes(demandId)) {
      setNewPolicy({
        ...newPolicy,
        relatedDemandIds: newPolicy.relatedDemandIds.filter(id => id !== demandId)
      });
    } else {
      setNewPolicy({
        ...newPolicy,
        relatedDemandIds: [...newPolicy.relatedDemandIds, demandId]
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Policies</h2>
            <p className="text-muted-foreground">
              Create and manage policies based on approved demands
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => setDialogOpen(true)}
            disabled={approvedDemands.length === 0}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Policy
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search policies..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Policies grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredPolicies.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="h-24 flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No policies found
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPolicies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{policy.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    Effective: {new Date(policy.effectiveDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {policy.description}
                  </p>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Related Demands:</h4>
                    <div className="space-y-1">
                      {policy.relatedDemandIds.map(demandId => {
                        const relatedDemand = mockApprovedDemands.find(d => d.id === demandId);
                        return (
                          <div key={demandId} className="text-xs text-blue-600 hover:text-blue-800">
                            • {relatedDemand?.title || `Demand #${demandId}`}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Created by: {policy.officerName}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                    >
                      View Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* Create Policy Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Policy</DialogTitle>
              <DialogDescription>
                Create a policy based on approved citizen demands
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Policy Title</Label>
                <Input 
                  id="title" 
                  value={newPolicy.title} 
                  onChange={(e) => setNewPolicy({...newPolicy, title: e.target.value})}
                  placeholder="Enter policy title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newPolicy.description} 
                  onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                  placeholder="Provide a detailed description of the policy"
                  className="h-24"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input 
                  id="effectiveDate" 
                  type="date" 
                  value={newPolicy.effectiveDate}
                  onChange={(e) => setNewPolicy({...newPolicy, effectiveDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Related Demands</Label>
                {approvedDemands.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No approved demands available to create a policy
                  </p>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-2">
                    {approvedDemands.map(demand => (
                      <div 
                        key={demand.id}
                        className={`flex items-center p-2 rounded-md cursor-pointer ${
                          newPolicy.relatedDemandIds.includes(demand.id) 
                            ? "bg-blue-50 border border-blue-200" 
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => toggleSelectedDemand(demand.id)}
                      >
                        <input
                          type="checkbox"
                          checked={newPolicy.relatedDemandIds.includes(demand.id)}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        <div>
                          <p className="font-medium text-sm">{demand.title}</p>
                          <p className="text-xs text-gray-500">
                            Category: {demand.categoryName} | Votes: {demand.voteCount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                <p className="font-medium">Blockchain Transaction Notice</p>
                <p className="mt-1">
                  Creating a policy will generate a secure blockchain transaction linked to the approved demands,
                  ensuring transparency and immutability of policy creation.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreatePolicy}
                disabled={isCreating || approvedDemands.length === 0}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Policy"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default OfficerPolicies;
