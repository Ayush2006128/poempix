import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    // For `next/image` with data URIs, no specific configuration for `dangerouslyAllowSVG` or `contentSecurityPolicy`
    // is usually needed unless SVGs are directly embedded or strict CSPs are in place.
    // Data URIs (e.g., `data:image/png;base64,...`) are generally supported.
  },
};

export default nextConfig;
