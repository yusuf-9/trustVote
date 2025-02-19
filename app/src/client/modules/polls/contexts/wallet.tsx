"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  PropsWithChildren,
} from "react";
import { ethers } from "ethers";
import { Button } from "@/client/common/components/ui/button";

interface WalletContextType {
  wallet: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  isConnected: false,
  connect: async () => {},
  isConnecting: false,
});

export const useWallet = () => useContext(WalletContext);

const WalletProvider = ({ children }: PropsWithChildren) => {
  const [wallet, setWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const isConnected = useMemo(() => wallet !== null, [wallet]);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error("No crypto wallet found. Please install MetaMask.");
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWallet(accounts[0]);
    } catch (err) {
      console.error("Error connecting to wallet:", err);
    }
  }, []);

  useEffect(() => {
    const checkExistingConnection = async () => {
      if (window.ethereum) {
        try {
          setIsConnecting(true);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.send("eth_accounts", []); // This gets currently connected accounts without prompting
          if (accounts.length > 0) {
            setWallet(accounts[0]);
          }
        } catch (err) {
          console.error("Error checking existing connection:", err);
        } finally {
          setIsConnecting(false);
        }
      }
    };

    checkExistingConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        } else {
          setWallet(null);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, isConnected, connect, isConnecting }}>{children}</WalletContext.Provider>
  );
};

export default WalletProvider;

export const WalletGateway = (props: PropsWithChildren) => {
  const { isConnected, connect, isConnecting } = useWallet();

  return (
    <>
      {isConnecting && (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main"></div>
          <h3 className="mt-4 text-xl text-main-dark">Connecting to wallet...</h3>
        </div>
      )}
      {!isConnected && !isConnecting && (
        <div className="flex flex-col items-center justify-center h-screen">
          <Button
            onClick={connect}
            className="bg-main hover:bg-main-dark text-white px-4 py-2 rounded font-medium text-xl"
            size={"lg"}
          >
            Connect Wallet
          </Button>
        </div>
      )}
      {isConnected && !isConnecting && props.children}
    </>
  );
};
