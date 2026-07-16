import EstatePortalGate from "@/components/portal/EstatePortalGate";
import LeftNavbar from "@/components/shared/navbar/LeftNavbar";
import Navbar from "@/components/shared/navbar/Navbar";
import RightNavbar from "@/components/shared/navbar/RightNavbar";
import React from "react";

interface LayoutProps {
	children: React.ReactNode;
}

export default function layout({ children }: LayoutProps) {
	return (
		<main className="min-h-screen bg-surface-muted dark:bg-slate-950">
			<Navbar />
			<div className="flex">
				<LeftNavbar />
				<section className="flex min-h-screen flex-1 flex-col px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-24">
					<EstatePortalGate>{children}</EstatePortalGate>
				</section>
				<RightNavbar />
			</div>
		</main>
	);
}
