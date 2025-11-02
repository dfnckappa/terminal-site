// next.config.ts

import type { NextConfig } from 'next';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  // 1. Enable Static HTML Export for GitHub Pages
  output: 'export', 

  // 2. Disable Image Optimization (Crucial for static export)
  images: {
    unoptimized: true,
  },

  // 3. Set Base Path (REQUIRED for project pages)
  // ONLY use this if your site URL is: https://<username>.github.io/your-repo-name
  // If you are using a custom root domain (e.g., example.com), OMIT this line.
  // basePath: '/your-repo-name', 
};

export default nextConfig;