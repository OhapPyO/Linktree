export function getBaseUrl() {
  // check if we're in a browser environment
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  //check if we're in a production environment
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    //Priority ordder for prodcution URLs
    //1. Custom domain (recommended for prodcutions)
    if (process.env.NEXT_PUBLIC_CUSTOM_DOMAIN) {
      return process.env.NEXT_PUBLIC_APP_URL;
    }
    //2. Vercel URL (auto generated)
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }

    //3.Vercel Project URL (more reliable)
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    //4. Fallback- you shoul set this in production
    throw new Error(
      "Production URL not set. Please set NEXT_PUBLIC_APP_URL in production.",
    );
    //return the base url
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // Default to localhost:3000 for development
  return "http://localhost:3000";
}
