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
import useVoterPoll from "../../hooks/use-voter-poll";
import { useState } from "react";
interface VoteFormProps {
  pollId: string;
}

const VoteForm: React.FC<VoteFormProps> = ({ pollId }) => {
  const { userInfo } = useUserInfo();

  const { poll, isLoading, error } = useVoterPoll(pollId, userInfo?.email ?? '');

  const hasPollEnded = Boolean(poll?.endTime && poll.endTime < new Date().getTime());

  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(selectedOption);
  };

  console.log({poll});

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (!poll) return <div>Poll not found</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        <CardDescription>{poll.description}</CardDescription>
      </CardHeader>
      {/* <form onSubmit={handleSubmit}>
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
            disabled={!selectedOption}
          >
            Submit Vote
          </Button>
        </CardFooter>
      </form> */}
    </Card>
  );
};

export default VoteForm;
