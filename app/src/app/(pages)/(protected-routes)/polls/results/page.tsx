import PollResults from "@/client/modules/polls/components/poll-results";

export default function PollResultsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Poll Results</h1>
        <p className="text-[hsl(var(--text-light))]">Select a poll to view it's results</p>
      </div>
      <PollResults />
    </div>
  );
}
