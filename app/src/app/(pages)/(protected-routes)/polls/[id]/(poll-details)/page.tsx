import UserPollDetails from "@/client/modules/polls/components/user-poll-details";

export default function PollDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Poll Details</h1>
        <p className="text-[hsl(var(--text-light))]">View your poll details below</p>
      </div>
      <UserPollDetails pollId={params.id} />
    </div>
  );
}
