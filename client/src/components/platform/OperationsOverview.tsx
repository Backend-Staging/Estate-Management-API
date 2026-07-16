"use client";

import {
	useGetOperationsAnalyticsQuery,
	type OperationsAnalytics,
} from "@/lib/redux/features/ai/aiAPISlice";
import {
	useGetMyAssignedIssuesQuery,
	useGetMyIssuesQuery,
} from "@/lib/redux/features/issues/issueApiSlice";
import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { Activity, AlertTriangle, Clock, Star, Users } from "lucide-react";

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

function staffStats(analytics: OperationsAnalytics): StatCardProps[] {
	return [
		{
			label: "Open requests",
			value: analytics.open_issues,
			subtext: "Active maintenance across your scope",
			icon: <Activity className="size-5" />,
		},
		{
			label: "High priority",
			value: analytics.high_priority_open,
			subtext: "Needs immediate attention",
			icon: <AlertTriangle className="size-5" />,
			accent: analytics.high_priority_open > 0 ? "warning" : "default",
		},
		{
			label: "Avg. resolution",
			value:
				analytics.avg_resolution_days != null
					? `${analytics.avg_resolution_days}d`
					: "—",
			subtext: "Days from report to resolved",
			icon: <Clock className="size-5" />,
		},
		{
			label: "Satisfaction",
			value:
				analytics.avg_satisfaction_rating != null
					? `${analytics.avg_satisfaction_rating}/5`
					: "—",
			subtext: "Technician ratings average",
			icon: <Star className="size-5" />,
			accent: "success",
		},
	];
}

export default function OperationsOverview() {
	const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
	const { data: profileData } = useGetUserProfileQuery(undefined, {
		skip: !isAuthenticated,
	});
	const role = profileData?.profile?.role;
	const isStaff = role === "agent" || role === "repair";

	const { data: analytics } = useGetOperationsAnalyticsQuery(undefined, {
		skip: !isAuthenticated || !isStaff,
	});

	const canFetchMyIssues = role === "tenant";
	const canFetchAssigned = role === "repair";

	const { data: myIssuesData } = useGetMyIssuesQuery(undefined, {
		skip: !isAuthenticated || !canFetchMyIssues,
	});
	const { data: assignedData } = useGetMyAssignedIssuesQuery(undefined, {
		skip: !isAuthenticated || !canFetchAssigned,
	});

	const myIssues = myIssuesData?.my_issues?.results ?? [];
	const assignedIssues = assignedData?.assigned_issues?.results ?? [];

	const openMyIssues = myIssues.filter((i) => i.status !== "resolved").length;
	const openAssigned = assignedIssues.filter((i) => i.status !== "resolved").length;
	const highPriority = [...myIssues, ...assignedIssues].filter(
		(i) => i.priority === "high" && i.status !== "resolved",
	).length;

	const stats: StatCardProps[] =
		isStaff && analytics
			? staffStats(analytics)
			: isAuthenticated
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
							label: "AI triage",
							value: "Live",
							subtext: "Requests are classified automatically",
							icon: <Clock className="size-5" />,
							accent: "success",
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
							value: "Live",
							subtext: "Property policy Q&A",
							icon: <Users className="size-5" />,
						},
						{
							label: "Response analytics",
							value: "Live",
							subtext: "Operations dashboard for staff",
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
					{isStaff
						? "Live maintenance metrics and AI-assisted operations."
						: "Track your requests and building AI features."}
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map((stat) => (
					<StatCard key={stat.label} {...stat} />
				))}
			</div>

			{analytics && analytics.category_breakdown.length > 0 && (
				<div className="rounded-xl border border-surface-border bg-surface p-5 dark:border-slate-700 dark:bg-slate-900/60">
					<h3 className="text-sm font-semibold text-ink dark:text-slate-100">
						Issues by AI category
					</h3>
					<div className="mt-4 flex flex-wrap gap-3">
						{analytics.category_breakdown.map((item) => (
							<div
								key={item.category}
								className="rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800"
							>
								<span className="capitalize text-ink dark:text-slate-200">
									{item.category.replace(/_/g, " ")}
								</span>
								<span className="ml-2 font-semibold text-brand-600 dark:text-brand-400">
									{item.count}
								</span>
							</div>
						))}
					</div>
				</div>
			)}
		</section>
	);
}
