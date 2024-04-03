const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
const publicPath = path.join(process.cwd(), 'public');
const externalConfig = require('./externalConfig.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '**',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/client',
                permanent: true,
            },
            {
                // Match any path that doesn't start with 'client' or 'admin' and the other
                source: `/:path((?!client|admin|${externalConfig.mainMatcher}|${externalConfig.antiRedirectMatcher}).*)`,
                destination: '/client/:path*', // Append '/client' to the matched path
                permanent: true,
            },
        ]
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
        // append the CopyPlugin to copy the file to your public dir
        config.plugins.push(
            new CopyPlugin({
                patterns: [
                    { from: path.join(nodeModulesPath, 'jquery', 'dist', 'jquery.min.js'), to: path.join(publicPath, 'assets', 'js') },
                    { from: path.join(nodeModulesPath, 'bootstrap', 'dist', 'js', 'bootstrap.min.js'), to: path.join(publicPath, 'assets', 'js') },
                    { from: path.join(nodeModulesPath, 'slick-carousel', 'slick', 'slick.min.js'), to: path.join(publicPath, 'assets', 'js') },
                    { from: path.join(nodeModulesPath, 'nouislider', 'dist', 'nouislider.min.js'), to: path.join(publicPath, 'assets', 'js') },
                    { from: path.join(nodeModulesPath, 'jquery-zoom', 'jquery.zoom.min.js'), to: path.join(publicPath, 'assets', 'js') },
                ],
            }),
        )

        config.module.rules.push({
            test: /\.(jpg|png|svg|gif)$/,
            type: 'asset/resource',
        })

        // Important: return the modified config
        return config
    }
}

module.exports = nextConfig