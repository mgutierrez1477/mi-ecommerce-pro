/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // <--- ESTO EVITA EL ERROR 400 DE VERCEL
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mi-ecommerce-pro-production.up.railway.app',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;