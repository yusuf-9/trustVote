"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/client/common/components/ui/button"
import { Label } from "@/client/common/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/client/common/components/ui/radio-group"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/client/common/components/ui/card"

export default function VotePage({ params }: { params: { id: string } }) {
  const [pollTitle, setPollTitle] = useState("")
  const [pollDescription, setPollDescription] = useState("")
  const [options, setOptions] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Here you would typically fetch the poll data based on the ID
    // For now, we'll just simulate it with some dummy data
    setPollTitle(`Example Poll ${params.id}`)
    setPollDescription("This is an example poll description")
    setOptions(["Option 1", "Option 2", "Option 3"])
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the voting process
    console.log("Vote submitted", { pollId: params.id, selectedOption })
    // Redirect to results page after successful vote
    router.push(`/polls/${params.id}/results`)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{pollTitle}</CardTitle>
        <CardDescription>{pollDescription}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!selectedOption}>
            Submit Vote
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

