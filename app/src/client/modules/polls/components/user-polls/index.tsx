"use client"

import { Card } from "@/client/common/components/ui/card";

// hooks
import useUserInfo from "@/client/modules/auth/hooks/use-user-info";
import useCreatorPolls from "@/client/modules/polls/hooks/use-creator-polls";

export default function UserPolls() {
  const { userInfo } = useUserInfo();

  const { polls, isLoading, error } = useCreatorPolls(userInfo?.email ?? '');

  if (isLoading) return <div>Loading...</div>;
  if (error || !polls) return <div>Error: {error?.message ?? "No polls found"}</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => (
        <Card
          key={poll.id}
          className="p-6"
        >
          <h3 className="text-lg font-semibold mb-2">{poll.title}</h3>
          <p className="text-sm text-[hsl(var(--text-light))] mb-4">{poll.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Votes</span>
              <span className="font-medium">{100 + 2 * 50}</span>
            </div>
            <div className="h-2 bg-[hsl(var(--main-light))] rounded-full overflow-hidden">
              <div
                className="h-full bg-[hsl(var(--main))]"
                style={{ width: `${60 + 2 * 5}%` }}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
