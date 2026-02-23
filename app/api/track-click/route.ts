/// <reference types="next" />
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
    // Add Server-side data
    const trackingEvent: ServerTrackingEvent = {
      ...data, // CLient Data
      // Server Data
      profileUserId: userId,
      timestamp: new Date().toISOString().replace("T", " ").split(".")[0],
      location: { ...geo },
      userAgent:
        data.userAgent || request.headers.get("user-agent") || "unknown",
    };
    console.log("Tinybird Host:", process.env.TINYBIRD_HOST);
    console.log(
      "Tinybird Host:**************************************************",
    );

    console.log("Sending To Tinybird Server Api: ", trackingEvent);
    if (process.env.TINYBIRD_TOKEN && process.env.TINYBIRD_HOST) {
      try {
        // Send location as nested object to match schema json paths
        const eventForTinybird = {
          timestamp: new Date().toISOString().replace("T", " ").split(".")[0],

          profileUsername: trackingEvent.profileUsername ?? "",
          profileUserId: trackingEvent.profileUserId ?? "",
          linkId: trackingEvent.linkId ?? "",
          linkTitle: trackingEvent.linkTitle ?? "",
          linkUrl: trackingEvent.linkUrl ?? "",

          userAgent: trackingEvent.userAgent ?? "",
          referrer: trackingEvent.referrer ?? "",

          location_country: trackingEvent.location?.country ?? "",
          location_region: trackingEvent.location?.region ?? "",
          location_city: trackingEvent.location?.city ?? "",
          location_latitude: trackingEvent.location?.latitude ?? "",
          location_longitude: trackingEvent.location?.longitude ?? "",
        };

        console.log(
          "Sending Event To Tinybird: ",
          JSON.stringify(eventForTinybird, null, 2),
        );
        console.log("FINAL EVENT:", Object.keys(eventForTinybird));
        console.log("TIMESTAMP VALUE:", eventForTinybird.timestamp);
        console.log(JSON.stringify(eventForTinybird, null, 2));

        const tinybirdResponse = await fetch(
          `${process.env.TINYBIRD_HOST}/v0/events?name=link_clicks`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventForTinybird),
          },
        );
        if (!tinybirdResponse.ok) {
          const errorText = await tinybirdResponse.text();
          console.error("Failed To Send To Tinybird: ", errorText);
          // DOnt Fail the request if Tinybird is down - just log the error
        } else {
          const responseBody = await tinybirdResponse.json();
          console.log("Successfully sent to Tinybird:", responseBody);
          if (responseBody.quarantined_rows > 0) {
            console.warn("Some rows were quarantined: ", responseBody);
          }
        }
      } catch (tinybirdError) {
        console.error("Tinybird request failed: ", tinybirdError);
        // dont fail the request if tinybird is down
      }
    } else {
      console.log("Tinybird not configured - event logged only");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking click: ", error);
    return NextResponse.json(
      { error: "Failed to track link" },
      { status: 500 },
    );
  }
}
