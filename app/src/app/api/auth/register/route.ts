import { NextRequest, NextResponse } from "next/server";
import AuthService from "@/server/services/auth";
import CustomError from "@/server/models/custom-error";

export type UserRegisterDTO = {
  email?: string;
  name?: string;
  password?: string;
};

export async function POST(request: NextRequest) {
  try {
    const requestBody: UserRegisterDTO = await request.json();

    if (!requestBody?.email || !requestBody?.name || !requestBody?.password) {
      throw new CustomError(400, "Missing fields. Please send the name, email and password");
    }

    await AuthService.registerUser(requestBody as Required<UserRegisterDTO>);
    return NextResponse.json({ status: 201 });
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
