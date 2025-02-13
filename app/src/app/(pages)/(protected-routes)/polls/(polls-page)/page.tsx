import { Card } from "@/client/common/components/ui/card";

export default function PollsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Active Polls</h1>
        <p className="text-[hsl(var(--text-light))]">View and manage your current polls</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 1 }).map((_, i) => (
          <Card
            key={i}
            className="p-6"
          >
            <h3 className="text-lg font-semibold mb-2">Community Proposal #{i + 1}</h3>
            <p className="text-sm text-[hsl(var(--text-light))] mb-4">Voting ends in {3 - (i % 3)} days</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Votes</span>
                <span className="font-medium">{100 + i * 50}</span>
              </div>
              <div className="h-2 bg-[hsl(var(--main-light))] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[hsl(var(--main))]"
                  style={{ width: `${60 + i * 5}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
