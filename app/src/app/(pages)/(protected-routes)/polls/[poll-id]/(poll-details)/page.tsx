import { Card } from "@/client/common/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/client/common/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/common/components/ui/table";
import { Badge } from "@/client/common/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

export default function PollDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          Community Proposal #{params.id}
        </h1>
        <p className="text-[hsl(var(--text-light))]">
          Detailed poll information and results
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Poll Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-[hsl(var(--text-light))]">Description</h3>
                <p className="mt-1">
                  Should we implement a new reward system for active community members?
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[hsl(var(--text-light))]">Duration</h3>
                <p className="mt-1">7 days (Ends in 3 days)</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[hsl(var(--text-light))]">Created By</h3>
                <p className="mt-1">John Doe</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Results</h2>
            <div className="space-y-4">
              {["Yes", "No", "Abstain"].map((option, i) => (
                <div key={i} className="space-y-2">
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
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[hsl(var(--text-light))]">Total Voters</span>
                <span className="font-medium">150</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[hsl(var(--text-light))]">Votes Cast</span>
                <span className="font-medium">120</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[hsl(var(--text-light))]">Participation</span>
                <span className="font-medium">80%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <Tabs defaultValue="voters">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="voters" className="flex-1">Voters</TabsTrigger>
                <TabsTrigger value="votes" className="flex-1">Votes</TabsTrigger>
              </TabsList>
              <TabsContent value="voters">
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[hsl(var(--main-light))] flex items-center justify-center">
                          <span className="text-sm font-medium text-[hsl(var(--main))]">
                            {String.fromCharCode(65 + i)}
                          </span>
                        </div>
                        <span>Voter {i + 1}</span>
                      </div>
                      {i % 2 === 0 ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Voted
                        </Badge>
                      ) : i % 3 === 0 ? (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                          <XCircle className="w-3 h-3 mr-1" /> Not Voted
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                          <Clock className="w-3 h-3 mr-1" /> Pending
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="votes">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Voter</TableHead>
                      <TableHead>Vote</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>Voter {i + 1}</TableCell>
                        <TableCell>{["Yes", "No", "Abstain"][i % 3]}</TableCell>
                        <TableCell className="text-[hsl(var(--text-light))]">
                          {i} hours ago
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}