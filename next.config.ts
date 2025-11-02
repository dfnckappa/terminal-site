// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', 
  images: {
    unoptimized: true,
  },
  
  // ✨ THE CRITICAL FIX: Set the base path to your repository name
  basePath: '/terminal-site', // <-- Use your actual repository name here!
};

export default nextConfig;