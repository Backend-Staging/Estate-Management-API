"use client";

import PostCard from "@/components/cards/PostCard";
import TenantHero from "./TenantHero";
import TenantQuickActions from "./TenantQuickActions";
import TenantWelcome from "./TenantWelcome";
import MyMaintenancePreview from "./MyMaintenancePreview";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";

export default function TenantHome() {
	const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-10">
			{isAuthenticated ? <TenantWelcome /> : <TenantHero />}
			{isAuthenticated && <TenantQuickActions />}
			{isAuthenticated && <MyMaintenancePreview />}

			<section id="building-board" className="scroll-mt-28 space-y-4">
				<div>
					<h2 className="font-display text-xl font-bold tracking-tight text-ink dark:text-slate-100">
						Building board
					</h2>
					<p className="mt-1 text-sm text-ink-muted dark:text-slate-400">
						{isAuthenticated
							? "See what neighbors are sharing — events, for-sale items, questions, and community updates."
							: "Take a look at what neighbors are posting — sign in when you're ready to join the conversation."}
					</p>
				</div>
				<PostCard />
			</section>
		</div>
	);
}
