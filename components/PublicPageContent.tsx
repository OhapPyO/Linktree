"use client";

import { api } from "@/convex/_generated/api";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // 👈 این مهمه
import Links from "./ui/Links";

interface PublicPageContentProps {
  username: string;
  preloadedLinks: Preloaded<typeof api.lib.links.getLinksBySlug>;
  preloadedCustomizations: Preloaded<
    typeof api.lib.customizations.getCustomizationsBySlug
  >;
}

function PublicPageContent({
  username,
  preloadedLinks,
  preloadedCustomizations,
}: PublicPageContentProps) {
  const customizations = usePreloadedQuery(preloadedCustomizations);
  const links = usePreloadedQuery(preloadedLinks);

  const accentColor = customizations?.accentColor || "#6366f1";
  const profilePictureUrl = customizations?.profilePictureUrl || "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="h-48 relative"
        style={{
          background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Main content - Overlapping the header */}
      <div className="relative -mt-24 max-w-4xl  mx-auto px-6 pb-16">
        <div className="flex flex-col lg:flex-row lg:gap-12 xl:gap-16">
          {/* Left Column- Profile */}
          <div className="lg:w-80 lg:flex-shrink-0 mb-12 lg:mb-0">
            <div className="text-center lg:text-left">
              {/* Profile Picture */}
              <div className="flex justify-center lg:justify-start mb-6 mt-10">
                <div className="relative">
                  {customizations?.profilePictureUrl ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg bg-white p-1">
                      <Image
                        src={customizations?.profilePictureUrl}
                        alt={`${username}'s profile picture`}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="space-y-3">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  @{username}
                </h1>
                {customizations?.description && (
                  <p className="text-gray-700 text-base leading-relaxed max-w-md mx-auto lg:mx-0">
                    {customizations.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Links */}
          <div className="flex-1 min-w-0">
            <div
              className="bg-white/90 backdrop-blur-xl border
               border-white/20
             rounded-3xl p-8 lg:p-10 shadow-xl"
            >
              {/* TODO: Links list */}
              <Links preloadedLinks={preloadedLinks} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200/50 text-center">
          <p className="text-gray-600 text-sm">
            Powered by{" "}
            <Link
              href={getBaseUrl() + "/"}
              className="font-semibold hover:underline"
              style={{ color: accentColor }}
            >
              Linkify
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PublicPageContent;
