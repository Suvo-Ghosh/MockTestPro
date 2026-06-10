// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   reactCompiler: true,
// };

// export default nextConfig;

import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.js",     // Where we will write our service worker
  swDest: "public/sw.js",     // Where Next.js will output it
  disable: process.env.NODE_ENV === "development", // Optional: disables PWA in dev so it doesn't aggressively cache your local changes
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default withSerwist(nextConfig);
