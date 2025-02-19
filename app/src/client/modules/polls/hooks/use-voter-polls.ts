import { QUERIES } from "@/client/common/constants/queries";
import { useQuery } from "@tanstack/react-query";
import { fetchPollsAvailableForVote } from "../api";
import { VoterPoll } from "../types";

const useVoterPolls = (userEmail: string | null) => {
  const {
    data: polls,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERIES.POLLS_AVAILABLE_FOR_VOTE, userEmail],
    queryFn: async () => {
      if (!userEmail) return [];

      const pollData = await fetchPollsAvailableForVote(userEmail);
      if (!pollData) return [];

      const pollIds = pollData.pollIds; // Array of poll IDs
      const names = pollData.names; // Array of poll names
      const descriptions = pollData.descriptions; // Array of poll descriptions
      const startsAt = pollData.startsAt; // Array of start times
      const endsAt = pollData.endsAt; // Array of end times
      const hasVoted = pollData.hasVoted; // Array of hasVoted

      // Map values correctly
      const formattedPolls: VoterPoll[] = pollIds
        .map((_: any, index: number) => ({
          id: pollIds[index].toString(),
          title: names[index],
          description: descriptions[index],
          startTime: Number(startsAt[index]),
          endTime: Number(endsAt[index]),
          hasVoted: hasVoted[index],
        }))
        .sort((a, b) => Number(b.id) - Number(a.id));

      return formattedPolls;
    },
    retry: false,
  });

  return { polls, isLoading, error };
};

export default useVoterPolls;
