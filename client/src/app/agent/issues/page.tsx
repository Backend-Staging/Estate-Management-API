import AgentIssuesPanel from "@/components/agent/AgentIssuesPanel";
import { PLATFORM } from "@/constants/platform";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `Issue Queue | ${PLATFORM.name}`,
};

export default function AgentIssuesPage() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
			<div>
				<h1 className="font-display text-2xl font-bold text-ink dark:text-slate-100">
					Maintenance requests
				</h1>
				<p className="mt-2 text-sm text-ink-muted dark:text-slate-400">
					Review open requests and assign building maintenance staff.
				</p>
			</div>
			<AgentIssuesPanel />
		</div>
	);
}
