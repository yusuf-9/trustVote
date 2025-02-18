import { ethers } from "ethers";
import PollsABI from "../abis/polls.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_POLLS_CONTRACT_ADDRESS ?? ""; // Replace with the actual deployed contract address

export const getPollContract = async () => {
  if (!window.ethereum) {
    throw new Error("No crypto wallet found. Please install MetaMask.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, PollsABI.abi, signer);
};
