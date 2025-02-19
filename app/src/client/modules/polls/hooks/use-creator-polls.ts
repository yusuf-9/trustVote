import { QUERIES } from "@/client/common/constants/queries";
import { useQuery } from "@tanstack/react-query";
import { fetchPollsOfCreator, fetchVotesOfCreator } from "../api";
import { Poll } from "../types";

const useCreatorPolls = (userEmail: string | null) => {
  const {
    data: polls,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERIES.CREATED_POLLS, userEmail],
    queryFn: async () => {
      if (!userEmail) return [];

      const [pollData, votesData] = await Promise.all([
        fetchPollsOfCreator(userEmail),
        fetchVotesOfCreator(userEmail),
      ]);
      if (!pollData || !votesData) return [];

      const pollIds = pollData.pollIds; // Array of poll IDs
      const names = pollData.names; // Array of poll names
      const descriptions = pollData.descriptions; // Array of poll descriptions
      const startsAt = pollData.startsAt; // Array of start times
      const endsAt = pollData.endsAt; // Array of end times

      const totalVoters = votesData.totalVoters; // Array of total voters
      const totalVotes = votesData.totalVotes; // Array of total votes

      // Map values correctly
      const formattedPolls: Poll[] = pollIds
        .map((_: any, index: number) => ({
          id: pollIds[index].toString(),
          title: names[index],
          description: descriptions[index],
          startTime: Number(startsAt[index]),
          endTime: Number(endsAt[index]),
          totalVoters: Number(totalVoters[index]),
          totalVotes: Number(totalVotes[index]),
        }))
        .sort((a, b) => Number(b.id) - Number(a.id));

      return formattedPolls;
    },
    retry: false,
  });

  return { polls, isLoading, error };
};

export default useCreatorPolls;
