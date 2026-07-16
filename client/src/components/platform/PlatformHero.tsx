import { PLATFORM, PLATFORM_PILLARS } from "@/constants/platform";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PlatformHeroProps {
	variant?: "landing" | "compact";
}

export default function PlatformHero({ variant = "landing" }: PlatformHeroProps) {
	const isLanding = variant === "landing";

	return (
		<section
			className={
				isLanding
					? "relative overflow-hidden bg-brand-gradient text-white"
					: "relative overflow-hidden rounded-2xl border border-surface-border bg-brand-mesh dark:border-slate-700 dark:bg-slate-900/80"
			}
		>
			{isLanding && (
				<div className="pointer-events-none absolute inset-0 bg-brand-mesh opacity-60" />
			)}
			<div
				className={
					isLanding
						? "relative mx-auto max-w-6xl px-6 py-20 sm:py-28 lg:px-8"
						: "relative px-6 py-8 sm:px-8 sm:py-10"
				}
			>
				<div className="max-w-3xl">
					<p
						className={
							isLanding
								? "mb-4 text-sm font-semibold uppercase tracking-widest text-brand-300"
								: "mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400"
						}
					>
						{PLATFORM.tagline}
					</p>
					<h1
						className={
							isLanding
								? "font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
								: "font-display text-2xl font-bold tracking-tight text-ink dark:text-slate-100 sm:text-3xl"
						}
					>
						{PLATFORM.name}
					</h1>
					<p
						className={
							isLanding
								? "mt-6 text-lg leading-relaxed text-slate-200 sm:text-xl"
								: "mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted dark:text-slate-400 sm:text-base"
						}
					>
						{PLATFORM.description}
					</p>

					{isLanding && (
						<div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
							<Link
								href="/register"
								className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-elevated transition hover:bg-slate-100"
							>
								Get started
								<ArrowRight className="size-4" />
							</Link>
							<Link
								href="/login"
								className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
							>
								Sign in
							</Link>
						</div>
					)}
				</div>

				{isLanding && (
					<div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{PLATFORM_PILLARS.map((pillar) => (
							<div
								key={pillar.title}
								className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
							>
								<pillar.icon className="mb-3 size-6 text-brand-300" />
								<h3 className="font-semibold text-white">{pillar.title}</h3>
								<p className="mt-1 text-sm text-slate-300">{pillar.description}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
