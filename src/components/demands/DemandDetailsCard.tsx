
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Demand } from "@/types";
import { UserRole } from "@/integrations/supabase/client";
import DocumentsList from "@/components/DocumentsList";
import StatusBadge from "./StatusBadge";
import DemandActionButtons from "./DemandActionButtons";

interface DemandDetailsCardProps {
  demand: Demand;
  userRole?: UserRole;
  notes: string;
  setNotes: (notes: string) => void;
  isProcessing: boolean;
  onAction: (action: 'approve' | 'reject' | 'forward') => void;
}

const DemandDetailsCard = ({
  demand,
  userRole,
  notes,
  setNotes,
  isProcessing,
  onAction
}: DemandDetailsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-2xl">{demand.title}</CardTitle>
          <StatusBadge status={demand.status} />
        </div>
        <CardDescription>Category: {demand.categoryName}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-1 font-medium">Description</h3>
          <div className="whitespace-pre-line rounded-md bg-slate-50 p-4 text-sm">
            {demand.description}
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-1 text-sm font-medium">Submitted By</h3>
            <p>{demand.proposerName}</p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium">Submission Date</h3>
            <p>{new Date(demand.submissionDate).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium">Votes</h3>
            <p>{demand.voteCount}</p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium">Status</h3>
            <p>{demand.status}</p>
          </div>
        </div>
        
        {demand.mlaId && demand.mlaName && (
          <div>
            <h3 className="mb-1 text-sm font-medium">MLA Review</h3>
            <p>Reviewed by {demand.mlaName}</p>
          </div>
        )}
        
        {demand.officerId && demand.officerName && (
          <div>
            <h3 className="mb-1 text-sm font-medium">Officer Approval</h3>
            <p>Processed by {demand.officerName}</p>
            {demand.approvalDate && (
              <p>Approved on {new Date(demand.approvalDate).toLocaleDateString()}</p>
            )}
            {demand.rejectionDate && (
              <p>Rejected on {new Date(demand.rejectionDate).toLocaleDateString()}</p>
            )}
          </div>
        )}
        
        {/* Supporting Documents Section */}
        <div>
          <h3 className="mb-1 font-medium">Supporting Documents</h3>
          <DocumentsList demandId={demand.id} />
        </div>
        
        {/* Notes field for MLA/Officer */}
        {(userRole === 'MLA' || userRole === 'Higher Public Officer') && 
        (demand?.status === 'Pending' || demand?.status === 'Forwarded') && (
          <div className="space-y-2">
            <h3 className="font-medium">Add Notes</h3>
            <Textarea
              placeholder="Add your comments or justification for your decision..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-24"
            />
          </div>
        )}
        
        {/* Action buttons */}
        <DemandActionButtons 
          userRole={userRole}
          demandStatus={demand.status}
          isProcessing={isProcessing}
          onAction={onAction}
        />
      </CardContent>
    </Card>
  );
};

export default DemandDetailsCard;
