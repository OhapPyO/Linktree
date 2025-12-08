import PublicPageContent from "@/components/PublicPageContent";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

async function publicLinkInBioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const [preloadedLinks, preloadedCustomzations] = await Promise.all([
    preloadQuery(api.lib.links.getLinksBySlug, { slug: username }),
    preloadQuery(api.lib.customizations.getCustomizationsBySlug, {
      slug: username,
    }),
  ]);
  return (
    <PublicPageContent
      username={username}
      preloadedLinks={preloadedLinks}
      preloadedCustomizations={preloadedCustomzations}
    />
  );
}

export default publicLinkInBioPage;
