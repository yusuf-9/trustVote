// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Polls {
    struct PollCandidate {
        string name;
        uint256 voteCount;
    }

    struct Poll {
        // Creator
        address creator;
        bytes32 creatorEmailHash;
        // Poll metadata
        string name;
        string description;
        uint256 startsAt;
        uint256 endsAt;
        // Poll candidates/items
        mapping(uint256 => PollCandidate) candidates;
        uint256 candidateCount;
        // Voters list
        mapping(uint256 => bytes32) registeredVoterEmailHashes; // Indexed email hashes
        uint256 voterCount;
        uint256 totalVotes;
        mapping(bytes32 => uint256) voterChoices; // Tracks voter choices

        mapping(bytes32 => bool) hasVoted; // Tracks if email has voted
    }

    mapping(uint256 => Poll) public polls;
    uint256 public pollCount;

    function createPoll(
        bytes32 _creatorEmailHash,
        string memory _name,
        string memory _description,
        uint256 _startsAt,
        uint256 _endsAt,
        string[] memory _candidates,
        bytes32[] memory _voterHashes
    ) public {
        require(_startsAt < _endsAt, "Start time must be before end time");
        require(_candidates.length > 0, "At least one candidate is required");
        require(_voterHashes.length > 0, "At least one voter is required");

        pollCount++;
        Poll storage newPoll = polls[pollCount];

        newPoll.creator = msg.sender;
        newPoll.name = _name;
        newPoll.description = _description;
        newPoll.startsAt = _startsAt;
        newPoll.endsAt = _endsAt;
        newPoll.creatorEmailHash = _creatorEmailHash;

        // Store candidates in mapping, starting from index 1
        for (uint256 i = 0; i < _candidates.length; i++) {
            newPoll.candidates[i + 1] = PollCandidate(_candidates[i], 0);
        }
        newPoll.candidateCount = _candidates.length;

        // Store registered voters in mapping, starting from index 1
        for (uint256 i = 0; i < _voterHashes.length; i++) {
            newPoll.registeredVoterEmailHashes[i + 1] = _voterHashes[i];
        }
        newPoll.voterCount = _voterHashes.length;
    }

    function vote(
        uint256 _pollId,
        uint256 _candidateId,
        bytes32 _emailHash
    ) public {
        require(_pollId > 0 && _pollId <= pollCount, "Invalid poll ID");

        Poll storage poll = polls[_pollId];

        require(
            (block.timestamp >= poll.startsAt &&
                block.timestamp <= poll.endsAt),
            "Poll not active"
        );
        require(!poll.hasVoted[_emailHash], "Already voted");

        // Check if voter is registered
        bool isRegistered = false;
        for (uint256 i = 1; i <= poll.voterCount; i++) {
            if (poll.registeredVoterEmailHashes[i] == _emailHash) {
                isRegistered = true;
                break;
            }
        }
        require(isRegistered, "Not a registered voter");

        PollCandidate storage candidate = poll.candidates[_candidateId];
        require(bytes(candidate.name).length > 0, "Candidate does not exist");

        // Mark voter as having voted
        poll.hasVoted[_emailHash] = true;
        poll.voterChoices[_emailHash] = _candidateId;

        // Increment vote count
        candidate.voteCount++;
        poll.totalVotes++;
    }

    function getPoll(
        uint256 _pollId
    )
        public
        view
        returns (
            string memory name,
            string memory description,
            uint256 startsAt,
            uint256 endsAt,
            string[] memory candidates
        )
    {
        require(_pollId > 0 && _pollId <= pollCount, "Invalid poll ID");

        Poll storage poll = polls[_pollId];

        // Initialize candidates array
        candidates = new string[](poll.candidateCount);

        // Populate candidates (starting from index 1)
        for (uint256 i = 1; i <= poll.candidateCount; i++) {
            candidates[i - 1] = poll.candidates[i].name;
        }

        return (
            poll.name,
            poll.description,
            poll.startsAt,
            poll.endsAt,
            candidates
        );
    }

    function getPollsByCreator(
        bytes32 _creatorEmailHash
    )
        public
        view
        returns (
            uint256[] memory pollIds,
            string[] memory names,
            string[] memory descriptions,
            uint256[] memory startsAt,
            uint256[] memory endsAt
        )
    {
        uint256 count = 0;
        for (uint256 i = 1; i <= pollCount; i++) {
            if (polls[i].creatorEmailHash == _creatorEmailHash) {
                count++;
            }
        }

        pollIds = new uint256[](count);
        names = new string[](count);
        descriptions = new string[](count);
        startsAt = new uint256[](count);
        endsAt = new uint256[](count);

        uint256 index = 0;
        for (uint256 i = 1; i <= pollCount; i++) {
            if (polls[i].creatorEmailHash == _creatorEmailHash) {
                pollIds[index] = i;
                names[index] = polls[i].name;
                descriptions[index] = polls[i].description;
                startsAt[index] = polls[i].startsAt;
                endsAt[index] = polls[i].endsAt;
                index++;
            }
        }

        return (pollIds, names, descriptions, startsAt, endsAt);
    }

    function getPollVotesByCreator(
        bytes32 _creatorEmailHash
    )
        public
        view
        returns (
            uint256[] memory pollIds,
            uint256[] memory totalVoters,
            uint256[] memory totalVotes
        )
    {
        uint256 count = 0;
        for (uint256 i = 1; i <= pollCount; i++) {
            if (polls[i].creatorEmailHash == _creatorEmailHash) {
                count++;
            }
        }

        pollIds = new uint256[](count);
        totalVoters = new uint256[](count);
        totalVotes = new uint256[](count);

        uint256 index = 0;
        for (uint256 i = 1; i <= pollCount; i++) {
            if (polls[i].creatorEmailHash == _creatorEmailHash) {
                pollIds[index] = i;
                totalVoters[index] = polls[i].voterCount;
                totalVotes[index] = polls[i].totalVotes;
                index++;
            }
        }

        return (pollIds, totalVoters, totalVotes);
    }

    function getVoterDetails(
        uint256 _pollId
    )
        public
        view
        returns (bytes32[] memory allVoters, uint256[] memory hasVoted)
    {
        require(_pollId > 0 && _pollId <= pollCount, "Invalid poll ID");

        Poll storage poll = polls[_pollId];

        uint256 votersCount = poll.voterCount;

        allVoters = new bytes32[](votersCount);
        hasVoted = new uint256[](votersCount);

        for (uint256 i = 1; i <= votersCount; i++) {
            bytes32 voterHash = poll.registeredVoterEmailHashes[i];
            allVoters[i - 1] = voterHash;
            hasVoted[i - 1] = poll.hasVoted[voterHash] ? 1 : 0;
        }

        return (allVoters, hasVoted);
    }

    function getPollCount() public view returns (uint256) {
        return pollCount;
    }

    function getPollsByVoter(
        bytes32 _voterEmailHash
    )
        public
        view
        returns (
            uint256[] memory pollIds,
            string[] memory names,
            string[] memory descriptions,
            uint256[] memory startsAt,
            uint256[] memory endsAt,
            bool[] memory hasVoted
        )
    {
        uint256 count = 0;
        for (uint256 i = 1; i <= pollCount; i++) {
            for (uint256 j = 1; j <= polls[i].voterCount; j++) {
                if (polls[i].registeredVoterEmailHashes[j] == _voterEmailHash) {
                    count++;
                    break;
                }
            }
        }

        pollIds = new uint256[](count);
        names = new string[](count);
        descriptions = new string[](count);
        startsAt = new uint256[](count);
        endsAt = new uint256[](count);
        hasVoted = new bool[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= pollCount; i++) {
            for (uint256 j = 1; j <= polls[i].voterCount; j++) {
                if (polls[i].registeredVoterEmailHashes[j] == _voterEmailHash) {
                    pollIds[index] = i;
                    names[index] = polls[i].name;
                    descriptions[index] = polls[i].description;
                    startsAt[index] = polls[i].startsAt;
                    endsAt[index] = polls[i].endsAt;
                    hasVoted[index] = polls[i].hasVoted[_voterEmailHash];
                    index++;
                    break; // Avoid duplicate counting
                }
            }
        }

        return (pollIds, names, descriptions, startsAt, endsAt, hasVoted);
    }

    function getPollByVoter(
        uint256 _pollId,
        bytes32 _voterEmailHash
    )
        public
        view
        returns (
            uint256[] memory pollIds,
            string[] memory names,
            string[] memory descriptions, 
            uint256[] memory startsAt,
            uint256[] memory endsAt
            // bool[] memory hasVoted,
            // string[][] memory candidates,
            // string[] memory votedCandidateNames
        )
    {
        require(_pollId > 0 && _pollId <= pollCount, "Invalid poll ID");

        Poll storage poll = polls[_pollId];

        // Verify voter is registered for this poll
        bool isRegistered = false;
        for (uint256 i = 1; i <= poll.voterCount; i++) {
            if (poll.registeredVoterEmailHashes[i] == _voterEmailHash) {
                isRegistered = true;
                break;
            }
        }
        require(isRegistered, "Voter is not registered for this poll");

        // Initialize arrays with length 1 since we're returning single poll
        pollIds = new uint256[](1);
        names = new string[](1);
        descriptions = new string[](1);
        startsAt = new uint256[](1);
        endsAt = new uint256[](1);
        // hasVoted = new bool[](1);
        // candidates = new string[][](1);
        // votedCandidateNames = new string[](1);

        pollIds[0] = _pollId;
        names[0] = poll.name;
        descriptions[0] = poll.description;
        startsAt[0] = poll.startsAt;
        endsAt[0] = poll.endsAt;
        // hasVoted[0] = poll.hasVoted[_voterEmailHash];
        
        // Get all candidate names
        // candidates[0] = new string[](poll.candidateCount);
        // for (uint256 i = 1; i <= poll.candidateCount; i++) {
        //     candidates[0][i - 1] = poll.candidates[i].name;
        // }

        // // Get voted candidate name if voter has voted
        // votedCandidateNames[0] = "";
        // if (hasVoted[0]) {
        //     uint256 votedCandidateId = poll.voterChoices[_voterEmailHash];
        //     if (votedCandidateId > 0 && votedCandidateId <= poll.candidateCount) {
        //         votedCandidateNames[0] = poll.candidates[votedCandidateId].name;
        //     }
        // }

        return (
            pollIds,
            names,
            descriptions,
            startsAt,
            endsAt
            // hasVoted,
            // candidates,
            // votedCandidateNames
        );
    }
}
