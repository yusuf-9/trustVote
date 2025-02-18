"use client";

import { Card } from "@/client/common/components/ui/card";
import Link from "next/link";

// hooks
import useUserInfo from "@/client/modules/auth/hooks/use-user-info";
import useCreatorPolls from "@/client/modules/polls/hooks/use-creator-polls";

export default function UserPolls() {
  const { userInfo } = useUserInfo();

  const { polls, isLoading, error } = useCreatorPolls(userInfo?.email ?? "");

  const arePollsEmpty = Boolean(polls) && polls?.length === 0;

  if (isLoading) return <div>Loading...</div>;
  if (error || !polls) return <div>Error: {error?.message ?? "No polls found"}</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {arePollsEmpty && <div className="">No Polls found</div>}
      {polls.map(poll => {
        const now = Date.now();
        const hasStarted = now > poll.startTime;
        const hasEnded = now > poll.endTime;
        
        return (
          <Link href={`/polls/${poll.id}`} key={poll.id}>
            <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-[hsl(var(--main))]">
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-bold mb-3 text-[hsl(var(--main))]">{poll.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{poll.description}</p>
                
                <div className="space-y-6 mt-auto">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-text">{hasStarted ? "Started at" : "Starts at"}</span>
                      <span className="text-light">{new Date(poll.startTime).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-text">{hasEnded ? "Ended at" : "Ends at"}</span>
                      <span className="text-light">{new Date(poll.endTime).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Votes</span>
                      <span className="font-bold text-[hsl(var(--main))]">{100 + 2 * 50}</span>
                    </div>
                    <div className="h-2 bg-[hsl(var(--main-light))] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[hsl(var(--main))]"
                        style={{ width: `${60 + 2 * 5}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
