import AgentPortalGate from "@/components/portal/AgentPortalGate";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Agent | Unified Apartments",
};

export default function AgentLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="bg-baby_veryBlack min-h-screen text-white">
			<header className="border-platinum/20 border-b px-6 py-4">
				<p className="text-platinum text-sm tracking-wide">Agent portal</p>
			</header>
			<AgentPortalGate>
				<div className="px-6 py-8">{children}</div>
			</AgentPortalGate>
		</main>
	);
}
