const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Modify webpack config only in development
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
        cacheDirectory: path.resolve(__dirname, '.next/cache/webpack'),
        name: isServer ? 'server' : 'client',
        version: '1',
      }
    }
    return config
  },
}

module.exports = nextConfig 