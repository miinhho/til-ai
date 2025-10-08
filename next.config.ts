import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? require("@next/bundle-analyzer")()
    : // biome-ignore lint/suspicious/noExplicitAny: this is just a fallback
      (x: any) => x;

export default withBundleAnalyzer(nextConfig);
