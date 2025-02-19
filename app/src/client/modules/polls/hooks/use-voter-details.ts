import { QUERIES } from "@/client/common/constants/queries";
import { useQuery } from "@tanstack/react-query";
import { fetchVoterDetails, getVoterEmailsFromHashes } from "../api";

const useVoterDetails = (pollId: string) => {
  const {
    data: voterDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERIES.VOTER_DETAILS, pollId],
    queryFn: async () => {
      const voterDetails = await fetchVoterDetails(pollId);
      const emails = await getVoterEmailsFromHashes(voterDetails.allVoters as string[]);

      const voterDetailsWithEmails = voterDetails.allVoters.map((voter, index) => {
        return {
          voter: voter as string,
          email: emails[index] || "",
          hasVoted: Boolean(Number(voterDetails.hasVoted[index])),
        };
      });

      return voterDetailsWithEmails;
    },
  });

  return { voterDetails, isLoading, error };
};

export default useVoterDetails;
