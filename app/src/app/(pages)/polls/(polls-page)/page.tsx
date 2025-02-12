"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

interface Poll {
  id: string
  title: string
  description: string
  endDate: string
}

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])

  useEffect(() => {
    // Here you would typically fetch the active polls from your API or blockchain
    // For now, we'll just simulate it with some dummy data
    setPolls([
      {
        id: "1",
        title: "Community Garden Project",
        description: "Vote on the location for our new community garden",
        endDate: "2025-06-30",
      },
      {
        id: "2",
        title: "Annual Budget Allocation",
        description: "Decide on the budget distribution for the upcoming fiscal year",
        endDate: "2025-07-15",
      },
      {
        id: "3",
        title: "New Recycling Initiative",
        description: "Choose the best approach for our city's new recycling program",
        endDate: "2025-08-01",
      },
    ])
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Active Polls</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <Card key={poll.id}>
            <CardHeader>
              <CardTitle>{poll.title}</CardTitle>
              <CardDescription>{poll.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Ends on: {poll.endDate}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/polls/${poll.id}/vote`} passHref>
                <Button>Vote Now</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

