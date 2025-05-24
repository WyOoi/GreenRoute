import nextPwa from 'next-pwa';

const withPWA = nextPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.mapbox\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'mapbox-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
        }
      }
    }
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['tile.openstreetmap.org', 'cdnjs.cloudflare.com']
  },
  env: {
    // OpenWeatherMap API Key (optional)
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    
    // Optional API keys for production
    PURPLEAIR_API_KEY: process.env.PURPLEAIR_API_KEY,
    WAQI_API_KEY: process.env.WAQI_API_KEY,
    EPA_AQS_API_KEY: process.env.EPA_AQS_API_KEY,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    GRAPHHOPPER_API_KEY: process.env.GRAPHHOPPER_API_KEY,
  }
};

export default withPWA(nextConfig);
