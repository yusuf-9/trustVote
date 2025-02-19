import { Card } from "@/client/common/components/ui/card";
import { Poll } from "@/client/modules/polls/types";

interface VoterParticipationProps {
  poll: Poll;
}

const VoterParticipation: React.FC<VoterParticipationProps> = ({ poll }) => {
  const totalVoters = poll.totalVoters;
  const votesCast = poll.totalVotes;
  const participationRate = Math.round((votesCast / totalVoters) * 100);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Statistics</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[hsl(var(--text-light))]">Total Voters</span>
          <span className="font-medium">{totalVoters}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[hsl(var(--text-light))]">Votes Cast</span>
          <span className="font-medium">{votesCast}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[hsl(var(--text-light))]">Participation</span>
          <span className="font-medium">{participationRate}%</span>
        </div>
      </div>
    </Card>
  );
};

export default VoterParticipation;
