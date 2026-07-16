import type { Config } from "tailwindcss";

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				/* Legacy aliases — mapped to CyberSys palette */
				googleBlue: "#4285F4",
				asparagus: "#0d9488",
				deepBlueGrey: "#0f172a",
				gray: "rgba(148, 163, 184, 0.25)",
				lightGray: "#94a3b8",
				electricIndigo: "#4f46e5",
				richBlack: "#0f172a",
				veryBlack: "#020617",
				babyPowder: "#f8fafc",
				pumpkin: "#06b6d4",
				platinum: "#e2e8f0",
				lightGrey: "#f1f5f9",
				pear: "#14b8a6",
				eerieBlack: "#1e293b",
				ballonWhite: "#f1f5f9",

				/* CyberSys design system */
				brand: {
					50: "#ecfeff",
					100: "#cffafe",
					200: "#a5f3fc",
					300: "#67e8f9",
					400: "#22d3ee",
					500: "#06b6d4",
					600: "#0891b2",
					700: "#0e7490",
					800: "#155e75",
					900: "#164e63",
					950: "#083344",
				},
				surface: {
					DEFAULT: "#ffffff",
					muted: "#f8fafc",
					elevated: "#ffffff",
					border: "#e2e8f0",
				},
				ink: {
					DEFAULT: "#0f172a",
					muted: "#64748b",
					subtle: "#94a3b8",
				},
			},
			boxShadow: {
				card: "0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06)",
				elevated:
					"0 4px 6px -1px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.06)",
				glow: "0 0 40px -8px rgb(6 182 212 / 0.35)",
			},
			backgroundImage: {
				"brand-gradient":
					"linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0e7490 100%)",
				"brand-mesh":
					"radial-gradient(at 40% 20%, rgb(6 182 212 / 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(79 70 229 / 0.12) 0px, transparent 50%), radial-gradient(at 0% 50%, rgb(14 116 144 / 0.1) 0px, transparent 50%)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-up": {
					from: { opacity: "0", transform: "translateY(12px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-up": "fade-up 0.5s ease-out forwards",
			},
			fontFamily: {
				sans: [
					"ui-sans-serif",
					"system-ui",
					"-apple-system",
					"Segoe UI",
					"sans-serif",
				],
				display: [
					"ui-sans-serif",
					"system-ui",
					"-apple-system",
					"Segoe UI",
					"sans-serif",
				],
				openSans: [
					"ui-sans-serif",
					"system-ui",
					"-apple-system",
					"Segoe UI",
					"sans-serif",
				],
				robotoSlab: [
					"ui-sans-serif",
					"system-ui",
					"-apple-system",
					"Segoe UI",
					"sans-serif",
				],
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
