/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
};

if (process.env.NODE_ENV === 'development') {
  // 只在开发环境中启用重写规则
  const rewrites = () => {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // 代理到后端
      },
    ];
  };

  // 将重写规则添加到配置中
  nextConfig.rewrites = rewrites;
}

export default nextConfig;
