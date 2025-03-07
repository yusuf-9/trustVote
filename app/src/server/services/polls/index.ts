import { prisma } from "@/server/lib/prisma";
import { ethers } from "ethers";
import { sanitizeEmail } from "@/common/utils";
export default class PollsService {
  static async registerPollVoterHashes(voterEmails: string[]): Promise<void> {
    
    const voterHashes = voterEmails.map(email => {
      const sanitizedEmail = sanitizeEmail(email);
      const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(sanitizedEmail));
      return {
        email: sanitizedEmail,
        hash,
      };
    });

    // Filter out hashes that already exist
    const existingHashes = await prisma.emailHash.findMany({
      where: {
        hash: { in: voterHashes.map(vh => vh.hash) }
      },
      select: {
        hash: true
      }
    });

    const existingHashSet = new Set(existingHashes.map(eh => eh.hash));
    const newVoterHashes = voterHashes.filter(vh => !existingHashSet.has(vh.hash));

    if (newVoterHashes.length > 0) {
      await prisma.emailHash.createMany({
        data: newVoterHashes,
      });
    }
  }

  static async getVoterEmailsFromHashes(hashes: string[]): Promise<string[]> {
    const voterEmails = await prisma.emailHash.findMany({
      where: {
        hash: { in: hashes },
      },
      select: {
        email: true,
      },
    });

    return voterEmails.map(voterEmail => voterEmail.email);
  }
}
