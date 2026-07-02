import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for the slim Docker runtime image (see Dockerfile)
  output: "standalone",
};

export default nextConfig;
