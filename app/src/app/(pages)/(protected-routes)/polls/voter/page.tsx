import VoterPolls from "@/client/modules/polls/components/voter-polls";

export default function VoterPollsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Active Polls</h1>
        <p className="text-[hsl(var(--text-light))]">View and vote on active polls</p>
      </div>
      <VoterPolls />
    </div>
  );
}
