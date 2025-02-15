// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PollsModule = buildModule("PollsModule", (m) => {
  const polls = m.contract("Polls", []);

  return { polls };
});

export default PollsModule;
