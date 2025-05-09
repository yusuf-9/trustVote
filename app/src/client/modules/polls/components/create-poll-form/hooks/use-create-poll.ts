import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { getPollContract } from "@/client/modules/polls/utils";
import { ethers } from "ethers";
import { useState } from "react";
import { toast } from "@/client/common/hooks/use-toast";
import useUserInfo from "@/client/modules/auth/hooks/use-user-info";
import { QUERIES } from "@/client/common/constants/queries";
import { useQueryClient } from "@tanstack/react-query";
import axiosClientInstance from "@/client/common/services/axios/client-instance";
import { retryPromiseIfFails } from "@/client/common/utils";
import { sanitizeEmail } from "@/common/utils";

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
      }),
    candidates: z
      .array(
        z.object({
          name: z.string().min(1, "Candidate name is required"),
        })
      )
      .min(1, "At least one candidate is required"),
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

type FormSchema = z.infer<typeof formSchema>;

export default function useCreatePoll() {
  const { userInfo, isLoading } = useUserInfo();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      candidates: [],
      voters: [],
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

  async function onSubmit(values: FormSchema) {
    try {
      if (!userInfo) {
        return;
      }

      setIsSubmitting(true);

      // Get contract instance
      const contract = await getPollContract();

      // Convert dates to Unix timestamps
      const startsAt = values.startDate.getTime() / 1000;
      const endsAt = values.endDate.getTime() / 1000;

      // Hash creator email (you'll need to get this from your auth system)
      const creatorEmail = sanitizeEmail(userInfo.email); // Replace with actual user email
      const creatorEmailHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(creatorEmail));

      // Prepare candidates array
      const candidates = values.candidates.map(c => c.name);

      // Hash voter emails
      const voterHashes = values.voters.map(v => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(sanitizeEmail(v.email))));


      // Create poll
      const tx = await contract.createPoll(
        creatorEmailHash,
        values.title,
        values.description,
        startsAt,
        endsAt,
        candidates,
        voterHashes
      );

      // Wait for transaction to be mined
      await tx.wait();
      toast({
        title: "Poll created successfully",
        description: "Your poll has been created and is now live.",
        variant: "success",
      });
      // invalidate queries
      queryClient.invalidateQueries({ queryKey: [QUERIES.CREATED_POLLS, userInfo.email] });
      console.log("transaction successful");
      storeVoterEmailHashesInDb(values.voters.map(v => v.email));
    } catch (error) {
      console.error("Error creating poll:", error);
      // You might want to show an error toast/notification here
    } finally {
      setIsSubmitting(false);
    }
  }

  const storeVoterEmailHashesInDb = async (voterEmails: string[]) => {
    try {
      await retryPromiseIfFails(async () => {
        await axiosClientInstance.post("/email-hash", { emails: voterEmails }, { withCredentials: true });
      });
    } catch (error) {
      console.error("Error storing hashes in db:", error);
    }
  };

  return {
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
  };
}
