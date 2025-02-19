"use client";

// hooks
import useUserInfo from "@/client/modules/auth/hooks/use-user-info";
import useCreatorPolls from "../../hooks/use-creator-polls";

// components
import PollMetadata from "./subcomponents/poll-metadata";
import PollResults from "./subcomponents/poll-results";
import VoterParticipation from "./subcomponents/voter-participation";
import VoterDetails from "./subcomponents/voter-details";
import { Card } from "@/client/common/components/ui/card";


interface UserPollDetailsProps {
  pollId: string;
}

const UserPollDetails: React.FC<UserPollDetailsProps> = ({ pollId }) => {
  const { userInfo } = useUserInfo();
  const { polls, isLoading, error } = useCreatorPolls(userInfo?.email ?? "");

  const poll = polls?.find(poll => poll.id === pollId);

  const hasPollEnded = Boolean(poll?.endTime && poll.endTime < new Date().getTime());

  if (!poll) return <div>Poll not found</div>;

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <PollMetadata
          poll={poll}
          userName={userInfo?.name ?? ""}
        />
        {hasPollEnded ? (
          <PollResults />
        ) : (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className="space-y-4">Poll has not yet ended.</div>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <VoterParticipation poll={poll} />

        <VoterDetails
          pollId={pollId}
          hasPollEnded={hasPollEnded}
        />
      </div>
    </div>
  );
};

export default UserPollDetails;
