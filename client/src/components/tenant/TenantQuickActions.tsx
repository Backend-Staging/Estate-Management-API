"use client";

import { EMERGENCY_GUIDANCE, QUICK_ACTIONS } from "@/constants/tenant";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TenantQuickActions() {
	const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

	if (!isAuthenticated) {
		return (
			<div className="rounded-xl border border-dashed border-surface-border bg-slate-50/80 p-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
				<p className="text-sm text-ink-muted dark:text-slate-400">
					Sign in to post on the board, save favorites, and submit maintenance
					requests.
				</p>
				<Link href="/login" className="mt-4 inline-block">
					<Button size="sm" className="electricIndigo-gradient">
						Sign in to get started
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="grid gap-4 sm:grid-cols-3">
				{QUICK_ACTIONS.map((action) => (
					<Link
						key={action.href}
						href={action.href}
						className="group rounded-xl border border-surface-border bg-surface p-5 shadow-card transition hover:border-brand-500/30 hover:shadow-elevated dark:border-slate-700 dark:bg-slate-900/60"
					>
						<h3 className="font-semibold text-ink dark:text-slate-100">
							{action.title}
						</h3>
						<p className="mt-2 text-sm text-ink-muted dark:text-slate-400">
							{action.description}
						</p>
						<span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 dark:text-brand-400">
							{action.cta}
							<ArrowRight className="size-4" />
						</span>
					</Link>
				))}
			</div>

			<div className="flex gap-4 rounded-xl border border-amber-200/80 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
				<AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
				<div className="flex-1">
					<h3 className="font-semibold text-amber-900 dark:text-amber-100">
						{EMERGENCY_GUIDANCE.title}
					</h3>
					<p className="mt-1 text-sm text-amber-800/90 dark:text-amber-200/80">
						{EMERGENCY_GUIDANCE.description}
					</p>
					<Link href={EMERGENCY_GUIDANCE.href} className="mt-3 inline-block">
						<Button
							size="sm"
							variant="outline"
							className="border-amber-300 text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-100"
						>
							{EMERGENCY_GUIDANCE.cta}
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
