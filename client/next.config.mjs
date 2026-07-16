/** @type {import('next').NextConfig} */
const nextConfig = {
	// Webpack dev cache can desync chunk ids (e.g. "Cannot find module './72.js'") in Docker.
	// `npm run dev` uses Turbopack; this applies when using `npm run dev:webpack`.
	webpack: (config, { dev }) => {
		if (dev) {
			config.cache = false;
		}
		return config;
	},
};

export default nextConfig;
