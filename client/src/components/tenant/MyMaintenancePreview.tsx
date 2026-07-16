"use client";

import { useGetMyIssuesQuery } from "@/lib/redux/features/issues/issueApiSlice";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyMaintenancePreview() {
	const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
	const { data, isLoading } = useGetMyIssuesQuery(undefined, {
		skip: !isAuthenticated,
	});

	if (!isAuthenticated) {
		return null;
	}

	const issues = data?.my_issues?.results ?? [];
	const openIssues = issues.filter((i) => i.status !== "resolved").slice(0, 3);

	return (
		<section className="rounded-xl border border-surface-border bg-surface p-5 shadow-card dark:border-slate-700 dark:bg-slate-900/60">
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<Wrench className="size-5 text-brand-600 dark:text-brand-400" />
					<h2 className="font-semibold text-ink dark:text-slate-100">
						Your maintenance requests
					</h2>
				</div>
				<Link href="/profile">
					<Button variant="ghost" size="sm" className="text-brand-600">
						View all
					</Button>
				</Link>
			</div>

			{isLoading ? (
				<p className="mt-4 text-sm text-ink-muted">Loading…</p>
			) : openIssues.length > 0 ? (
				<ul className="mt-4 space-y-3">
					{openIssues.map((issue) => (
						<li key={issue.id}>
							<Link
								href={`/issue/${issue.id}`}
								className="block rounded-lg border border-surface-border px-4 py-3 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
							>
								<p className="font-medium text-ink dark:text-slate-100">
									{issue.title}
								</p>
								<p className="mt-1 text-xs capitalize text-ink-muted dark:text-slate-500">
									{issue.status.replace("_", " ")} · Unit {issue.apartment_unit}
								</p>
							</Link>
						</li>
					))}
				</ul>
			) : (
				<p className="mt-4 text-sm text-ink-muted dark:text-slate-400">
					No open requests — everything looks good. Need help with something?{" "}
					<Link
						href="/report-issue"
						className="font-medium text-brand-600 hover:underline dark:text-brand-400"
					>
						Submit a request
					</Link>
					.
				</p>
			)}
		</section>
	);
}
