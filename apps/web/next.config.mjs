import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline.html",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Allow importing TS files from outside the apps/web directory (shared/types)
    externalDir: true,
  },
};

export default withPWA(nextConfig);
