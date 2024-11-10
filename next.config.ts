import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    webpack: config => {
        config.externals.push({ 'web-worker': 'commonjs web-worker' }, 'ioredis')
        return config
    },
    output: 'standalone'
}

export default nextConfig