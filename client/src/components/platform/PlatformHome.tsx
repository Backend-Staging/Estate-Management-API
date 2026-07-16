"use client";

import KnowledgeAssistantPanel from "@/components/ai/KnowledgeAssistantPanel";
import FeatureGrid from "./FeatureGrid";
import OperationsOverview from "./OperationsOverview";
import PlatformHero from "./PlatformHero";
import VisionRoadmap from "./VisionRoadmap";
import PostCard from "@/components/cards/PostCard";

export default function PlatformHome() {
	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-10 pb-10">
			<PlatformHero variant="compact" />
			<OperationsOverview />
			<div className="grid gap-6 lg:grid-cols-2">
				<FeatureGrid compact />
				<KnowledgeAssistantPanel />
			</div>
			<VisionRoadmap />

			<section className="space-y-6 border-t border-surface-border pt-10 dark:border-slate-700">
				<div>
					<h2 className="font-display text-xl font-bold tracking-tight text-ink dark:text-slate-100">
						Community board
					</h2>
					<p className="mt-1 text-sm text-ink-muted dark:text-slate-400">
						Tenant discussions, updates, and building announcements.
					</p>
				</div>
				<PostCard />
			</section>
		</div>
	);
}
