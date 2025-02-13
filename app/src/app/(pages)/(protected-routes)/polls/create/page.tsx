"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/client/common/components/ui/button"
import { Input } from "@/client/common/components/ui/input"
import { Label } from "@/client/common/components/ui/label"
import { Textarea } from "@/client/common/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/client/common/components/ui/card"

export default function CreatePollPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState(["", ""])
  const router = useRouter()

  const handleAddOption = () => {
    setOptions([...options, ""])
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the poll creation process
    console.log("Poll created", { title, description, options })
    // Redirect to dashboard after successful poll creation
    router.push("/dashboard")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
        <CardDescription>Set up a new voting poll</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Poll Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Options</Label>
              {options.map((option, index) => (
                <Input
                  key={index}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
              ))}
              <Button type="button" onClick={handleAddOption} variant="outline">
                Add Option
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button type="submit">Create Poll</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

