import {withSentryConfig} from "@sentry/nextjs";
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

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "personal-795",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true
});