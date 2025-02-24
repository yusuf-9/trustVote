import { QUERIES } from "@/client/common/constants/queries";
import { useQuery } from "@tanstack/react-query";
import { fetchPollDetailsForVoter } from "../api";
import { VoterPollDetails } from "../types";

const useVoterPoll = (pollId: string, userEmail: string | null) => {
  const {
    data: poll,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERIES.POLL_DETAILS_FOR_VOTER, pollId, userEmail],
    queryFn: async () => {
      console.log({userEmail, pollId});
      if (!userEmail || !pollId) return null;

      const pollDetails = await fetchPollDetailsForVoter(pollId, userEmail);

      // Map values correctly
      const formattedPoll: VoterPollDetails = {
        id: pollId,
        title: pollDetails.name,
        description: pollDetails.description,
        startTime: Number(pollDetails.startTime) * 1000,
        endTime: Number(pollDetails.endTime) * 1000,
        hasVoted: pollDetails.hasVoted,
        candidates: pollDetails.candidates,
        votedCandidate: pollDetails.votedCandidateName,
      };

      console.log({formattedPoll});

      return formattedPoll;
    },
    retry: false,
  });

  return { poll, isLoading, error };
};

export default useVoterPoll;
