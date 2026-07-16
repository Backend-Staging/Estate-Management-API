"use client";

import {
	useQueryKnowledgeMutation,
	type KnowledgeSource,
} from "@/lib/redux/features/ai/aiAPISlice";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { BrainCircuit, Loader2, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const SAMPLE_QUESTIONS = [
	"Can I install a washer in my unit?",
	"What happens during a maintenance emergency?",
	"How do I report water damage?",
];

export default function KnowledgeAssistantPanel() {
	const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [sources, setSources] = useState<KnowledgeSource[]>([]);
	const [queryKnowledge, { isLoading }] = useQueryKnowledgeMutation();

	const handleAsk = async (value: string) => {
		const q = value.trim();
		if (!q || !isAuthenticated) return;

		setQuestion(q);
		try {
			const result = await queryKnowledge({ question: q }).unwrap();
			setAnswer(result.answer);
			setSources(result.sources ?? []);
		} catch {
			setAnswer(
				"We couldn't look that up right now. Try again or contact building staff.",
			);
			setSources([]);
		}
	};

	return (
		<div className="rounded-xl border border-surface-border bg-surface p-6 shadow-card dark:border-slate-700 dark:bg-slate-900/60">
			<div className="flex items-start gap-3">
				<div className="flex size-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400">
					<BrainCircuit className="size-5" />
				</div>
				<div className="flex-1">
					<h3 className="font-semibold text-ink dark:text-slate-100">
						Property Knowledge Assistant
					</h3>
					<p className="mt-1 text-sm text-ink-muted dark:text-slate-400">
						Ask about leases, policies, emergencies, and maintenance FAQs.
					</p>
				</div>
			</div>

			<div className="mt-5 flex flex-wrap gap-2">
				{SAMPLE_QUESTIONS.map((q) => (
					<button
						key={q}
						type="button"
						onClick={() => handleAsk(q)}
						disabled={!isAuthenticated || isLoading}
						className="rounded-full border border-surface-border bg-slate-50 px-3 py-1.5 text-xs text-ink-muted transition hover:border-brand-500/30 hover:text-brand-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400"
					>
						{q}
					</button>
				))}
			</div>

			<form
				className="mt-4 flex gap-2"
				onSubmit={(e) => {
					e.preventDefault();
					handleAsk(question);
				}}
			>
				<input
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
					placeholder={
						isAuthenticated
							? "Ask a building or policy question…"
							: "Sign in to ask questions"
					}
					disabled={!isAuthenticated || isLoading}
					className="flex-1 rounded-lg border border-surface-border bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
				/>
				<Button
					type="submit"
					disabled={!isAuthenticated || isLoading || !question.trim()}
					className="electricIndigo-gradient gap-2"
				>
					{isLoading ? (
						<Loader2 className="size-4 animate-spin" />
					) : (
						<Send className="size-4" />
					)}
					Ask
				</Button>
			</form>

			{answer && (
				<div className="mt-5 rounded-lg border border-surface-border bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
					<p className="text-sm leading-relaxed text-ink dark:text-slate-200">
						{answer}
					</p>
					{sources.length > 0 && (
						<div className="mt-4 space-y-2">
							<p className="text-xs font-medium uppercase tracking-wider text-ink-subtle">
								Sources
							</p>
							{sources.map((source) => (
								<div
									key={source.slug}
									className="flex items-start gap-2 text-xs text-ink-muted dark:text-slate-400"
								>
									<MessageSquare className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
									<span>
										<span className="font-medium text-ink dark:text-slate-300">
											{source.title}
										</span>
										{" — "}
										{source.excerpt}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
