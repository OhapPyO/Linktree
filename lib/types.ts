import { Geo } from "@vercel/functions";

// Client-side data that gets sent from the browser
export interface ClientTrackingData {
  profileUsername: string;
  linkId: string;
  linkTitle: string;
  linkUrl: string;
  userAgent?: string;
  referrer?: string;
}

// Compelete server-side tracking event with additional data
// Note: use profileUserId for queries as usernames can change
export interface ServerTrackingEvent extends ClientTrackingData {
  profileUserId: string;
  timestamp: string;
  location: Geo;
}
