import { prisma } from "@/server/lib/prisma";
import { keccak256, toUtf8Bytes } from "ethers";
import { sanitizeEmail } from "@/common/utils";
export default class PollsService {
  static async registerPollVoterHashes(voterEmails: string[]): Promise<void> {
    const voterHashes = voterEmails.map(email => {
      const sanitizedEmail = sanitizeEmail(email);
      const hash = keccak256(toUtf8Bytes(sanitizedEmail));
      return {
        email: sanitizedEmail,
        hash,
      };
    });

    await prisma.emailHash.createMany({
      data: voterHashes,
    });
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
