import { format } from "date-fns";
import { QUERIES } from "@/client/common/constants/queries";
import { useQuery } from "@tanstack/react-query";
import fetchPollsOfCreator from "../api";
import { Poll } from "../types";

const useCreatorPolls = (userEmail: string | null) => {
  const {
    data: polls,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERIES.CREATED_POLLS, userEmail],
    queryFn: async () => {
      const pollData = await fetchPollsOfCreator(userEmail ?? "");
      if (!pollData) return [];

      const pollIds = pollData.pollIds; // Array of poll IDs
      const names = pollData.names; // Array of poll names
      const descriptions = pollData.descriptions; // Array of poll descriptions
      const startsAt = pollData.startsAt; // Array of start times
      const endsAt = pollData.endsAt; // Array of end times

      // Map values correctly
      const formattedPolls: Poll[] = pollIds.map((_: any, index: number) => ({
        id: pollIds[index].toString(),
        title: names[index],
        description: descriptions[index],
        startTime: format(new Date(Number(startsAt[index])), "yyyy-MM-dd HH:mm:ss"),
        endTime: format(new Date(Number(endsAt[index])), "yyyy-MM-dd HH:mm:ss"),
      }));

      return formattedPolls;
    },
    retry: false,
  });

  return { polls, isLoading, error };
};

export default useCreatorPolls;
