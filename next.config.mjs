/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        hostname: "media.gq.com",
      },
      {
        hostname: "tigersafety.co.uk",
      },
      {
        hostname: "img.freepik.com",
      },
      {
        hostname: "www.transparentpng.com",
      },
    ],
  },
};

export default nextConfig;
