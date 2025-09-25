import nextra from 'nextra';

const withNextra = nextra({ 
  theme: 'nextra-theme-docs', 
  themeConfig: './theme.config.tsx' 
});

export default withNextra({
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
});
