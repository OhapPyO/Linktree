import LinkAnalytics from "@/components/LinkAnalytics";
import { fetchLinkAnalytics } from "@/lib/link-analytics-server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import React from "react";

interface LinksAnalyticsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function LinksAnalyticsPage({ params }: LinksAnalyticsPageProps) {
  const user = await currentUser();
  const { has } = await auth();
  const { id } = await params;
  const hasAnalyticsAccess = has({ feature: "access_to_analytics" });
  if (!user) {
    notFound();
  }
  // fetch analytics for the specific link
  const analytics = await fetchLinkAnalytics(user.id, id);
  // if no analytics data found, show the component with epmty state
  // The linkAnalytics component handles the "No data" case gracefully
  if (!analytics) {
    // return empty analytics object so component can show "no data" state
    const emptyAnalytics = {
      linkId: id,
      linkTitle: "This link has no analytics",
      linkUrl: "Please wait for analytics to be generated or check back later",
      totalClicks: 0,
      uniqueUsers: 0,
      countriesReached: 0,
      dailyData: [],
      countryData: [],
    };
    return (
      <LinkAnalytics
        analytics={emptyAnalytics}
        hasAnalyticsAccess={hasAnalyticsAccess}
      />
    );
  }

  return (
    <LinkAnalytics
      analytics={analytics}
      hasAnalyticsAccess={hasAnalyticsAccess}
    />
  );
}

export default LinksAnalyticsPage;
