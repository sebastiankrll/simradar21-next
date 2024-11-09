import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    webpack: config => {
        config.externals.push({ 'web-worker': 'commonjs web-worker' }, 'ioredis')
        return config
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.kiwi.com',
                port: '',
                pathname: '/airlines/64/**',
            },
        ],
    },
    output: 'standalone'
}

export default nextConfig