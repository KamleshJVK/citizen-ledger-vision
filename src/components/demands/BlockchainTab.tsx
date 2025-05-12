
import { Card } from "@/components/ui/card";
import { Transaction } from "@/types";
import TransactionViewer from "@/components/TransactionViewer";

interface BlockchainTabProps {
  transactions: Transaction[];
  demandId: string;
  demandHash: string;
}

const BlockchainTab = ({ transactions, demandId, demandHash }: BlockchainTabProps) => {
  return (
    <TransactionViewer 
      transactions={transactions} 
      demandId={demandId}
      demandHash={demandHash} 
    />
  );
};

export default BlockchainTab;
