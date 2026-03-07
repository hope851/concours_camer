/** @type {import('next').NextConfig} */
const nextConfig = {


 images: {
    unoptimized: true, // Désactive l'optimisation locale pour TOUT le projet
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Augmente la limite à 10 Mo
    },
  },
};

export default nextConfig;
