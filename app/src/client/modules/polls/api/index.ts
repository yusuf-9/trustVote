import { toUtf8Bytes } from "ethers";
import { keccak256 } from "ethers";
import { getPollContract } from "../utils";
import axiosClientInstance from "@/client/common/services/axios/client-instance";

export async function fetchPollsOfCreator(userEmail: string) {
  try {
    const contract = await getPollContract();

    // Hash the email
    const emailHash = keccak256(toUtf8Bytes(userEmail));

    // Fetch polls from the smart contract
    const pollData: {
      pollIds: string[];
      names: string[];
      descriptions: string[];
      startsAt: string[];
      endsAt: string[];
      totalVoters: string[];
      totalVotersCount: string[];
    } = await contract?.getPollsByCreator(emailHash);

    console.log({pollData});

    return pollData;
  } catch (error) {
    console.error("Error fetching polls:", error);
    throw error;
  }
}

export async function fetchVotesOfCreator(userEmail: string) {
  try {
    const contract = await getPollContract();

    // Hash the email
    const emailHash = keccak256(toUtf8Bytes(userEmail));

    // Fetch votes from the smart contract
    const votesData: {
      pollIds: string[];
      totalVoters: string[];
      totalVotes: string[];
    } = await contract?.getPollVotesByCreator(emailHash);

    console.log({ votesData });

    return votesData;
  } catch (error) {
    console.error("Error fetching votes:", error);
    throw error;
  }
}

export async function fetchVoterDetails(pollId: string) {
  try {
    const contract = await getPollContract();

    // Fetch voter details from the smart contract
    const voterDetails: {
      allVoters: `0x${string}`[]; // bytes32[] from contract
      hasVoted: number[]; // uint256[] from contract
    } = await contract?.getVoterDetails(pollId);

    console.log({voterDetails})
    
    return voterDetails;
  } catch (error) {
    console.error("Error fetching voter details:", error);
    throw error;
  }
}

export async function getVoterEmailsFromHashes(hashes: string[]) {
  try {
    const response = await axiosClientInstance.post<string[]>("/voter-emails", { hashes }, { withCredentials: true });

    return response.data.data
  } catch (error) {
    console.error("Error fetching voter emails from hashes:", error);
    throw error;
  }
}

export async function fetchPollsAvailableForVote(userEmail: string) {
  try {
    const contract = await getPollContract();

    // Hash the email
    const emailHash = keccak256(toUtf8Bytes(userEmail));

    // Fetch polls from the smart contract
    const pollData: {
      pollIds: string[];
      names: string[];
      descriptions: string[];
      startsAt: string[];
      endsAt: string[];
      hasVoted: boolean[];
    } = await contract?.getPollsByVoter(emailHash);

    console.log({pollData});

    return pollData;
  } catch (error) {
    console.error("Error fetching polls:", error);
    throw error;
  }
}

export async function fetchPollDetailsForVoter(pollId: string, userEmail: string) {
  try {
    const contract = await getPollContract();

    // Hash the email
    const emailHash = keccak256(toUtf8Bytes(userEmail));

    console.log({emailHash, pollId});

    // Fetch poll details from the smart contract
    const pollDetails: {
      name: string;
      description: string; 
      startTime: string;
      endTime: string;
      hasVoted: boolean;
      candidates: string[];
      votedCandidateName: string;
    } = await contract?.getPollByVoter(pollId, emailHash);

    console.log({pollDetails});

    return pollDetails;
  } catch (error) {
    console.error("Error fetching poll details for voter:", error);
    throw error;
  }
}
