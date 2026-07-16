"use client";

import PlatformBadge from "@/components/platform/PlatformBadge";
import { BrainCircuit, MessageSquare } from "lucide-react";

const SAMPLE_QUESTIONS = [
	"Can I install a washer in my unit?",
	"What happens during a maintenance emergency?",
	"How do I report water damage?",
];

export default function KnowledgeAssistantPanel() {
	return (
		<div className="rounded-xl border border-dashed border-surface-border bg-surface p-6 dark:border-slate-700 dark:bg-slate-900/40">
			<div className="flex items-start gap-3">
				<div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
					<BrainCircuit className="size-5" />
				</div>
				<div className="flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<h3 className="font-semibold text-ink dark:text-slate-100">
							Property Knowledge Assistant
						</h3>
						<PlatformBadge status="planned" />
					</div>
					<p className="mt-1 text-sm text-ink-muted dark:text-slate-400">
						RAG-powered Q&A across leases, HOA guidelines, emergency procedures,
						and maintenance documentation.
					</p>
				</div>
			</div>

			<div className="mt-5 space-y-2">
				<p className="text-xs font-medium uppercase tracking-wider text-ink-subtle">
					Example questions
				</p>
				{SAMPLE_QUESTIONS.map((q) => (
					<div
						key={q}
						className="flex items-center gap-2 rounded-lg border border-surface-border bg-slate-50 px-3 py-2 text-sm text-ink-muted dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400"
					>
						<MessageSquare className="size-3.5 shrink-0 text-brand-500" />
						{q}
					</div>
				))}
			</div>

			<p className="mt-4 text-xs text-ink-subtle dark:text-slate-500">
				Coming in the next platform phase — aligns with the CyberSys RAG roadmap.
			</p>
		</div>
	);
}
