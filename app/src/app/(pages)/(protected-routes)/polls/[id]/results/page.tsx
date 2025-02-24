import PollResult from "@/client/modules/polls/components/poll-result";

export default function PollResultsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Results</h1>
        <p className="text-[hsl(var(--text-light))]">View the poll results</p>
      </div>
      <PollResult pollId={params.id} />
    </div>
  );
}
