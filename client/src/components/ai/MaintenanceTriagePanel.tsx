"use client";

import { useTriageMaintenanceIssueMutation } from "@/lib/redux/features/ai/aiAPISlice";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Sparkles } from "lucide-react";

type Props = {
	issueId: number | string;
};

export default function MaintenanceTriagePanel({ issueId }: Props) {
	const [triageMaintenanceIssue, { isLoading, data, isError }] =
		useTriageMaintenanceIssueMutation();

	const handleTriage = async () => {
		try {
			await triageMaintenanceIssue(issueId).unwrap();
		} catch (err) {
			console.error("Error triaging issue:", err);
		}
	};

	return (
		<div className="rounded-xl border border-surface-border bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/50">
			<div className="flex gap-3">
				<div className="flex size-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400">
					<Sparkles className="size-5" />
				</div>
				<div>
					<h3 className="font-semibold text-ink dark:text-slate-100">
						Help us route your request
					</h3>
					<p className="mt-1 text-sm text-ink-muted dark:text-slate-400">
						We'll summarize your issue and send it to the right team so you get
						help sooner.
					</p>
				</div>
			</div>

			<Button
				onClick={handleTriage}
				disabled={isLoading}
				className="electricIndigo-gradient mt-5 gap-2"
			>
				{isLoading ? (
					<>
						<Loader2 className="size-4 animate-spin" />
						Reviewing your request…
					</>
				) : (
					"Analyze & route request"
				)}
			</Button>

			{isError && (
				<p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
					We couldn't process that right now. Please try again in a moment.
				</p>
			)}

			{data && (
				<div className="mt-5 space-y-4 rounded-lg border border-surface-border bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
					{data.emergency && (
						<div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
							<AlertTriangle className="mt-0.5 size-4 shrink-0" />
							<span>
								This may be urgent. If you're in immediate danger, call 911
								first.
							</span>
						</div>
					)}

					<div className="grid gap-3 sm:grid-cols-2">
						<div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
							<p className="text-xs font-medium uppercase text-ink-subtle">
								Type of issue
							</p>
							<p className="mt-1 font-semibold capitalize text-ink dark:text-slate-100">
								{data.category?.replace(/_/g, " ")}
							</p>
						</div>
						<div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
							<p className="text-xs font-medium uppercase text-ink-subtle">
								Priority
							</p>
							<p className="mt-1 font-semibold capitalize text-ink dark:text-slate-100">
								{data.urgency}
							</p>
						</div>
					</div>

					{data.tenant_summary && (
						<div>
							<p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
								Summary for you
							</p>
							<p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-slate-300">
								{data.tenant_summary}
							</p>
						</div>
					)}

					{data.staff_recommendation && (
						<div>
							<p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
								What happens next
							</p>
							<p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-slate-300">
								{data.staff_recommendation}
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
