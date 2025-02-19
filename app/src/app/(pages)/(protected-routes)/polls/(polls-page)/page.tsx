import UserPolls from "@/client/modules/polls/components/user-polls";

export default function PollsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Active Polls</h1>
        <p className="text-[hsl(var(--text-light))]">View and manage your current polls</p>
      </div>
      <UserPolls />
    </div>
  );
}
