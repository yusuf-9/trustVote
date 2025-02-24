export type Poll = {
  id: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  totalVoters: number;
  totalVotes: number;
};

export type VoterPoll = {
  id: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  hasVoted: boolean;
  candidates: string[];
  votedCandidate: string
};

export type VoterPollDetails = {
  id: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  hasVoted: boolean;
  candidates: string[];
  votedCandidate: string;
};

export type UserPoll = {
  id: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  hasVoted: boolean;
  isCreator: boolean;
}