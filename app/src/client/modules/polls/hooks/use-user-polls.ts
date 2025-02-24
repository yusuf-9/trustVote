import { QUERIES } from "@/client/common/constants/queries";
import { useQuery } from "@tanstack/react-query";
import { fetchUserPolls } from "../api";
import { UserPoll } from "../types";

const useUserPolls = (userEmail: string | null) => {
  const {
    data: polls,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERIES.USER_POLLS, userEmail],
    queryFn: async () => {
      if (!userEmail) return [];

      const pollData = await fetchUserPolls(userEmail);
      if (!pollData) return [];

      const pollIds = pollData.pollIds; // Array of poll IDs
      const names = pollData.names; // Array of poll names
      const descriptions = pollData.descriptions; // Array of poll descriptions
      const startsAt = pollData.startTimes; // Array of start times
      const endsAt = pollData.endTimes; // Array of end times
      const hasVoted = pollData.hasVoted; // Array of hasVoted
      const isCreator = pollData.isCreator; // Array of isCreator

      console.log({
        names
      })
      
      // Map values correctly
      const formattedPolls: UserPoll[] = pollIds
        .map((_: any, index: number) => ({
          id: pollIds[index].toString(),
          title: names[index],
          description: descriptions[index],
          startTime: Number(startsAt[index]) * 1000,
          endTime: Number(endsAt[index]) * 1000,
          hasVoted: hasVoted[index],
          isCreator: isCreator[index],
        }))
        .sort((a, b) => Number(b.id) - Number(a.id));

      console.log({ formattedPolls });

      return formattedPolls;
    },
    retry: false,
  });

  return { polls, isLoading, error };
};

export default useUserPolls;
