// next.config.ts

import type { NextConfig } from 'next';

// IMPORTANT: Replace 'terminal-site' with your exact repository name
const repo = 'terminal-site'; 
const assetPrefix = `/${repo}/`; // This creates '/terminal-site/'

const nextConfig: NextConfig = {
  output: 'export', 
  images: {
    unoptimized: true,
  },
  
  // Set both basePath and assetPrefix for maximum compatibility with GitHub Pages
  basePath: assetPrefix.slice(0, -1), // /terminal-site
  assetPrefix: assetPrefix,           // /terminal-site/
};

export default nextConfig;