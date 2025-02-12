import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Manage Polls</CardTitle>
          <CardDescription>Create and update voting polls</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/polls/create">
            <Button className="w-full">Create New Poll</Button>
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Cast Votes</CardTitle>
          <CardDescription>Participate in active polls</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/polls">
            <Button className="w-full">View Active Polls</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

