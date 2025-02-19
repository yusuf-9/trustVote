import { Card } from "@/client/common/components/ui/card";
import { Poll } from "@/client/modules/polls/types";

interface PollMetadataProps {
  poll: Poll;
  userName: string;
}

const PollMetadata: React.FC<PollMetadataProps> = ({ poll, userName }) => {
  const now = Date.now();
  const hasStarted = now > poll.startTime;
  const hasEnded = now > poll.endTime;

  const getTimeRemaining = () => {
    const diff = poll.endTime - now;
    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} days`;
    if (hours > 0) return `${hours} hours`;
    return `${minutes} minutes`;
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Poll Details</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-text-light">Description</h3>
          <p className="mt-1">{poll.description}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-text-light">Created By</h3>
          <p className="mt-1">{userName}</p>
        </div>
        <div className="text-sm space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-text-light">{hasStarted ? "Started at" : "Starts at"}</span>
            <span className="text-light">
              {new Date(poll.startTime).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-text-light">{hasEnded ? "Ended at" : "Ends at"}</span>
            <span className="text-light">
              {new Date(poll.endTime).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </span>
          </div>
          {!hasEnded && (
            <div className="flex justify-between items-center text-[hsl(var(--main))]">
              <span className="font-semibold">Ends in</span>
              <span>{getTimeRemaining()}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PollMetadata;
