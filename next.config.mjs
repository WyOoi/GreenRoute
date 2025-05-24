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
    domains: ['api.mapbox.com', 'docs.mapbox.com']
  },
  transpilePackages: ['mapbox-gl'],
  webpack: (config, { isServer }) => {
    // Handle Mapbox GL JS
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Handle worker files
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' }
    });

    return config;
  },
  env: {
    // Required API keys
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
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
