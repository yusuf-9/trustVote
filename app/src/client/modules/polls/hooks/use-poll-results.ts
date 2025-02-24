import { QUERIES } from "@/client/common/constants/queries";
import { useQuery } from "@tanstack/react-query";
import { fetchPollResultsByUser } from "../api";

interface PollResults {
  id: number;
  title: string;
  description: string;
  startsAt: number;
  endsAt: number;
  candidates: string[];
  candidateVotes: number[];
  totalVoters: number;
  totalVotes: number;
  isCreator: boolean;
  isVoter: boolean;
  votedCandidate: string;
}

const usePollResults = (pollId: string, userEmail: string | null) => {
  const {
    data: pollResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERIES.POLL_RESULTS, pollId, userEmail],
    queryFn: async () => {
      if (!userEmail || !pollId) return null;

      const results = await fetchPollResultsByUser(Number(pollId), userEmail);

      // Map values correctly
      const formattedResults: PollResults = {
        id: Number(pollId),
        title: results.name,
        description: results.description,
        startsAt: Number(results.startsAt) * 1000,
        endsAt: Number(results.endsAt) * 1000,
        candidates: results.candidates,
        candidateVotes: results.candidateVotes.map(votes => Number(votes)),
        totalVoters: Number(results.totalVoters),
        totalVotes: Number(results.totalVotes),
        isCreator: results.isCreator,
        isVoter: results.isVoter,
        votedCandidate: results.votedCandidate,
      };

      console.log({formattedResults})

      return formattedResults;
    }
  });

  return { pollResults, isLoading, error };
};

export default usePollResults;
