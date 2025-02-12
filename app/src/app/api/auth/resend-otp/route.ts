import { NextRequest, NextResponse } from "next/server";

// services
import AuthService from "@/server/services/auth";
import CustomError from "@/server/models/custom-error";

type ResendOtpDTO = {
  email: string;
};

export async function POST(req: NextRequest) {
  try {
    const resendOtpDTO: ResendOtpDTO = await req.json();

    if (!resendOtpDTO.email) {
      throw new CustomError(400, "Email is required");
    }

    await AuthService.resendOtp(resendOtpDTO.email);

    return NextResponse.json({ message: "OTP resent successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.log(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
