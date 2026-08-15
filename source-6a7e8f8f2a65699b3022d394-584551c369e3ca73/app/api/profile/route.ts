import { NextResponse } from "next/server";
import { getOrCreateProfile } from "@/lib/profile";

export async function GET() {
  const profile = await getOrCreateProfile();
  return NextResponse.json({ profile });
}
