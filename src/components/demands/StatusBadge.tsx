
import { Badge } from "@/components/ui/badge";
import { DemandStatus } from "@/types";

interface StatusBadgeProps {
  status: DemandStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
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
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export default StatusBadge;
