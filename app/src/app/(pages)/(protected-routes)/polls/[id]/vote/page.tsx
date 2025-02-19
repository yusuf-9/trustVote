import VoteForm from "@/client/modules/polls/components/vote-form";

export default function VotingPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Voting</h1>
        <p className="text-[hsl(var(--text-light))]">Vote for your favorite candidate</p>
      </div>
      <VoteForm pollId={params.id} />
    </div>
  );
}
