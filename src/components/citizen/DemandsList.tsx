
import { Demand } from "@/types";
import DemandCard from "./DemandCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DemandsListProps {
  demands: Demand[];
  votedDemands?: string[];
  showVoteButtons?: boolean;
  emptyMessage: string;
  onVote?: (demandId: string) => void;
}

const DemandsList = ({ 
  demands, 
  votedDemands = [], 
  showVoteButtons = false, 
  emptyMessage,
  onVote 
}: DemandsListProps) => {
  const navigate = useNavigate();

  if (demands.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
        {emptyMessage.includes("haven't submitted") && (
          <Button 
            className="mt-4" 
            onClick={() => navigate('/citizen/submit-demand')}
          >
            Submit Your First Demand
          </Button>
        )}
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {demands.map((demand) => (
        <DemandCard 
          key={demand.id} 
          demand={demand}
          showVoteButton={showVoteButtons}
          hasVoted={votedDemands.includes(demand.id)}
          onVote={onVote}
        />
      ))}
    </div>
  );
};

export default DemandsList;
