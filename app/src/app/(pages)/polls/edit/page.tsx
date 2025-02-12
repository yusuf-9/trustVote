"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/client/common/components/ui/button"
import { Input } from "@/client/common/components/ui/input"
import { Label } from "@/client/common/components/ui/label"
import { Textarea } from "@/client/common/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/client/common/components/ui/card"

export default function UpdatePollPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState(["", ""])
  const router = useRouter()

  useEffect(() => {
    // Here you would typically fetch the poll data based on the ID
    // For now, we'll just simulate it with some dummy data
    setTitle(`Example Poll ${params.id}`)
    setDescription("This is an example poll description")
    setOptions(["Option 1", "Option 2", "Option 3"])
  }, [params.id])

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
    // Here you would typically handle the poll update process
    console.log("Poll updated", { id: params.id, title, description, options })
    // Redirect to dashboard after successful poll update
    router.push("/dashboard")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Update Poll</CardTitle>
        <CardDescription>Edit the details of your poll</CardDescription>
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
          <Button type="submit">Update Poll</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

