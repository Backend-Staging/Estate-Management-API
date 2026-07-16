"use client";

import {
	useGetMyAssignedIssuesQuery,
	useGetMyIssuesQuery,
} from "@/lib/redux/features/issues/issueApiSlice";
import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { Activity, AlertTriangle, Clock, Users } from "lucide-react";

interface StatCardProps {
	label: string;
	value: string | number;
	subtext: string;
	icon: React.ReactNode;
	accent?: "default" | "warning" | "success";
}

function StatCard({ label, value, subtext, icon, accent = "default" }: StatCardProps) {
	const accentRing =
		accent === "warning"
			? "border-amber-500/20"
			: accent === "success"
				? "border-emerald-500/20"
				: "border-brand-500/20";

	return (
		<div
			className={`rounded-xl border bg-surface p-5 shadow-card dark:bg-slate-900/60 ${accentRing}`}
		>
			<div className="flex items-start justify-between">
				<div>
					<p className="text-xs font-medium uppercase tracking-wider text-ink-subtle dark:text-slate-500">
						{label}
					</p>
					<p className="mt-2 font-display text-3xl font-bold text-ink dark:text-slate-100">
						{value}
					</p>
					<p className="mt-1 text-xs text-ink-muted dark:text-slate-400">{subtext}</p>
				</div>
				<div className="rounded-lg bg-brand-500/10 p-2.5 text-brand-600 dark:text-brand-400">
					{icon}
				</div>
			</div>
		</div>
	);
}

export default function OperationsOverview() {
	const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
	const { data: profileData } = useGetUserProfileQuery(undefined, {
		skip: !isAuthenticated,
	});
	const role = profileData?.profile?.role;
	const canFetchMyIssues = role === "tenant";
	const canFetchAssigned = role === "repair";

	const { data: myIssuesData } = useGetMyIssuesQuery(undefined, {
		skip: !isAuthenticated || !canFetchMyIssues,
	});
	const { data: assignedData } = useGetMyAssignedIssuesQuery("", {
		skip: !isAuthenticated || !canFetchAssigned,
	});

	const myIssues = myIssuesData?.my_issues?.results ?? [];
	const assignedIssues = assignedData?.assigned_issues?.results ?? [];

	const openMyIssues = myIssues.filter((i) => i.status !== "resolved").length;
	const openAssigned = assignedIssues.filter((i) => i.status !== "resolved").length;
	const highPriority = [...myIssues, ...assignedIssues].filter(
		(i) => i.priority === "high" && i.status !== "resolved",
	).length;

	const stats: StatCardProps[] = isAuthenticated
		? [
				{
					label: "My open requests",
					value: openMyIssues,
					subtext: "Maintenance issues you've reported",
					icon: <Activity className="size-5" />,
				},
				{
					label: "Assigned to you",
					value: openAssigned,
					subtext: "Active work orders in your queue",
					icon: <Users className="size-5" />,
				},
				{
					label: "High priority",
					value: highPriority,
					subtext: "Requires immediate attention",
					icon: <AlertTriangle className="size-5" />,
					accent: highPriority > 0 ? "warning" : "default",
				},
				{
					label: "Avg. response",
					value: "—",
					subtext: "Analytics pipeline (roadmap)",
					icon: <Clock className="size-5" />,
				},
			]
		: [
				{
					label: "Open requests",
					value: "—",
					subtext: "Sign in to view live metrics",
					icon: <Activity className="size-5" />,
				},
				{
					label: "AI triage",
					value: "Live",
					subtext: "Maintenance classification engine",
					icon: <AlertTriangle className="size-5" />,
					accent: "success",
				},
				{
					label: "Knowledge assistant",
					value: "Soon",
					subtext: "RAG property Q&A (roadmap)",
					icon: <Users className="size-5" />,
				},
				{
					label: "Response analytics",
					value: "Soon",
					subtext: "Operations dashboard (roadmap)",
					icon: <Clock className="size-5" />,
				},
			];

	return (
		<section className="space-y-4">
			<div>
				<h2 className="font-display text-xl font-bold tracking-tight text-ink dark:text-slate-100">
					Operations overview
				</h2>
				<p className="mt-1 text-sm text-ink-muted dark:text-slate-400">
					Real-time visibility into maintenance and platform AI capabilities.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map((stat) => (
					<StatCard key={stat.label} {...stat} />
				))}
			</div>
		</section>
	);
}
