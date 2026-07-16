import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import React from "react";
import "./globals.css";

import Toast from "@/components/shared/Toast";
import ReduxProvider from "@/lib/redux/provider";
import { PersistAuth } from "@/utils";
import { TENANT_APP } from "@/constants/tenant";

export const metadata: Metadata = {
	title: `${TENANT_APP.name} | ${TENANT_APP.tagline}`,
	description: TENANT_APP.description,
	icons: {
		icon: "favicon.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="font-sans antialiased">
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
