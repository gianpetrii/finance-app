/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Vercel - no usar output: 'export'
  // Vercel maneja el deployment automáticamente
  
  // Configuración para mejorar el HMR en desarrollo
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  
  // Configuración para imágenes si las usas
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
