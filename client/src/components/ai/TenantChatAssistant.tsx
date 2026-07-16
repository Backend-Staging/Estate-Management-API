"use client";

import { useSendTenantChatMutation } from "@/lib/redux/features/ai/aiAPISlice";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

type ChatMessage = {
	role: "user" | "assistant";
	content: string;
};

export default function TenantChatAssistant() {
	const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [sendTenantChat, { isLoading }] = useSendTenantChatMutation();

	const handleSend = async () => {
		const text = input.trim();
		if (!text || !isAuthenticated) return;

		setMessages((prev) => [...prev, { role: "user", content: text }]);
		setInput("");

		try {
			const result = await sendTenantChat({ message: text }).unwrap();
			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: result.reply },
			]);
		} catch {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content:
						"Sorry, I couldn't respond right now. Try a maintenance request or contact building staff.",
				},
			]);
		}
	};

	return (
		<section className="rounded-xl border border-surface-border bg-surface p-6 shadow-card dark:border-slate-700 dark:bg-slate-900/60">
			<div className="flex items-center gap-3">
				<div className="flex size-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400">
					<MessageCircle className="size-5" />
				</div>
				<div>
					<h2 className="font-semibold text-ink dark:text-slate-100">
						Building assistant
					</h2>
					<p className="text-sm text-ink-muted dark:text-slate-400">
						Ask about policies, maintenance steps, or what to do next.
					</p>
				</div>
			</div>

			<div className="mt-5 max-h-80 space-y-3 overflow-y-auto rounded-lg border border-surface-border bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
				{messages.length === 0 ? (
					<p className="text-sm text-ink-muted dark:text-slate-500">
						{isAuthenticated
							? "Try: “My AC stopped working — what should I do?”"
							: "Sign in to chat with the building assistant."}
					</p>
				) : (
					messages.map((msg, index) => (
						<div
							key={`${msg.role}-${index}`}
							className={`rounded-lg px-3 py-2 text-sm ${
								msg.role === "user"
									? "ml-8 bg-brand-600 text-white"
									: "mr-8 bg-white text-ink dark:bg-slate-800 dark:text-slate-200"
							}`}
						>
							{msg.content}
						</div>
					))
				)}
			</div>

			<form
				className="mt-4 flex gap-2"
				onSubmit={(e) => {
					e.preventDefault();
					handleSend();
				}}
			>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type your question…"
					disabled={!isAuthenticated || isLoading}
					className="flex-1 rounded-lg border border-surface-border bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
				/>
				<Button
					type="submit"
					disabled={!isAuthenticated || isLoading || !input.trim()}
					className="electricIndigo-gradient gap-2"
				>
					{isLoading ? (
						<Loader2 className="size-4 animate-spin" />
					) : (
						<Send className="size-4" />
					)}
				</Button>
			</form>
		</section>
	);
}
