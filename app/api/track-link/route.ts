import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import { getClient } from "@/convex/client";
import { api } from "@/convex/_generated/api";
import { ClientTrackingData, ServerTrackingEvent } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const data: ClientTrackingData = await request.json();
    const geo = geolocation(request);
    const convex = getClient();
    // get user id by username
    const userId = await convex.query(api.lib.usernames.getUserIdBySlug, {
      slug: data.profileUsername,
    });
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error tracking link:", error);
    return NextResponse.json(
      { error: "Failed to track link" },
      { status: 500 },
    );
  }
}
