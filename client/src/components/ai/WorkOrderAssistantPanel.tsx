"use client";

import { useAssistWorkOrderMutation } from "@/lib/redux/features/ai/aiAPISlice";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ClipboardList, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

type Props = {
	issueId: number | string;
};

export default function WorkOrderAssistantPanel({ issueId }: Props) {
	const [assistWorkOrder, { isLoading, data, isError }] =
		useAssistWorkOrderMutation();

	return (
		<div className="rounded-xl border border-surface-border bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/50">
			<div className="flex gap-3">
				<div className="flex size-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400">
					<Sparkles className="size-5" />
				</div>
				<div>
					<h3 className="font-semibold text-ink dark:text-slate-100">
						Work order assistant
					</h3>
					<p className="mt-1 text-sm text-ink-muted dark:text-slate-400">
						Summaries, tenant reply drafts, duplicate detection, and escalation
						guidance for staff.
					</p>
				</div>
			</div>

			<Button
				onClick={() => assistWorkOrder(issueId)}
				disabled={isLoading}
				className="electricIndigo-gradient mt-5 gap-2"
			>
				{isLoading ? (
					<>
						<Loader2 className="size-4 animate-spin" />
						Analyzing work order…
					</>
				) : (
					<>
						<ClipboardList className="size-4" />
						Generate staff insights
					</>
				)}
			</Button>

			{isError && (
				<p className="mt-4 text-sm text-red-600 dark:text-red-400">
					Could not generate work order insights. Staff access may be required.
				</p>
			)}

			{data && (
				<div className="mt-5 space-y-4 rounded-lg border border-surface-border bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
					{data.should_escalate && (
						<div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
							<AlertTriangle className="mt-0.5 size-4 shrink-0" />
							<span>Escalation recommended for this work order.</span>
						</div>
					)}

					<div>
						<p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
							Summary
						</p>
						<p className="mt-2 text-sm text-ink-muted dark:text-slate-300">
							{data.work_order_summary}
						</p>
					</div>

					<div>
						<p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
							Suggested tenant message
						</p>
						<p className="mt-2 text-sm text-ink-muted dark:text-slate-300">
							{data.suggested_tenant_response}
						</p>
					</div>

					<div>
						<p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
							Escalation guidance
						</p>
						<p className="mt-2 text-sm text-ink-muted dark:text-slate-300">
							{data.escalation_recommendation}
						</p>
					</div>

					{data.duplicate_issues && data.duplicate_issues.length > 0 && (
						<div>
							<p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
								Possible duplicates
							</p>
							<ul className="mt-2 space-y-2">
								{data.duplicate_issues.map((dup) => (
									<li key={dup.id}>
										<Link
											href={`/issue/${dup.id}`}
											className="text-sm text-brand-600 hover:underline dark:text-brand-400"
										>
											{dup.title} · Unit {dup.unit} ({dup.status})
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
