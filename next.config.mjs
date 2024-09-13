// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
    webpack: config => {
        config.resolve.fallback = { fs: false, net: false, tls: false }
        config.externals.push({ 'web-worker': 'commonjs web-worker' })
        return config
    },
}

export default nextConfig