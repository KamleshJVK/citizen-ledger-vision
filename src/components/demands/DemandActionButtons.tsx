
import { Button } from "@/components/ui/button";
import { Loader, X, Clock, CheckCircle } from "lucide-react";
import { DemandStatus } from "@/types";
import { UserRole } from "@/integrations/supabase/client";

interface DemandActionButtonsProps {
  userRole?: UserRole;
  demandStatus?: DemandStatus;
  isProcessing: boolean;
  onAction: (action: 'approve' | 'reject' | 'forward') => void;
}

const DemandActionButtons = ({ 
  userRole, 
  demandStatus, 
  isProcessing, 
  onAction 
}: DemandActionButtonsProps) => {
  // Only show action buttons if the user is an MLA or Officer and the demand is in the right state
  if (userRole === 'MLA' && demandStatus === 'Pending') {
    return (
      <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button 
          variant="outline" 
          className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onAction('reject')}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
          Reject
        </Button>
        <Button 
          variant="outline"
          className="border-amber-300 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
          onClick={() => onAction('forward')}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
          Forward to Officer
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => onAction('approve')}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
          Approve
        </Button>
      </div>
    );
  }
  
  if (userRole === 'Higher Public Officer' && demandStatus === 'Forwarded') {
    return (
      <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button 
          variant="outline" 
          className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onAction('reject')}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
          Reject
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => onAction('approve')}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
          Approve
        </Button>
      </div>
    );
  }
  
  return null;
};

export default DemandActionButtons;
