import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Carteira Pokémon TCG',
  slug: 'carteira-pokemon-tcg',
  version: '0.1.0',
  orientation: 'portrait',
  scheme: 'pkmn',
  userInterfaceStyle: 'automatic',
  splash: {
    backgroundColor: '#0f172a',
    resizeMode: 'contain',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.pkmn.carteira',
  },
  android: {
    package: 'com.pkmn.carteira',
  },
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
