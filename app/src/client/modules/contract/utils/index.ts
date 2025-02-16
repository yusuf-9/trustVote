import { ethers } from "ethers";
import PollsABI from "@/common/contract-abis/polls.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with the actual deployed contract address

export const getPollContract = async () => {
    if (!window.ethereum) {
        throw new Error("No crypto wallet found. Please install MetaMask.");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Check if the correct network is selected
    const network = await provider.getNetwork();
    if (network.chainId !== 1337) {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x539" }], // 1337 in hex
        });
    }

    return new ethers.Contract(CONTRACT_ADDRESS, PollsABI.abi, signer);
};
