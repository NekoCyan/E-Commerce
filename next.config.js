/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/client',
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
