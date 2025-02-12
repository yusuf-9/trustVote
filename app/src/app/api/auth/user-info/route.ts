import { getCustomServerSession } from "@/server/utils";
import { NextResponse } from "next/server";
import AuthService from "@/server/services/auth";
import CustomError from "@/server/models/custom-error";

export async function GET() {
  try {
    const user = await getCustomServerSession();
    if (!user || !user.id) {
      return new NextResponse("", { status: 401 });
    }

    const userInfo = await AuthService.getUserInfo(user.id);
    return NextResponse.json({ data: userInfo }, { status: 200 });
  } catch (error: unknown) {
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
