import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
            //FIXME: temp, remove this
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: "/**"
            },
            {
                protocol: 'https',
                hostname: 'tiles.stadiamaps.com',
                port: '',
                pathname: "/**",
            },
            {
                protocol: 'https',
                hostname: 'cf.bstatic.com',
                port: '',
            }
        ],
        qualities: [30, 75],
    },
};

export default nextConfig;