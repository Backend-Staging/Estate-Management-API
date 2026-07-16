import {
	AI_FEATURES,
	PLATFORM,
	type PlatformFeature,
} from "@/constants/platform";
import PlatformBadge from "./PlatformBadge";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface FeatureGridProps {
	title?: string;
	description?: string;
	features?: PlatformFeature[];
	compact?: boolean;
}

export default function FeatureGrid({
	title = "AI engineering capabilities",
	description = "Intelligent workflows that position CyberSys for production-grade estate operations.",
	features = AI_FEATURES,
	compact = false,
}: FeatureGridProps) {
	return (
		<section className="space-y-6">
			<div>
				<h2 className="font-display text-xl font-bold tracking-tight text-ink dark:text-slate-100 sm:text-2xl">
					{title}
				</h2>
				<p className="mt-2 max-w-3xl text-sm text-ink-muted dark:text-slate-400">
					{description}
				</p>
			</div>

			<div
				className={
					compact
						? "grid gap-4 sm:grid-cols-2"
						: "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
				}
			>
				{features.map((feature) => {
					const Icon = feature.icon;
					const content = (
						<article
							className="group flex h-full flex-col rounded-xl border border-surface-border bg-surface p-5 shadow-card transition hover:border-brand-500/30 hover:shadow-elevated dark:border-slate-700 dark:bg-slate-900/60"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="flex size-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
									<Icon className="size-5" />
								</div>
								<PlatformBadge status={feature.status} />
							</div>

							<h3 className="mt-4 font-semibold text-ink dark:text-slate-100">
								{feature.title}
							</h3>
							<p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted dark:text-slate-400">
								{feature.description}
							</p>

							<ul className="mt-4 space-y-1.5">
								{feature.capabilities.slice(0, compact ? 2 : 4).map((cap) => (
									<li
										key={cap}
										className="flex items-center gap-2 text-xs text-ink-subtle dark:text-slate-500"
									>
										<span className="size-1 rounded-full bg-brand-500" />
										{cap}
									</li>
								))}
							</ul>

							{feature.href && feature.status === "live" && (
								<span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-600 group-hover:gap-2 dark:text-brand-400">
									Open workflow
									<ArrowUpRight className="size-3.5" />
								</span>
							)}
						</article>
					);

					if (feature.href && feature.status === "live") {
						return (
							<Link key={feature.id} href={feature.href} className="block h-full">
								{content}
							</Link>
						);
					}

					return <div key={feature.id}>{content}</div>;
				})}
			</div>

			<p className="text-xs text-ink-subtle dark:text-slate-500">
				{PLATFORM.name} roadmap aligns with the engineering vision documented in the
				project README — live features are operational today; planned items mark the
				path to completion.
			</p>
		</section>
	);
}
