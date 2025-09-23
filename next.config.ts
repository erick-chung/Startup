// Configures Next.js behavior -> images, redirects, styling, api routes, etc
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "bottom-right",
  },

  // By default, Next.js blocks external images. It only allows images from your own demain.
  images: {
    // Got an error message saying that the placeholder url image has type 'image/svg+xml' -> add the dangerouslyAllowSVG properly and set it to true to fix
    // Only adding it temporarily for placeholder images! Remove later
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  // experimental: {
  //   ppr: "incremental",
  // },
  // *********************************************************************************************************************************************
  // **********************************LATER ON WHEN YOU REMOVE ALL COMMENTS BEFORE DEPLOYING, TAKE NOTE OF THIS ONE AND KEEP THIS ONE: INDICATE THAT
  // No experimental PPR - removed for stability (adjust code later)
};

export default nextConfig;
