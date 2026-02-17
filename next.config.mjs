/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Allows up to 50MB audio files
    },
  },
};

export default nextConfig;