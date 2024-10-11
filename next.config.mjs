/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
};

export default nextConfig;
