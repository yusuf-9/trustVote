import { Card } from "@/client/common/components/ui/card";
import CreatePollForm from "@/client/modules/polls/components/create-poll-form/index";

export default function CreatePollPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Create New Poll</h1>
        <p className="text-[hsl(var(--text-light))]">Set up a new voting poll</p>
      </div>

      <Card className="p-6">
        <CreatePollForm />
      </Card>
    </div>
  );
}
