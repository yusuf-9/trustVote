import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
      viaIR: true,
    }
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0x41eba630b4d97e561155f24fb1e2ada70a36651cddb532f1458eca843d65bcf7",
      ],
      chainId: 1337,
    },
  },
};

export default config;
