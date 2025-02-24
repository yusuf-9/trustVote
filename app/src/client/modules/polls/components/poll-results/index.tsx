"use client";

import Link from "next/link";

import { Card } from "@/client/common/components/ui/card";

// hooks
import useUserInfo from "@/client/modules/auth/hooks/use-user-info";
import useUserPolls from "@/client/modules/polls/hooks/use-user-polls";

// utils
import { cn } from "@/client/common/utils";

// constants
import { ROUTES } from "@/client/common/config";

export default function PollResults() {
  const { userInfo } = useUserInfo();

  const { polls, isLoading, error } = useUserPolls(userInfo?.email ?? "");

  const arePollsEmpty = Boolean(polls) && polls?.length === 0;

  if (isLoading) return <div>Loading...</div>;
  if (error || !polls) return <div>Error: {error?.message ?? "No polls found"}</div>;

  if (arePollsEmpty) return <div className="">Uh oh, looks like you have not been part of any polls.</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {polls.map(poll => {
        const now = Date.now();
        const hasStarted = now > poll.startTime;
        const hasEnded = now > poll.endTime;
        const hasVoted = poll.hasVoted;
        const isCreator = poll.isCreator;

        return (
          <Link
            href={ROUTES.POLL_RESULT.DYNAMIC(poll.id)}
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

                  <div className="flex justify-start gap-2">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium border flex items-center",
                        !hasEnded
                          ? "border-[hsl(var(--main))] text-[hsl(var(--main))] bg-[hsl(var(--main))]/10"
                          : "border-gray-400 text-gray-400 bg-gray-100"
                      )}
                    >
                      {!hasEnded ? "Active" : "Ended"}
                    </span>
                    {isCreator ? (
                      <span className="px-3 py-1 rounded-full text-sm font-medium border flex items-center">
                        Creator
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium border flex items-center",
                          hasVoted
                            ? "border-green-500 text-green-500 bg-green-50" // Voted
                            : !hasStarted
                            ? "border-yellow-500 text-yellow-500 bg-yellow-50" // Pending
                            : "border-red-500 text-red-500 bg-red-50" // Not voted
                        )}
                      >
                        {hasVoted ? "Voted" : !hasStarted ? "Pending" : "Not Voted"}
                      </span>
                    )}
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
