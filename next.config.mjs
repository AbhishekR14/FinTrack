/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Add basePath
  basePath: "/github-pages",
  // Exclude dynamic API routes from export
  // Implement generateStaticParams for dynamic API routes
  generateStaticParams: async () => {
    // Define static paths and their parameters
    return {
      "/": { page: "/" },
      // Add other static routes here as needed
    };
  },
};

export default nextConfig;
