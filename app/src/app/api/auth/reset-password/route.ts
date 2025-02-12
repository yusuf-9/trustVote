import CustomError from "@/server/models/custom-error";
import AuthService from "@/server/services/auth";
import { NextRequest, NextResponse } from "next/server";

type ResetPasswordDTO = {
  password: string;
  key: string;
};

export async function POST(request: NextRequest) {
  try {
    const requestBody: ResetPasswordDTO = await request.json();

    if (!requestBody.password) {
      throw new CustomError(400, "Password is required");
    }

    if (!requestBody.key) {
      throw new CustomError(400, "Access token key is required");
    }

    await AuthService.resetPassword(requestBody.password, requestBody.key);
    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
