import KnowledgeAssistantPanel from "@/components/ai/KnowledgeAssistantPanel";
import TenantChatAssistant from "@/components/ai/TenantChatAssistant";
import { tenantMetadata } from "@/constants/tenant";

export const metadata = tenantMetadata(
	"Building Help",
	"Ask policy questions and chat with the building assistant.",
);

export default function HelpPage() {
	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-8 pb-10">
			<div>
				<h1 className="font-display text-2xl font-bold text-ink dark:text-slate-100">
					Building help
				</h1>
				<p className="mt-2 text-sm text-ink-muted dark:text-slate-400">
					Get answers about policies, emergencies, and maintenance — or chat with
					the assistant for next steps.
				</p>
			</div>
			<KnowledgeAssistantPanel />
			<TenantChatAssistant />
		</div>
	);
}
