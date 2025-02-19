import { NextRequest, NextResponse } from "next/server";
import CustomError from "@/server/models/custom-error";
import PollsService from "@/server/services/polls";
import { getCustomServerSession } from "@/server/utils";

export type EmailHashDTO = {
  emails: string[];
};

export async function POST(request: NextRequest) {
  try {
    const user = await getCustomServerSession();
    if (!user || !user.id) {
      return new NextResponse("", { status: 401 });
    }

    const requestBody: EmailHashDTO = await request.json();

    if (!requestBody?.emails) {
      throw new CustomError(400, "Missing fields. Please send the emails");
    }

    await PollsService.registerPollVoterHashes(requestBody.emails);
    return NextResponse.json({ status: 201 });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
