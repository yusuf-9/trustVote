"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Card } from "@/client/common/components/ui/card";
import { Button } from "@/client/common/components/ui/button";
import { Input } from "@/client/common/components/ui/input";
import { Label } from "@/client/common/components/ui/label";
import { Textarea } from "@/client/common/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/client/common/components/ui/form";
import { Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/client/common/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/client/common/components/ui/popover";
import { cn } from "@/client/common/utils";

const formSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z
      .date({
        required_error: "End date is required",
      })
      .refine(date => date > new Date(), {
        message: "End date must be in the future",
      }),
    candidates: z
      .array(
        z.object({
          name: z.string().min(1, "Candidate name is required"),
          description: z.string().optional(),
        })
      )
      .min(2, "At least two candidates are required"),
    voters: z
      .array(
        z.object({
          email: z.string().email("Invalid email address"),
        })
      )
      .min(1, "At least one voter is required"),
  })
  .refine(data => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export default function CreatePollPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidates: [{ name: "", description: "" }],
      voters: [{ email: "" }],
    },
  });

  const {
    fields: candidateFields,
    append: appendCandidate,
    remove: removeCandidate,
  } = useFieldArray({
    control: form.control,
    name: "candidates",
  });

  const {
    fields: voterFields,
    append: appendVoter,
    remove: removeVoter,
  } = useFieldArray({
    control: form.control,
    name: "voters",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // TODO: Handle form submission
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Create New Poll</h1>
        <p className="text-[hsl(var(--text-light))]">Set up a new voting poll</p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poll Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter poll title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this poll is about"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Candidates</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendCandidate({ name: "", description: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Candidate
                </Button>
              </div>
              <div className="space-y-4">
                {candidateFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-4"
                  >
                    <div className="flex-1 space-y-2">
                      <FormField
                        control={form.control}
                        name={`candidates.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Candidate name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`candidates.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Optional description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {candidateFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="self-center"
                        onClick={() => removeCandidate(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Voters</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendVoter({ email: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Voter
                </Button>
              </div>
              <div className="space-y-4">
                {voterFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-4"
                  >
                    <FormField
                      control={form.control}
                      name={`voters.${index}.email`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Voter email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {voterFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVoter(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[hsl(var(--main))] hover:bg-[hsl(var(--main-dark))]"
            >
              Create Poll
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
