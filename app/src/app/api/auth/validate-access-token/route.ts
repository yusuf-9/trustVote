import CustomError from "@/server/models/custom-error";
import AuthService from "@/server/services/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // get the key from the request's query params
    const key = request.nextUrl.searchParams.get("key");

    if (!key) {
      throw new CustomError(400, "Missing fields. Please send the access token key");
    }

    await AuthService.validatePasswordResetToken(key);
    return NextResponse.json({ status: 200 });
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
