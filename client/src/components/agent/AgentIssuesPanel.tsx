"use client";

import {
	useGetAgentIssuesQuery,
	useUpdateIssueMutation,
} from "@/lib/redux/features/issues/issueApiSlice";
import { useGetRepairStaffQuery } from "@/lib/redux/features/agents/agentsApiSlice";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import { extractErrorMessage } from "@/utils";
import { toast } from "react-toastify";

export default function AgentIssuesPanel() {
	const { data, isLoading } = useGetAgentIssuesQuery();
	const { data: staffData } = useGetRepairStaffQuery();
	const [updateIssue, { isLoading: isUpdating }] = useUpdateIssueMutation();

	const issues = Array.isArray(data?.issues)
		? data.issues
		: (data?.issues?.results ?? []);
	const staff = Array.isArray(staffData?.repair_staff)
		? staffData.repair_staff
		: (staffData?.repair_staff?.results ?? []);

	const assignStaff = async (issueId: string, assignedTo: string) => {
		try {
			await updateIssue({
				issueId,
				status: "in_progress",
				assigned_to: assignedTo,
			}).unwrap();
			toast.success("Maintenance staff assigned.");
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center py-16">
				<Spinner size="xl" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{issues.length === 0 ? (
				<p className="text-sm text-ink-muted dark:text-slate-400">
					No maintenance requests yet.
				</p>
			) : (
				issues.map((issue) => {
					const buildingStaff = staff.filter(
						(member) => member.assigned_building === issue.apartment_building,
					);
					return (
						<div
							key={issue.id}
							className="rounded-xl border border-surface-border bg-surface p-5 shadow-card dark:border-slate-700 dark:bg-slate-900/60"
						>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<h3 className="font-semibold text-ink dark:text-slate-100">
										{issue.title}
									</h3>
									<p className="mt-1 text-sm text-ink-muted dark:text-slate-400">
										Unit {issue.apartment_unit} · {issue.apartment_building} ·{" "}
										{issue.reported_by}
									</p>
									<p className="mt-2 text-sm text-ink-muted dark:text-slate-500">
										{issue.description}
									</p>
								</div>
								<span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-300">
									{issue.status.replace("_", " ")}
								</span>
							</div>
							<div className="mt-4 flex flex-wrap items-center gap-2">
								<span className="text-xs text-ink-muted">
									Assigned: {issue.assigned_to_name || "Unassigned"}
								</span>
								{buildingStaff.map((member) => (
									<Button
										key={member.id}
										size="sm"
										variant="outline"
										disabled={isUpdating}
										onClick={() =>
											assignStaff(issue.id, member.user_id ?? member.id)
										}
									>
										Assign {member.full_name}
									</Button>
								))}
							</div>
						</div>
					);
				})
			)}
		</div>
	);
}
