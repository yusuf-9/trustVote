import { Card } from "@/client/common/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/client/common/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/client/common/components/ui/table";
import { Badge } from "@/client/common/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import useVoterDetails from "@/client/modules/polls/hooks/use-voter-details";

interface VoterDetailsProps {
  pollId: string;
  hasPollEnded: boolean;
}

const VoterDetails: React.FC<VoterDetailsProps> = ({ pollId, hasPollEnded }) => {
  const { voterDetails, isLoading, error } = useVoterDetails(pollId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className="p-6 max-h-[300px] overflow-y-auto" >
      <h2 className="text-lg font-semibold mb-6">Voters</h2>
        <div className="space-y-4 ">
          {voterDetails?.map((voter, i) => (
            <div
              key={i}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--main-light))] flex items-center justify-center">
                  <span className="text-sm font-medium text-[hsl(var(--main))]">
                    {voter.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span>{voter.email}</span>
              </div>
              {voter.hasVoted ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Voted
                </Badge>
              ) : hasPollEnded ? (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                  <XCircle className="w-3 h-3 mr-1" /> Not Voted
                </Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                  <Clock className="w-3 h-3 mr-1" /> Pending
                </Badge>
              )}
            </div>
          ))}
        </div>
    </Card>
  );
};

export default VoterDetails;
