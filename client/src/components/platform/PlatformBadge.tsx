"use client";

import { STATUS_LABELS, type PlatformFeatureStatus } from "@/constants/platform";
import { cn } from "@/lib/utils";

interface PlatformBadgeProps {
	status: PlatformFeatureStatus;
	className?: string;
}

const statusStyles: Record<PlatformFeatureStatus, string> = {
	live: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-500/20",
	beta: "bg-brand-500/10 text-brand-700 dark:text-brand-300 ring-brand-500/20",
	planned: "bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-slate-500/20",
};

export default function PlatformBadge({ status, className }: PlatformBadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
				statusStyles[status],
				className,
			)}
		>
			{STATUS_LABELS[status]}
		</span>
	);
}
