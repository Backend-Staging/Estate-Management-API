"use client";

import FeatureGrid from "@/components/platform/FeatureGrid";
import OperationsOverview from "@/components/platform/OperationsOverview";
import PlatformHero from "@/components/platform/PlatformHero";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { useGetUserQuery } from "@/lib/redux/features/auth/authApiSlice";
import Link from "next/link";
import { Building2, UserPlus, Wrench } from "lucide-react";

export default function AgentDashboardPage() {
	const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
	const { data: user, isLoading } = useGetUserQuery(undefined, {
		skip: !isAuthenticated,
	});

	if (isLoading) {
		return (
			<p className="text-sm text-ink-muted dark:text-slate-400">
				Loading account…
			</p>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
			<PlatformHero variant="compact" />

			<div className="rounded-xl border border-surface-border bg-surface p-6 shadow-card dark:border-slate-700 dark:bg-slate-900/60">
				<p className="text-sm text-ink-muted dark:text-slate-400">
					Signed in as{" "}
					<span className="font-semibold text-ink dark:text-slate-200">
						{user?.full_name}
					</span>{" "}
					({user?.email})
				</p>

				<div className="mt-6 grid gap-4 sm:grid-cols-3">
					<Link
						href="/apartment"
						className="flex items-center gap-3 rounded-lg border border-surface-border p-4 transition hover:border-brand-500/30 hover:shadow-card dark:border-slate-700"
					>
						<Building2 className="size-5 text-brand-600 dark:text-brand-400" />
						<div>
							<p className="font-medium text-ink dark:text-slate-100">
								Manage units
							</p>
							<p className="text-xs text-ink-muted dark:text-slate-500">
								Apartments & tenants
							</p>
						</div>
					</Link>
					<Link
						href="/welcome"
						className="flex items-center gap-3 rounded-lg border border-surface-border p-4 transition hover:border-brand-500/30 hover:shadow-card dark:border-slate-700"
					>
						<Wrench className="size-5 text-brand-600 dark:text-brand-400" />
						<div>
							<p className="font-medium text-ink dark:text-slate-100">
								Issue queue
							</p>
							<p className="text-xs text-ink-muted dark:text-slate-500">
								Maintenance operations
							</p>
						</div>
					</Link>
					<Link
						href="/technicians"
						className="flex items-center gap-3 rounded-lg border border-surface-border p-4 transition hover:border-brand-500/30 hover:shadow-card dark:border-slate-700"
					>
						<UserPlus className="size-5 text-brand-600 dark:text-brand-400" />
						<div>
							<p className="font-medium text-ink dark:text-slate-100">
								Repair staff
							</p>
							<p className="text-xs text-ink-muted dark:text-slate-500">
								Technician roster
							</p>
						</div>
					</Link>
				</div>
			</div>

			<OperationsOverview />
			<FeatureGrid compact title="Agent AI toolkit" />
		</div>
	);
}
