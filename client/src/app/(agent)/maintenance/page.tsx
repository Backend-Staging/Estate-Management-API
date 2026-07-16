import MaintenanceStaffPanel from "@/components/agent/MaintenanceStaffPanel";
import { PLATFORM } from "@/constants/platform";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `Maintenance Staff | ${PLATFORM.name}`,
};

export default function AgentMaintenancePage() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
			<div>
				<h1 className="font-display text-2xl font-bold text-ink dark:text-slate-100">
					Maintenance personnel
				</h1>
				<p className="mt-2 text-sm text-ink-muted dark:text-slate-400">
					Add repair staff by building so residents can request help from the right team.
				</p>
			</div>
			<MaintenanceStaffPanel />
		</div>
	);
}
