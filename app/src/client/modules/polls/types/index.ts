export type Poll = {
  id: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  totalVoters: number;
  totalVotes: number;
};