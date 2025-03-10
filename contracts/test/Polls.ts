import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
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

    // Get current timestamp
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Sample poll data
    const creatorEmail = "yusufahmed195@gmail.com";
    const creatorEmailHash = hashEmail(creatorEmail);
    const pollName = "Test Poll";
    const description = "Test Description";
    const startsAt = currentTime - 3600; // Start 1 hour ago
    const endsAt = currentTime + 3600;   // End 1 hour from now
    const candidates = ["Candidate 1", "Candidate 2"];
    const voterEmails = ["yusufahmedzia195@gmail.com", "voter2@example.com"];
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
      const votes = await polls.getPollVotesByCreator(creatorEmailHash);
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
      expect(voterPolls.hasVoted[0]).to.equal(false);

      // case vote
      await polls.vote(1, 1, voterHashes[0]);
      const voterPollsAfterVote = await polls.getPollsByVoter(voterHashes[0]);
      expect(voterPollsAfterVote.hasVoted[0]).to.equal(true);
    });

    it("Should return poll details by voter", async function () {
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

      // Get poll details before voting
      const pollBeforeVote = await polls.getPollByVoter(1, voterHashes[0]);
      expect(pollBeforeVote.name).to.equal(fixture.pollName);
      expect(pollBeforeVote.description).to.equal(fixture.description);
      expect(pollBeforeVote.startTime).to.equal(fixture.startsAt);
      expect(pollBeforeVote.endTime).to.equal(fixture.endsAt);
      expect(pollBeforeVote.hasVoted).to.equal(false);
      expect(pollBeforeVote.candidates).to.deep.equal(fixture.candidates);
      expect(pollBeforeVote.votedCandidateName).to.equal("");

      // Vote and check updated details
      await polls.vote(1, 1, voterHashes[0]);
      
      const pollAfterVote = await polls.getPollByVoter(1, voterHashes[0]);

      expect(pollAfterVote.hasVoted).to.equal(true);
      expect(pollAfterVote.votedCandidateName).to.equal(fixture.candidates[0]);
    });

    it("Should return voted candidates by voter", async function () {
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

      await polls.vote(1, 1, voterHashes[0]);

      const votedCandidates = await polls.getVotedCandidatesByVoter(voterHashes[0]);
      expect(votedCandidates).to.deep.equal([fixture.candidates[0]]);
    });

    it("Should return voter details", async function () {
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

      // Have first voter vote
      await polls.vote(1, 1, voterHashes[0]);

      const voterDetails = await polls.getVoterDetails(1);

      // Check total voters matches registered voters
      expect(voterDetails.allVoters.length).to.equal(voterHashes.length);
      expect(voterDetails.hasVoted.length).to.equal(voterHashes.length);

      // Check first voter is marked as voted
      expect(voterDetails.allVoters[0]).to.equal(voterHashes[0]);
      expect(voterDetails.hasVoted[0]).to.equal(1);

      // Check second voter is marked as not voted
      expect(voterDetails.allVoters[1]).to.equal(voterHashes[1]); 
      expect(voterDetails.hasVoted[1]).to.equal(0);
    });

    it("Should return user polls", async function () {
      const fixture = await loadFixture(deployPollsFixture);
      const { polls, voterHashes, creatorEmailHash } = fixture;

      // Create first poll
      await polls.createPoll(
        creatorEmailHash,
        fixture.pollName,
        fixture.description,
        fixture.startsAt,
        fixture.endsAt,
        fixture.candidates,
        fixture.voterHashes
      );

      // Create second poll with same creator
      await polls.createPoll(
        creatorEmailHash,
        "Second Poll",
        "Another description",
        fixture.startsAt,
        fixture.endsAt,
        fixture.candidates,
        fixture.voterHashes
      );

      // Have first voter vote on first poll
      await polls.vote(1, 1, voterHashes[0]);

      // Get user polls for creator
      const creatorPolls = await polls.getUserPolls(creatorEmailHash);
      
      // Creator should see both polls
      expect(creatorPolls.pollIds.map(id => Number(id))).to.deep.equal([1, 2]);
      expect(creatorPolls.names).to.deep.equal([fixture.pollName, "Second Poll"]);
      expect(creatorPolls.descriptions).to.deep.equal([fixture.description, "Another description"]);
      expect(creatorPolls.isCreator).to.deep.equal([true, true]);
      expect(creatorPolls.hasVoted).to.deep.equal([false, false]);

      // Voted voter should see both polls (they're registered in both)
      const votedVoterPolls = await polls.getUserPolls(voterHashes[0]);

      expect(votedVoterPolls.pollIds.map(id => Number(id))).to.deep.equal([1, 2]);
      expect(votedVoterPolls.names).to.deep.equal([fixture.pollName, "Second Poll"]);
      expect(votedVoterPolls.descriptions).to.deep.equal([fixture.description, "Another description"]);
      expect(votedVoterPolls.isCreator).to.deep.equal([false, false]);
      expect(votedVoterPolls.hasVoted).to.deep.equal([true, false]); // Voted in poll 1, not in poll 2

      // Unvoted voter should also see both polls (they're registered in both)
      const unvotedVoterPolls = await polls.getUserPolls(voterHashes[1]);

      expect(unvotedVoterPolls.pollIds.map(id => Number(id))).to.deep.equal([1, 2]);
      expect(unvotedVoterPolls.names).to.deep.equal([fixture.pollName, "Second Poll"]);
      expect(unvotedVoterPolls.descriptions).to.deep.equal([fixture.description, "Another description"]);
      expect(unvotedVoterPolls.isCreator).to.deep.equal([false, false]);
      expect(unvotedVoterPolls.hasVoted).to.deep.equal([false, false]); // Not voted in either poll
    });
  });

  describe("Poll Results", function () {
    it("Should return poll results", async function () {
      const fixture = await loadFixture(deployPollsFixture);
      const { polls } = fixture;

      const currentTime = await time.latest();
      const pollStartTime = currentTime;
      const pollEndTime = currentTime + 5000;

      // Create poll with explicit times
      await polls.createPoll(
        fixture.creatorEmailHash,
        fixture.pollName,
        fixture.description,
        pollStartTime,
        pollEndTime,
        fixture.candidates,
        fixture.voterHashes
      );

      // Vote
      await polls.vote(1, 1, fixture.voterHashes[0]);

      // Increase blockchain time to after poll end
      await time.increaseTo(pollEndTime + 1);

      // Get results
      const results = await polls.getPollResults(1);
      expect(results.candidateNames).to.deep.equal(fixture.candidates);
      expect((results.voteCounts).map(result => Number(result))).to.deep.equal([1, 0]);
    });

    it("Should return poll results by user correctly", async function () {
        const fixture = await loadFixture(deployPollsFixture);
        const { polls, creatorEmailHash, voterHashes } = fixture;

        const currentTime = await time.latest();
        const pollStartTime = currentTime;
        const pollEndTime = currentTime + 5000;

        // Create poll
        await polls.createPoll(
            creatorEmailHash,
            fixture.pollName,
            fixture.description,
            pollStartTime,
            pollEndTime,
            fixture.candidates,
            fixture.voterHashes
        );

        // Have first voter vote
        await polls.vote(1, 1, voterHashes[0]);

        // Try to get results before poll ends (should fail)
        await expect(
            polls.getPollResultsByUser(1, creatorEmailHash)
        ).to.be.revertedWith("Poll is still active");

        // Increase time to end the poll
        await time.increaseTo(pollEndTime + 1);

        // Test results for creator
        const creatorResults = await polls.getPollResultsByUser(1, creatorEmailHash);
        expect(creatorResults.name).to.equal(fixture.pollName);
        expect(creatorResults.description).to.equal(fixture.description);
        expect(creatorResults.startsAt).to.equal(pollStartTime);
        expect(creatorResults.endsAt).to.equal(pollEndTime);
        expect(creatorResults.candidates).to.deep.equal(fixture.candidates);
        expect(creatorResults.candidateVotes.map(v => Number(v))).to.deep.equal([1, 0]);
        expect(creatorResults.totalVoters).to.equal(2); // from fixture.voterHashes.length
        expect(creatorResults.totalVotes).to.equal(1);
        expect(creatorResults.isCreator).to.equal(true);
        expect(creatorResults.isVoter).to.equal(false);
        expect(creatorResults.votedCandidate).to.equal("");

        // Test results for voter who voted
        const votedVoterResults = await polls.getPollResultsByUser(1, voterHashes[0]);
        expect(votedVoterResults.isCreator).to.equal(false);
        expect(votedVoterResults.isVoter).to.equal(true);
        expect(votedVoterResults.votedCandidate).to.equal(fixture.candidates[0]);

        // Test results for voter who didn't vote
        const unvotedVoterResults = await polls.getPollResultsByUser(1, voterHashes[1]);
        expect(unvotedVoterResults.isCreator).to.equal(false);
        expect(unvotedVoterResults.isVoter).to.equal(true);
        expect(unvotedVoterResults.votedCandidate).to.equal("");

        // Test invalid poll ID
        await expect(
            polls.getPollResultsByUser(999, creatorEmailHash)
        ).to.be.revertedWith("Invalid poll ID");

        // Test unregistered user
        const unregisteredHash = hashEmail("unregistered@example.com");
        await expect(
            polls.getPollResultsByUser(1, unregisteredHash)
        ).to.be.revertedWith("User is not a creator or registered voter");
    });
  });
});
