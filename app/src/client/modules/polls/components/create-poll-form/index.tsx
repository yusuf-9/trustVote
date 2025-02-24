"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { Trash2, Plus } from "lucide-react";
import { format } from "date-fns";

// components
import { Button } from "@/client/common/components/ui/button";
import { Input } from "@/client/common/components/ui/input";
import { Label } from "@/client/common/components/ui/label";
import { Textarea } from "@/client/common/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/client/common/components/ui/form";
import { Calendar } from "@/client/common/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/client/common/components/ui/popover";

// utils
import { cn } from "@/client/common/utils";

// hooks
import useCreatePoll from "./hooks/use-create-poll";

export default function CreatePollForm() {
  const {
    form,
    isSubmitting,
    candidateFields,
    voterFields,
    appendCandidate,
    removeCandidate,
    appendVoter,
    removeVoter,
    onSubmit,
    isLoading,
  } = useCreatePoll();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
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
                        {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                  >
                    <div className="p-4">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="mt-4">
                        <Input
                          type="time"
                          step="60"
                          value={field.value ? format(field.value, "HH:mm") : ""}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':');
                            const newDate = new Date(field.value || new Date());
                            newDate.setHours(parseInt(hours), parseInt(minutes));
                            field.onChange(newDate);
                          }}
                        />
                      </div>
                    </div>
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
                        {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                  >
                    <div className="p-4">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="mt-4">
                        <Input
                          type="time"
                          step="60"
                          value={field.value ? format(field.value, "HH:mm") : ""}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':');
                            const newDate = new Date(field.value || new Date());
                            newDate.setHours(parseInt(hours), parseInt(minutes));
                            field.onChange(newDate);
                          }}
                        />
                      </div>
                    </div>
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
              onClick={() => appendCandidate({ name: "" })}
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
                <FormField
                  control={form.control}
                  name={`candidates.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Poll..." : "Create Poll"}
        </Button>
      </form>
    </Form>
  );
}
