import { Card } from "@/client/common/components/ui/card";

const PollResults = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Results</h2>
      <div className="space-y-4">
        {["Yes", "No", "Abstain"].map((option, i) => (
          <div
            key={i}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span>{option}</span>
              <span className="font-medium">{40 - i * 10}%</span>
            </div>
            <div className="h-2 bg-[hsl(var(--main-light))] rounded-full overflow-hidden">
              <div
                className="h-full bg-[hsl(var(--main))]"
                style={{ width: `${40 - i * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PollResults;
