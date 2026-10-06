import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@pkmn/types', '@pkmn/validation'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.tcgdex.net' },
      { protocol: 'https', hostname: 'images.pokemontcg.io' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default config;
