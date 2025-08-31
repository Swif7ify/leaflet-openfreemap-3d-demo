import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	basePath: process.env.NODE_ENV === "production" ? "/leaflet-openfreemap-3d-demo" : "",
	assetPrefix: process.env.NODE_ENV === "production" ? "/leaflet-openfreemap-3d-demo/" : "",
};

export default nextConfig;
