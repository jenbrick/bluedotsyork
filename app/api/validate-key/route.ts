import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.debug("Request",request);
    const { accessKey } = await request.json();
    console.log(accessKey)
    const correctKey = process.env.ACCESS_KEY || "bluedotsyork";

    if (accessKey === correctKey) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ valid: false, error: "Server error" });
  }
}
