
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createTransaction } from "@/lib/blockchain";

// Mock categories
const categories = [
  { id: "1", name: "Infrastructure" },
  { id: "2", name: "Education" },
  { id: "3", name: "Healthcare" },
  { id: "4", name: "Environment" },
  { id: "5", name: "Technology" },
  { id: "6", name: "Transportation" },
  { id: "7", name: "Community" },
  { id: "8", name: "Utilities" },
];

const SubmitDemand = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setDocuments([...documents, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new demand (this would typically be an API call)
      const newDemand = {
        id: `d_${Date.now()}`,
        title,
        description,
        categoryId,
        categoryName: categories.find(c => c.id === categoryId)?.name || "",
        proposerId: user?.id || "",
        proposerName: user?.name || "",
        submissionDate: new Date().toISOString(),
        status: "Pending" as const,
        voteCount: 0,
        hash: "hash_initial",
      };
      
      // Simulate blockchain transaction
      const transaction = createTransaction(
        newDemand.id,
        user?.id || "",
        user?.name || "",
        "Demand Submitted",
        null,
        "Pending"
      );
      
      // Update the hash in the demand
      newDemand.hash = transaction.dataHash;
      
      toast.success("Demand submitted successfully");
      navigate("/citizen");
    } catch (error) {
      console.error("Error submitting demand:", error);
      toast.error("Failed to submit demand. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/citizen")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Submit New Demand</h2>
            <p className="text-muted-foreground">
              Create a proposal for community improvement
            </p>
          </div>
        </div>

        <Card className="border-t-4 border-t-citizen">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Demand Details</CardTitle>
              <CardDescription>
                Provide detailed information about your demand to increase chances of approval
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter a clear, concise title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={categoryId} 
                  onValueChange={setCategoryId}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed explanation of your demand, its benefits, and why it should be approved"
                  className="h-32"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documents">Supporting Documents (Optional)</Label>
                <div className="mt-1 flex items-center space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="relative"
                    disabled={isSubmitting}
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload Files
                    <input
                      id="documents"
                      type="file"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      multiple
                      onChange={handleFileChange}
                      disabled={isSubmitting}
                    />
                  </Button>
                  <span className="text-sm text-gray-500">
                    {documents.length} {documents.length === 1 ? 'file' : 'files'} selected
                  </span>
                </div>
                
                {documents.length > 0 && (
                  <div className="mt-3 space-y-2 rounded-md border p-3">
                    <p className="text-sm font-medium">Selected Files:</p>
                    <ul className="space-y-1">
                      {documents.map((file, index) => (
                        <li key={index} className="flex items-center justify-between text-sm">
                          <span className="truncate">{file.name}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => removeFile(index)}
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG, PDF files up to 5MB each. Documents strengthen your proposal.
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                <p className="font-medium">Blockchain Transaction</p>
                <p className="mt-1">
                  When you submit this demand, a transaction will be recorded on the blockchain to ensure transparency and immutability of your request.
                </p>
              </div>
              
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/citizen")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-citizen hover:bg-citizen-hover"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Demand"
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SubmitDemand;
