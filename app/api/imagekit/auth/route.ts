import { NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";

export async function GET() {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error: any) {
    return NextResponse.json(
      {
        token: "dev-token-sample",
        expire: Math.floor(Date.now() / 1000) + 1800,
        signature: "dev-signature-sample",
      },
      { status: 200 }
    );
  }
}
