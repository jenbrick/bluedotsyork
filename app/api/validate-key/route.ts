import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { accessKey } = await request.json();
    const correctKey = process.env.ACCESS_KEY || "LNJsiCYBiLZwzjDYCg8FAk1IaS3IO9NT";

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
