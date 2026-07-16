"use client";

import { TENANT_APP } from "@/constants/tenant";
import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";

export default function TenantWelcome() {
	const { data } = useGetUserProfileQuery();
	const firstName = data?.profile?.first_name;

	return (
		<section className="rounded-2xl border border-surface-border bg-gradient-to-br from-brand-50 to-white p-6 sm:p-8 dark:border-slate-700 dark:from-slate-900 dark:to-slate-900/80">
			<p className="text-sm font-medium text-brand-700 dark:text-brand-300">
				{TENANT_APP.tagline}
			</p>
			<h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink dark:text-slate-100 sm:text-3xl">
				{firstName ? `Hi ${firstName}, welcome back` : `Welcome to ${TENANT_APP.name}`}
			</h1>
			<p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted dark:text-slate-400 sm:text-base">
				Catch up on neighbor posts, share what's happening in the building, or
				request maintenance when something needs fixing.
			</p>
		</section>
	);
}
