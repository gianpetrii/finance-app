/** @type {import('next').NextConfig} */
const nextConfig = {
  // Solo usar output: 'export' en producción
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  // Configuración para mejorar el HMR
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;
