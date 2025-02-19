"use client";

import Link from "next/link";

import { Card } from "@/client/common/components/ui/card";
import { Button } from "@/client/common/components/ui/button";

// hooks
import useUserInfo from "@/client/modules/auth/hooks/use-user-info";
import useVoterPolls from "@/client/modules/polls/hooks/use-voter-polls";

export default function VoterPolls() {
  const { userInfo } = useUserInfo();

  const { polls, isLoading, error } = useVoterPolls(userInfo?.email ?? "");

  const arePollsEmpty = Boolean(polls) && polls?.length === 0;

  if (isLoading) return <div>Loading...</div>;
  if (error || !polls) return <div>Error: {error?.message ?? "No polls found"}</div>;

  if (arePollsEmpty) return <div className="">Uh oh, looks like you have no active polls to vote on.</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {polls.map(poll => {
        const now = Date.now();
        const hasStarted = now > poll.startTime;
        const hasEnded = now > poll.endTime;

        return (
          <Link
            href={`/polls/${poll.id}/vote`}
            key={poll.id}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-[hsl(var(--main))]">
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-bold mb-3 text-[hsl(var(--main))]">{poll.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{poll.description}</p>

                <div className="space-y-6 mt-auto">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-text">{hasStarted ? "Started at" : "Starts at"}</span>
                      <span className="text-light">
                        {new Date(poll.startTime).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-text">{hasEnded ? "Ended at" : "Ends at"}</span>
                      <span className="text-light">
                        {new Date(poll.endTime).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 flex justify-end">
                    <Button className="bg-[hsl(var(--main))] text-white hover:bg-[hsl(var(--main-dark))]">Vote</Button>
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
