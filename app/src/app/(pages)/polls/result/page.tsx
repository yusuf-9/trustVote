"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/client/common/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/client/common/components/ui/card"
import { Progress } from "@/client/common/components/ui/progress"

interface PollResult {
  option: string
  votes: number
}

export default function PollResultsPage({ params }: { params: { id: string } }) {
  const [pollTitle, setPollTitle] = useState("")
  const [pollDescription, setPollDescription] = useState("")
  const [results, setResults] = useState<PollResult[]>([])
  const router = useRouter()

  useEffect(() => {
    // Here you would typically fetch the poll results based on the ID
    // For now, we'll just simulate it with some dummy data
    setPollTitle(`Example Poll ${params.id}`)
    setPollDescription("This is an example poll description")
    setResults([
      { option: "Option 1", votes: 10 },
      { option: "Option 2", votes: 15 },
      { option: "Option 3", votes: 5 },
    ])
  }, [params.id])

  const totalVotes = results.reduce((sum, result) => sum + result.votes, 0)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{pollTitle} - Results</CardTitle>
        <CardDescription>{pollDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {results.map((result, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between mb-1">
              <span>{result.option}</span>
              <span>
                {result.votes} votes ({((result.votes / totalVotes) * 100).toFixed(2)}%)
              </span>
            </div>
            <Progress value={(result.votes / totalVotes) * 100} />
          </div>
        ))}
        <p className="mt-4">Total votes: {totalVotes}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </CardFooter>
    </Card>
  )
}

