"use client";

// hooks
import useUserInfo from "@/client/modules/auth/hooks/use-user-info";
import useCreatorPolls from "../../hooks/use-creator-polls";

// components
import { Card } from "@/client/common/components/ui/card";
import usePollResults from "../../hooks/use-poll-results";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface PollResultProps {
  pollId: string;
}

const PollResult: React.FC<PollResultProps> = ({ pollId }) => {
  const { userInfo } = useUserInfo();
  const { pollResults, isLoading, error } = usePollResults(pollId, userInfo?.email ?? "");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!pollResults) return <div>Poll not found</div>;

  const chartData = pollResults.candidates.map((candidate, index) => ({
    name: candidate,
    votes: pollResults.candidateVotes[index]
  }));
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-8 shadow-lg">
          <div className="border-b pb-6 mb-6">
            <h1 className="text-3xl font-bold mb-3">{pollResults.title}</h1>
            <p className="text-gray-600 text-lg">{pollResults.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Start Date</p>
              <p className="text-lg font-medium">{format(pollResults.startsAt, 'PPP')}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">End Date</p>
              <p className="text-lg font-medium">{format(pollResults.endsAt, 'PPP')}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Results</h2>
            <div className="space-y-4">
              {pollResults.candidates.map((candidate, index) => (
                <div key={candidate} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-lg">{candidate}</span>
                  <span className="text-lg font-semibold">{pollResults.candidateVotes[index]} votes</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl text-center">
            <p className="text-xl mb-2">Participation Rate</p>
            <p className="text-3xl font-bold text-blue-600">
              {pollResults.totalVotes} <span className="text-blue-400">out of</span> {pollResults.totalVoters}
            </p>
            <p className="text-blue-600 mt-1">total voters</p>
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Vote Distribution</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', padding: '12px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="votes" 
                    stroke="#4F46E5" 
                    fill="#818CF8" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {pollResults.isCreator && (
            <Card className="p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Creator Controls</h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="font-medium">Poll Status</p>
                  <p className="text-sm text-gray-600">
                    {new Date() < new Date(pollResults.startsAt) ? 'Not Started' :
                     new Date() > new Date(pollResults.endsAt) ? 'Ended' : 'Active'}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium">Voter Turnout</p>
                  <p className="text-sm text-gray-600">
                    {((Number(pollResults.totalVotes) / Number(pollResults.totalVoters)) * 100).toFixed(1)}% participation
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollResult;
