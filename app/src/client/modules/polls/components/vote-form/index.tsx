"use client";

// hooks
import useUserInfo from "@/client/modules/auth/hooks/use-user-info";
import { Button } from "@/client/common/components/ui/button";
import { Label } from "@/client/common/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/client/common/components/ui/radio-group";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/client/common/components/ui/card";
import { useState } from "react";
import useVoterPolls from "../../hooks/use-voter-polls";
import { getPollContract } from "../../utils";
import { sanitizeEmail } from "@/common/utils";
import { ethers } from "ethers";
import { toast } from "@/client/common/hooks/use-toast";
import { QUERIES } from "@/client/common/constants/queries";
import { useQueryClient } from "@tanstack/react-query";

interface VoteFormProps {
  pollId: string;
}

const VoteForm: React.FC<VoteFormProps> = ({ pollId }) => {
  const { userInfo } = useUserInfo();
  const queryClient = useQueryClient();
  const { polls, isLoading, error } = useVoterPolls(userInfo?.email ?? "");

  const poll = polls?.find(poll => poll.id === pollId);

  const hasPollEnded = Boolean(poll?.endTime && poll.endTime < new Date().getTime());

  const [selectedOption, setSelectedOption] = useState<string>(poll?.votedCandidate ?? "candidate 1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (!userInfo || !poll) {
        return;
      }

      setIsSubmitting(true);

      // Get contract instance
      const contract = await getPollContract();

      const voterEmail = sanitizeEmail(userInfo.email); // Replace with actual user email
      const voterEmailHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(voterEmail));

      // Prepare candidates array
      const indexOfCandidate = poll?.candidates.indexOf(selectedOption);

      if (indexOfCandidate === -1) {
        toast({
          title: "Invalid candidate",
          description: "Please select a valid candidate.",
          variant: "destructive",
        });
        return;
      }

      // Create poll
      const tx = await contract.vote(pollId, indexOfCandidate + 1, voterEmailHash);

      // Wait for transaction to be mined
      await tx.wait();
      toast({
        title: "Vote submitted successfully",
        description: "Your vote has been submitted.",
        variant: "success",
      });
      // invalidate queries
      queryClient.invalidateQueries({ queryKey: [QUERIES.POLLS_AVAILABLE_FOR_VOTE, userInfo.email] });
      queryClient.invalidateQueries({ queryKey: [QUERIES.POLL_DETAILS_FOR_VOTER, pollId, userInfo.email] });
      console.log("transaction successful");
    } catch (error) {
      console.error("Error creating poll:", error);
      // You might want to show an error toast/notification here
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!poll) return <div>Poll not found</div>;

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (!poll) return <div>Poll not found</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        <CardDescription>{poll.description}</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent>
          <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
            disabled={Boolean(hasPollEnded || poll.votedCandidate || isSubmitting)}
          >
            {poll.candidates.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="bg-main text-white hover:bg-main-dark"
            disabled={Boolean(hasPollEnded || poll.votedCandidate || isSubmitting)}
          >
            {poll.votedCandidate ? "Vote Submitted" : "Submit Vote"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VoteForm;
