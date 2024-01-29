/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  basePath: process.env.NEXT_PUBLIC_BASEPATH,
};

module.exports = nextConfig;
