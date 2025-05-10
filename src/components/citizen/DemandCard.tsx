
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { Demand, DemandStatus } from "@/types";

interface DemandCardProps {
  demand: Demand;
  showVoteButton?: boolean;
  hasVoted?: boolean;
  onVote?: (demandId: string) => void;
}

const DemandCard = ({ demand, showVoteButton = false, hasVoted = false, onVote }: DemandCardProps) => {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{demand.title}</CardTitle>
          {getStatusBadge(demand.status)}
        </div>
        <CardDescription>{demand.categoryName}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-gray-600">
          {demand.description}
        </p>
        <div className="mt-2 text-xs text-gray-500">
          {showVoteButton ? (
            <>
              <div>Proposed by: {demand.proposerName}</div>
              <div>Submitted: {new Date(demand.submissionDate).toLocaleDateString()}</div>
              <div>Current Votes: {demand.voteCount}</div>
            </>
          ) : (
            <>
              <div>Submitted: {new Date(demand.submissionDate).toLocaleDateString()}</div>
              <div>Votes: {demand.voteCount}</div>
              
              {demand.mlaId && (
                <div className="mt-1">Reviewed by: {demand.mlaName}</div>
              )}
              
              {demand.officerId && (
                <div>Processed by: {demand.officerName}</div>
              )}
              
              {demand.approvalDate && (
                <div>Approved: {new Date(demand.approvalDate).toLocaleDateString()}</div>
              )}
              
              {demand.rejectionDate && (
                <div>Rejected: {new Date(demand.rejectionDate).toLocaleDateString()}</div>
              )}
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className={showVoteButton ? "flex flex-col space-y-2" : ""}>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full"
          onClick={() => navigate(`/citizen/demand/${demand.id}`)}
        >
          <FileText className="mr-2 h-4 w-4" />
          View Details
        </Button>
        {showVoteButton && (
          <Button 
            className="w-full"
            disabled={hasVoted}
            onClick={() => onVote && onVote(demand.id)}
          >
            {hasVoted ? "Voted" : "Vote"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DemandCard;
