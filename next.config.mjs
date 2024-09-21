// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
    webpack: config => {
        config.resolve.fallback = { fs: false, net: false, tls: false }
        config.externals.push({ 'web-worker': 'commonjs web-worker' }, 'ioredis')
        return config
    },
    experimental: {
        instrumentationHook: true
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
    // output: 'standalone'
}

export default nextConfig