import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import React from "react";
import "./globals.css";

import Toast from "@/components/shared/Toast";
import ReduxProvider from "@/lib/redux/provider";
import { PersistAuth } from "@/utils";

export const metadata: Metadata = {
	title: "Home | Unified Apartments",
	description: "Welcome home",
  icons: {
    icon: "favicon.ico", // Can also be a .png or .svg
    },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			{/* No Google Fonts: avoid gstatic fetches in Docker and broken dev cache when the CSS pipeline pulls .woff2 */}
			<body className="font-sans">
				<Toast />
				<ReduxProvider>
					<PersistAuth />
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}
