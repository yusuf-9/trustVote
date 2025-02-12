import { NextRequest, NextResponse } from "next/server";
import AuthService from "@/server/services/auth";
import CustomError from "@/server/models/custom-error";

export type ForgotPasswordDTO = {
  email: string;
};

export async function POST(request: NextRequest) {
  try {
    const requestBody: ForgotPasswordDTO = await request.json();

    if (!requestBody?.email) {
      throw new CustomError(400, "Missing fields. Please send the email");
    }

    await AuthService.createPasswordResetTokenAndSendMail(requestBody.email);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
