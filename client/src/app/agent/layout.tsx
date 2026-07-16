import AgentPortalGate from "@/components/portal/AgentPortalGate";
import Navbar from "@/components/shared/navbar/Navbar";
import { PLATFORM } from "@/constants/platform";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `Agent Portal | ${PLATFORM.name}`,
};

export default function AgentLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="min-h-screen bg-surface-muted dark:bg-slate-950">
			<Navbar />
			<header className="border-b border-surface-border bg-white/80 px-6 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
				<p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
					Agent operations portal
				</p>
			</header>
			<AgentPortalGate>
				<div className="px-4 py-8 sm:px-6 lg:px-8">{children}</div>
			</AgentPortalGate>
		</main>
	);
}
