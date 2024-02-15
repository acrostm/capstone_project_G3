/** @type {import('next').NextConfig} */
const rewrites = () => {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:3001/api/:path*', // Proxy to Backend
    },
  ];
};

const nextConfig = {
  reactStrictMode: true,
  rewrites,
}

export default nextConfig
