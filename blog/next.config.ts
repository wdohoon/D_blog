import type { NextConfig } from "next";

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
})

module.exports = withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
})

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
