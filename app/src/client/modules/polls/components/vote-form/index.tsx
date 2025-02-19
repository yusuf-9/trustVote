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
interface VoteFormProps {
  pollId: string;
}

const VoteForm: React.FC<VoteFormProps> = ({ pollId }) => {
  const { userInfo } = useUserInfo();

  const { polls, isLoading, error } = useVoterPolls(userInfo?.email ?? "");

  const poll = polls?.find(poll => poll.id === pollId);

  const hasPollEnded = Boolean(poll?.endTime && poll.endTime < new Date().getTime());

  const [selectedOption, setSelectedOption] = useState<string>(poll?.votedCandidate ?? "candidate 1");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(selectedOption);
  };

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
      <form onSubmit={handleSubmit}>
        <CardContent>
          <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
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
            disabled={Boolean(hasPollEnded || poll.votedCandidate)}
          >
            {hasPollEnded ? "Vote Submitted" : "Submit Vote"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VoteForm;
