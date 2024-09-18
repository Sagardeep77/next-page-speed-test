/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'via.placeholder.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname:'picsum.photos',
          }
        ],
      },
};

export default nextConfig;
