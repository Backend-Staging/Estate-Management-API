import ManagedUnitsPanel from "@/components/agent/ManagedUnitsPanel";
import { PLATFORM } from "@/constants/platform";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `Manage Units | ${PLATFORM.name}`,
};

export default function AgentUnitsPage() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
			<div>
				<h1 className="font-display text-2xl font-bold text-ink dark:text-slate-100">
					Apartments & tenants
				</h1>
				<p className="mt-2 text-sm text-ink-muted dark:text-slate-400">
					Review units across all buildings and accept tenant registrations.
				</p>
			</div>
			<ManagedUnitsPanel />
		</div>
	);
}
