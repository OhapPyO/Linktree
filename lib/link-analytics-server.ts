import { countReset } from "console";

export interface LinkAnalyticsData {
  linkId: string;
  linkTitle: string;
  linkUrl: string;
  totalClicks: number;
  uniqueUsers: number;
  countriesReached: number;
  dailyData: Array<{
    date: string;
    clicks: number;
    uniqueUsers: number;
    countries: number;
  }>;
  countryData: Array<{
    country: string;
    clicks: number;
    percentage: number;
  }>;
}

interface TinybirdLinkAnalyticsRow {
  date: string;
  linkTitle: string;
  linkUrl: string;
  total_clicks: number;
  unique_users: number;
  countries_reached: number;
}

interface TinybirdCountryAnlyticsRow {
  country: string;
  total_clicks: number;
  unique_users: number;
  percentage: number;
}

export async function fetchLinkAnalytics(
  userId: string,
  linkId: string,
  daysBack: number = 30,
): Promise<LinkAnalyticsData | null> {
  //Check if tinybird is configured
  if (!process.env.TINYBIRD_TOKEN || !process.env.TINYBIRD_HOST) {
    // Return empty data when tinybird is not confiured
    return {
      linkId,
      linkTitle: "Sample Link",
      linkUrl: "",
      totalClicks: 0,
      uniqueUsers: 0,
      countriesReached: 0,
      dailyData: [],
      countryData: [],
    };
  }
  try {
    // Try Fast materialized enpoint first
    let tinybirdResponse = await fetch(
      `${process.env.TINYBIRD_HOST}/v0/pipes/fast_link_analytics.json?profileUserId=${userId}&linkId=${linkId}&days_back=
      ${daysBack}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
        },
        next: { revalidate: 0 }, // NO Caching for real-time data
      },
    );

    //Fallback to original endpoint if materialized data not availabe
    if (!tinybirdResponse.ok) {
      console.log("Fast Link analytics failed, falling back to original");
      tinybirdResponse = await fetch(
        `${process.env.TINYBIRD_HOST}/v0/pipes/link_analytics.json?profileUserId=${userId}&linkId=${linkId}&days_back=
         ${daysBack}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
          },
          next: { revalidate: 0 }, // NO Caching for real-time data
        },
      );
    }
    if (!tinybirdResponse.ok) {
      console.error("Tinybird request failed: ", await tinybirdResponse.text());
      throw new Error("Failed to fetch link analytics");
    }
    const data = await tinybirdResponse.json();

    //Handle empty response
    if (!data.data || data.data.length === 0) {
      return null; // Link Not found or no data
    }

    // process the daily data
    const dailyData = data.data.map((row: TinybirdLinkAnalyticsRow) => ({
      date: row.date,
      clicks: row.total_clicks || 0,
      uniqueUsers: row.unique_users || 0,
      countries: row.countries_reached || 0,
    }));
    // Calculate totals
    const totalClicks = dailyData.reduce(
      (sum: number, day: { clicks: number }) => sum + day.clicks,
      0,
    );

    const uniqueUsers = Math.max(
      ...dailyData.map((day: { uniqueUsers: number }) => day.uniqueUsers),
      0,
    );
    const countriesReached = Math.max(
      ...dailyData.map((day: { countries: number }) => day.countries),
      0,
    );

    //Get link info from first row
    const firstRow = data.data[0] as TinybirdLinkAnalyticsRow;

    // Fetch country-level data from the country abalytics endpoint
    let countryData: Array<{
      country: string;
      clicks: number;
      percentage: number;
    }> = [];

    try {
      const countryResponse = await fetch(
        `${process.env.TINYBIRD_HOST}/v0/pipes/link_country_analytics.json?profileUserId=${userId}&linkId=${linkId}&days_back=
        ${daysBack}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
          },
          next: { revalidate: 0 }, // NO Caching for real-time data
        },
      );
      if (countryResponse.ok) {
        const countryResult = await countryResponse.json();
        if (countryResult.data && countryResult.data.length > 0) {
          countryData = countryResult.data.map(
            (row: TinybirdCountryAnlyticsRow) => ({
              country: row.country || "Unknown",
              clicks: row.total_clicks || 0,
              percentage: row.percentage || 0,
            }),
          );
        }
      }
    } catch (countryError) {
      console.error("Failed to fetch country data: ", countryError);
      // Countinue without country data
    }
    return {
      linkId,
      linkTitle: firstRow.linkTitle || "Unknown Link",
      linkUrl: firstRow.linkUrl || " ",
      totalClicks,
      uniqueUsers,
      countriesReached,
      dailyData: dailyData.reverse(), // Most recent first,
      countryData,
    };
  } catch (tinybirdError) {
    console.error("Tinybird error: ", tinybirdError);
    return null;
  }
}
