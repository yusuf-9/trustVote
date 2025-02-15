import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
import { keccak256, toUtf8Bytes } from "ethers";

describe("Polls", function () {
  // Helper function to hash email addresses
  function hashEmail(email: string): string {
    return keccak256(toUtf8Bytes(email));
  }

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployPollsFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Polls = await hre.ethers.getContractFactory("Polls");
    const polls = await Polls.deploy();

    // Sample poll data
    const creatorEmail = "creator@example.com";
    const creatorEmailHash = hashEmail(creatorEmail);
    const pollName = "Test Poll";
    const description = "Test Description";
    const startsAt = 1739145600; // Current time
    const endsAt = 1740009600; // 1 hour from now
    const candidates = ["Candidate 1", "Candidate 2"];
    const voterEmails = ["voter1@example.com", "voter2@example.com"];
    const voterHashes = voterEmails.map(hashEmail);

    return {
      polls,
      owner,
      otherAccount,
      creatorEmailHash,
      pollName,
      description,
      startsAt,
      endsAt,
      candidates,
      voterHashes,
    };
  }

  describe("Poll Creation", function () {
    it("Should create a poll with correct parameters", async function () {
      const { polls, creatorEmailHash, pollName, description, startsAt, endsAt, candidates, voterHashes } =
        await loadFixture(deployPollsFixture);

      await polls.createPoll(creatorEmailHash, pollName, description, startsAt, endsAt, candidates, voterHashes);

      const pollData = await polls.getPoll(1);
      expect(pollData.name).to.equal(pollName);
      expect(pollData.description).to.equal(description);
      expect(pollData.startsAt).to.equal(startsAt);
      expect(pollData.endsAt).to.equal(endsAt);
      expect(pollData.candidates).to.deep.equal(candidates);
    });

    it("Should fail if end time is before start time", async function () {
      const { polls, creatorEmailHash, pollName, description, endsAt, candidates, voterHashes } = await loadFixture(
        deployPollsFixture
      );

      await expect(
        polls.createPoll(
          creatorEmailHash,
          pollName,
          description,
          endsAt, // Using end time as start time
          endsAt - 1000, // End time before start time
          candidates,
          voterHashes
        )
      ).to.be.revertedWith("Start time must be before end time");
    });
  });

  describe("Voting", function () {
    it("Should allow registered voter to vote", async function () {
      const fixture = await loadFixture(deployPollsFixture);
      const { polls, voterHashes } = fixture;

      // Create poll
      await polls.createPoll(
        fixture.creatorEmailHash,
        fixture.pollName,
        fixture.description,
        fixture.startsAt,
        fixture.endsAt,
        fixture.candidates,
        fixture.voterHashes
      );

      // Vote
      await polls.vote(1, 1, voterHashes[0]);

      // Verify vote (would need additional getter function to verify vote count)
      await expect(polls.vote(1, 1, voterHashes[0])).to.be.revertedWith("Already voted");
    });

    it("Should not allow unregistered voter to vote", async function () {
      const fixture = await loadFixture(deployPollsFixture);
      const { polls } = fixture;

      // Create poll
      await polls.createPoll(
        fixture.creatorEmailHash,
        fixture.pollName,
        fixture.description,
        fixture.startsAt,
        fixture.endsAt,
        fixture.candidates,
        fixture.voterHashes
      );

      const unregisteredVoterHash = hashEmail("unregistered@example.com");
      await expect(polls.vote(1, 1, unregisteredVoterHash)).to.be.revertedWith("Not a registered voter");
    });
  });

  describe("Poll Queries", function () {
    it("Should return polls by creator", async function () {
      const fixture = await loadFixture(deployPollsFixture);
      const { polls, creatorEmailHash } = fixture;

      // Create poll
      await polls.createPoll(
        fixture.creatorEmailHash,
        fixture.pollName,
        fixture.description,
        fixture.startsAt,
        fixture.endsAt,
        fixture.candidates,
        fixture.voterHashes
      );

      const creatorPolls = await polls.getPollsByCreator(creatorEmailHash);
      expect(creatorPolls.pollIds.length).to.equal(1);
      expect(creatorPolls.names[0]).to.equal(fixture.pollName);
    });

    it("Should return polls by voter", async function () {
      const fixture = await loadFixture(deployPollsFixture);
      const { polls, voterHashes } = fixture;

      // Create poll
      await polls.createPoll(
        fixture.creatorEmailHash,
        fixture.pollName,
        fixture.description,
        fixture.startsAt,
        fixture.endsAt,
        fixture.candidates,
        fixture.voterHashes
      );

      const voterPolls = await polls.getPollsByVoter(voterHashes[0]);
      expect(voterPolls.pollIds.length).to.equal(1);
      expect(voterPolls.names[0]).to.equal(fixture.pollName);
    });
  });
});
