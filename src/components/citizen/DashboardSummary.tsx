
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Demand, DemandStatus } from "@/types";

interface DashboardSummaryProps {
  myDemands: Demand[];
  votedDemands: string[];
}

const DashboardSummary = ({ myDemands, votedDemands }: DashboardSummaryProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Demands Submitted</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{myDemands.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Approved Demands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {myDemands.filter(d => d.status === "Approved").length}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {myDemands.filter(d => ["Pending", "Reviewed", "Forwarded"].includes(d.status)).length}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{votedDemands.length}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
