import { VISION_ROADMAP } from "@/constants/platform";
import { CheckCircle2 } from "lucide-react";

export default function VisionRoadmap() {
	return (
		<section className="space-y-6">
			<div>
				<h2 className="font-display text-xl font-bold tracking-tight text-ink dark:text-slate-100 sm:text-2xl">
					Product vision & roadmap
				</h2>
				<p className="mt-2 text-sm text-ink-muted dark:text-slate-400">
					From core SaaS operations to AI automation and cloud-native scale.
				</p>
			</div>

			<div className="grid gap-5 lg:grid-cols-3">
				{VISION_ROADMAP.map((phase, index) => (
					<div
						key={phase.phase}
						className="relative rounded-xl border border-surface-border bg-surface p-6 shadow-card dark:border-slate-700 dark:bg-slate-900/60"
					>
						<div className="mb-4 flex items-center gap-3">
							<span className="flex size-8 items-center justify-center rounded-full bg-brand-500/10 text-sm font-bold text-brand-700 dark:text-brand-300">
								{index + 1}
							</span>
							<div>
								<p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
									{phase.phase}
								</p>
								<h3 className="font-semibold text-ink dark:text-slate-100">
									{phase.title}
								</h3>
							</div>
						</div>

						<ul className="space-y-3">
							{phase.items.map((item) => (
								<li
									key={item}
									className="flex items-start gap-2.5 text-sm text-ink-muted dark:text-slate-400"
								>
									<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-500" />
									{item}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>
	);
}
