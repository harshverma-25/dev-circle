/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add empty turbopack config to prevent Windows file watcher issues
  turbopack: {},
  
  // Prevent excessive file watching on Windows
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        ignored: /node_modules/,
        poll: 1000, // Use polling to prevent Windows watcher issues
      };
    }
    return config;
  },
  
  // outputFileTracingExcludes removed to avoid breaking serverless deployments
};

export default nextConfig;


