import { toUtf8Bytes } from "ethers";
import { keccak256 } from "ethers";
import { getPollContract } from "../utils";

export default async function fetchPollsOfCreator(userEmail: string) {
  if (!userEmail) return;
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
    } = await contract?.getPollsByCreator(emailHash);

    console.log({ pollData });

    return pollData;
  } catch (error) {
    console.error("Error fetching polls:", error);
    throw error;
  }
}
